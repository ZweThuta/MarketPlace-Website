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
                return null; // Token expired
            }

            return $decodedToken['id'];
        }

        return null;
    }

    public function updateUser($data)
    {
        $userId = $this->getAuthenticatedUserId();

        if (!$userId) {
            return $this->response(0, 'Unauthorized or invalid token!');
        }

        try {
            // Validate required fields
            if (empty($data['name']) || empty($data['email']) || empty($data['phno'])) {
                return $this->response(0, 'Name, email, and phone number are required!');
            }

            $uploadDir = "./userProfiles/";
            $profileImage = isset($_FILES['profile']) ? $this->uploadFile($_FILES['profile'], $uploadDir) : null;

            // Prepare SQL query
            $sql = "UPDATE users SET
                name = :name,
                email = :email,
                phno = :phno,
                address = :address,
                note =:note,
                city = :city";

            if ($profileImage) {
                $sql .= ", profile = :profile";
            }

            $sql .= " WHERE id = :id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":name", $data['name']);
            $stmt->bindParam(":email", $data['email']);
            $stmt->bindParam(":phno", $data['phno']);
            $stmt->bindParam(":address", $data['address']);
            $stmt->bindParam(":city", $data['city']);
            $stmt->bindParam(":note", $data['note']);


            if ($profileImage) {
                $stmt->bindParam(":profile", $profileImage);
            }

            $stmt->bindParam(":id", $userId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return $this->response(1, 'User updated successfully.');
            } else {
                return $this->response(0, 'Failed to update user.');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    private function uploadFile($file, $uploadDir)
    {
        if ($file['error'] === UPLOAD_ERR_OK) {
            $fileName = uniqid() . "_" . basename($file['name']);
            $targetFilePath = $uploadDir . $fileName;

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
                return $targetFilePath;
            }
        }
        return null;
    }

    private function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

// Handle request
$method = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();

switch ($method) {
    case 'POST':
        $data = $_POST;
        echo $userController->updateUser($data);
        break;

    default:
        echo $userController->response(0, 'Invalid request method!');
        break;
}
