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

class ProductController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function getProductById($productId)
    {
        try {
            $sql = "SELECT * FROM products WHERE id = :productId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":productId", $productId, PDO::PARAM_INT);
            $stmt->execute();
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($product) {
                return $this->response(1, 'Product retrieved successfully.', $product);
            } else {
                return $this->response(0, 'Product not found.');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    public function deleteProduct($productId)
    {
        try {
             
            $sql = "SELECT image, secondImage, thirdImage, fourthImage FROM products WHERE id = :productId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":productId", $productId, PDO::PARAM_INT);
            $stmt->execute();
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                return $this->response(0, 'Product not found.');
            }

            
            foreach (['image', 'secondImage', 'thirdImage', 'fourthImage'] as $imageField) {
                if (!empty($product[$imageField]) && file_exists($product[$imageField])) {
                    unlink($product[$imageField]);
                }
            }

            
            $sql = "DELETE FROM products WHERE id = :productId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":productId", $productId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return $this->response(1, 'Product deleted successfully!');
            } else {
                return $this->response(0, 'Failed to delete product.');
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
    case 'GET':
        $productId = $_GET['productId'] ?? null;
        if ($productId) {
            echo $productController->getProductById($productId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'Product ID is required.']);
        }
        break;

    case 'DELETE':
        $productId = $_GET['productId'] ?? null;  
        if ($productId) {
            echo $productController->deleteProduct($productId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'Product ID is required.']);
        }
        break;

    default:
        echo json_encode(['status' => 0, 'message' => 'Invalid request method.']);
        break;
}
