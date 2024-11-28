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


            $sql = "INSERT INTO products (userId, productName, description, quality, price, category, quantity, image, secondImage, thirdImage, fourthImage) 
                    VALUES (:userId, :productName, :description, :quality, :price, :category, :quantity, :image, :secondImage, :thirdImage, :fourthImage)";
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

    private function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $productController = new ProductController();
    echo $productController->addProduct($_POST);
}
