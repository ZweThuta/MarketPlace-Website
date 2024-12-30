<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json");

include("dbConnect.php");

class UserController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    // Login functionality with token generation
    public function login($loginData)
    {
        try {
            if (empty($loginData['email']) || empty($loginData['password'])) {
                return $this->response(0, 'Email and password are required!');
            }

            $sql = "SELECT * FROM users WHERE email = :email";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":email", $loginData['email']);
            $stmt->execute();

            if ($stmt->rowCount() == 0) {
                return $this->response(0, 'Invalid email or password!');
            }

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (password_verify($loginData['password'], $user['password'])) {
                $tokenData = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'exp' => time() + (86400) // Token expiration (1 day)
                ];

                $token = base64_encode(json_encode($tokenData));

                return $this->response(1, 'Login successful!', [
                    'token' => $token,
                    'user_id' => $user['id'],
                    'role' => $user['role']
                ]);
            } else {
                return $this->response(0, 'Invalid email or password!');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }


    private function getAuthenticatedUserId()
    {
        $headers = apache_request_headers();

        if (!isset($headers['Authorization'])) {
            return null;
        }

        $authHeader = $headers['Authorization'];
        $token = str_replace('Bearer ', '', $authHeader);


        $decodedToken = json_decode(base64_decode($token), true);

        if (isset($decodedToken['id']) && isset($decodedToken['exp'])) {

            if ($decodedToken['exp'] < time()) {
                return null;
            }

            return $decodedToken['id'];
        }

        return null;
    }


    public function getUser()
    {
        $userId = $this->getAuthenticatedUserId();

        if (!$userId) {
            return $this->response(0, 'Unauthorized or invalid token!');
        }

        try {
            $sql = "SELECT id, name, email, date, phno, address, city, profile, note, banner, role FROM users WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":id", $userId);
            $stmt->execute();

            if ($stmt->rowCount() == 0) {
                return $this->response(0, 'User not found!');  
            }

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $this->response(1, 'User retrieved successfully!', $user);
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }


    public function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}


$method = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();

switch ($method) {
    case 'POST':
        $loginData = json_decode(file_get_contents('php://input'), true);
        echo $userController->login($loginData);
        break;

    case 'GET':
        echo $userController->getUser();
        break;

    default:
        echo $userController->response(0, 'Invalid request method!');
        break;
}
