<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include("dbConnect.php");

class ProductController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    // Add Product Method
    public function addProduct($postData)
    {
        try {
            if (empty($postData['userId']) || empty($postData['productName']) || empty($postData['description']) || empty($postData['quality']) || empty($postData['price']) || empty($postData['category']) || empty($postData['quantity'])) {
                return $this->response(0, 'All fields are required.');
            }

            $uploadDir = "./productImages/";
            $coverImage = $this->uploadFile($_FILES['image'], $uploadDir);
            $secondImage = $this->uploadFile($_FILES['secondImage'], $uploadDir);
            $thirdImage = $this->uploadFile($_FILES['thirdImage'], $uploadDir);
            $fourthImage = $this->uploadFile($_FILES['fourthImage'], $uploadDir);

            $sql = "INSERT INTO products (userId, productName, description, quality, price, category, quantity, image, secondImage, thirdImage, fourthImage, date) 
                    VALUES (:userId, :productName, :description, :quality, :price, :category, :quantity, :image, :secondImage, :thirdImage, :fourthImage, NOW())";
            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(":userId", $postData['userId']);
            $stmt->bindParam(":productName", $postData['productName']);
            $stmt->bindParam(":description", $postData['description']);
            $stmt->bindParam(":quality", $postData['quality']);
            $stmt->bindParam(":price", $postData['price']);
            $stmt->bindParam(":category", $postData['category']);
            $stmt->bindParam(":quantity", $postData['quantity']);
            $stmt->bindParam(":image", $coverImage);
            $stmt->bindParam(":secondImage", $secondImage);
            $stmt->bindParam(":thirdImage", $thirdImage);
            $stmt->bindParam(":fourthImage", $fourthImage);

            if ($stmt->execute()) {
                return $this->response(1, 'Product added successfully!');
            } else {
                return $this->response(0, 'Failed to add product.');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    private function uploadFile($file, $uploadDir)
    {
        if (isset($file) && $file['error'] == 0) {
            $fileName = basename($file['name']);
            $targetFilePath = $uploadDir . uniqid() . "_" . $fileName;

            if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
                return $targetFilePath;
            } else {
                return null;
            }
        }
        return null;
    }

    // New: Get Products Method
    public function getProducts($userId)
    {
        try {
            $sql = "SELECT * FROM products WHERE userId = :userId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":userId", $userId);
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                                            
            if ($products) {
                return $this->response(1, 'Products retrieved successfully.', $products);
            } else {
                return $this->response(0, 'No products found.');
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
$productController = new ProductController();

switch ($method) {
    case 'POST':
        echo $productController->addProduct($_POST);
        break;
    case 'GET':
        $userId = $_GET['userId'] ?? null;
        if ($userId) {
            echo $productController->getProducts($userId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'User ID is required.']);
        }
        break;
}
