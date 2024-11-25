<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
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
                    'exp' => time() + (86400) // 1 day expiration
                ];

                $token = base64_encode(json_encode($tokenData));

                return $this->response(1, 'Login successful!', ['token' => $token]);
            } else {
                return $this->response(0, 'Invalid email or password!');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    private function response($status, $message, $data = null)
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
}
?>