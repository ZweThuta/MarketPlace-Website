<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include("dbConnect.php");

class UserController {
    private $conn;

    public function __construct() {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function createUser ($userData) {
        try {
            if ($this->emailExists($userData->email)) {
                return $this->response(0, 'Email already exists!');
            }
            
            $hashedPassword = password_hash($userData->password, PASSWORD_DEFAULT);
            
            $sql = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
            $stmt = $this->conn->prepare($sql);
            
            $stmt->bindParam(":name", $userData->name);
            $stmt->bindParam(":email", $userData->email);
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
    private function emailExists($email) {
        $sql = "SELECT id FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        return $stmt->rowCount() > 0;  
    }

    private function response($status, $message, $data = null) {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();

switch ($method) {
    case 'POST':
        $userData = json_decode(file_get_contents('php://input'));
        echo $userController->createUser ($userData);
        break;
}
?>