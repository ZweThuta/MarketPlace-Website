<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle preflight requests (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
include("dbConnect.php");

class UserController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function createUser($userData)
    {
        try {
            if ($this->emailExists($userData->email)) {
                return $this->response(0, 'Email already exists!');
            }

            $hashedPassword = password_hash($userData->password, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (name, email, password, date,role) VALUES (:name, :email, :password, NOW(),:role)";
            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(":name", $userData->name);
            $stmt->bindParam(":email", $userData->email);
            $stmt->bindParam(":role", $userData->role);
            $stmt->bindParam(":password", $hashedPassword);

            if ($stmt->execute()) {
                return $this->response(1, 'User  created successfully!');
            } else {
                return $this->response(0, 'Failed to create user!');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    public function getAllUsers()
    {
        try {
            $sql = "SELECT id, name, email, date, phno, address, city, profile, note, banner, role FROM users";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $this->response(1, 'Users retrieved successfully!', $users);
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    private function emailExists($email)
    {
        $sql = "SELECT id FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function deleteUsers($userId)
    {
        try {
            $sql = "SELECT * FROM users WHERE id = :userId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return $this->response(0, 'User not found!');
            }
            $sql = "DELETE FROM users WHERE id = :userId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return json_encode(['status' => 1, 'message' => 'User deleted successfully.']);
            } else {
                return json_encode(['status' => 0, 'message' => 'Failed to delete the user.']);
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
        $userData = json_decode(file_get_contents('php://input'));
        echo $userController->createUser($userData);
        break;

    case 'GET':
        echo $userController->getAllUsers();
        break;

    case 'DELETE':
        $userId = $_GET['userId'] ??  null;
        if ($userId) {
            echo $userController->deleteUsers($userId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'UserId is required.']);
        }
}
