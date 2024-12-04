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
    public function updateProduct($productId, $postData)
    {
        try {
            // Check if the required fields are provided
            if (empty($postData['productName']) || empty($postData['description']) || empty($postData['quality']) || empty($postData['price']) || empty($postData['category']) || empty($postData['quantity'])) {
                return $this->response(0, 'All fields are required.');
            }
    
            // Path for uploading images
            $uploadDir = "./productImages/";
    
            // Handle file uploads for images (only update if a new image is uploaded)
            $coverImage = isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK ? $this->uploadFile($_FILES['image'], $uploadDir) : null;
            $secondImage = isset($_FILES['secondImage']) && $_FILES['secondImage']['error'] === UPLOAD_ERR_OK ? $this->uploadFile($_FILES['secondImage'], $uploadDir) : null;
            $thirdImage = isset($_FILES['thirdImage']) && $_FILES['thirdImage']['error'] === UPLOAD_ERR_OK ? $this->uploadFile($_FILES['thirdImage'], $uploadDir) : null;
            $fourthImage = isset($_FILES['fourthImage']) && $_FILES['fourthImage']['error'] === UPLOAD_ERR_OK ? $this->uploadFile($_FILES['fourthImage'], $uploadDir) : null;
    
            // Build the SQL update query dynamically
            $fields = [];
            foreach ($postData as $key => $value) {
                if ($key !== 'productId' && !empty($value)) {
                    $fields[] = "$key = :$key";
                }
            }
    
            // Handle image fields if they are set
            if ($coverImage) {
                $fields[] = "image = :image";
                $postData['image'] = $coverImage;  // Use the full file path for the image field
            }
            if ($secondImage) {
                $fields[] = "secondImage = :secondImage";
                $postData['secondImage'] = $secondImage;
            }
            if ($thirdImage) {
                $fields[] = "thirdImage = :thirdImage";
                $postData['thirdImage'] = $thirdImage;
            }
            if ($fourthImage) {
                $fields[] = "fourthImage = :fourthImage";
                $postData['fourthImage'] = $fourthImage;
            }
    
            if (empty($fields)) {
                return $this->response(0, 'No fields to update.');
            }
    
            // Prepare the SQL query for updating the product
            $sql = "UPDATE products SET " . implode(", ", $fields) . " WHERE id = :productId";
            $stmt = $this->conn->prepare($sql);
    
            // Bind parameters dynamically
            foreach ($postData as $key => $value) {
                if ($key !== 'productId' && !empty($value)) {
                    $stmt->bindValue(":$key", $value);
                }
            }
    
            // Bind the productId for the WHERE clause
            $stmt->bindParam(":productId", $productId, PDO::PARAM_INT);
    
            // Execute the query
            if ($stmt->execute()) {
                return $this->response(1, 'Product updated successfully.');
            } else {
                return $this->response(0, 'Failed to update product.');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }
    

// File upload function
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

   case 'PUT':
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (isset($inputData['productId'])) {
        $productId = $inputData['productId'];
        echo $productController->updateProduct($productId, $inputData);
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
