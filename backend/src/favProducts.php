<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle preflight requests (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
include("dbConnect.php");

class FavProductsController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function addFavProduct()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input['userId'], $input['productId'])) {
            echo $this->response(0, "Invalid input. User ID and Product ID are required.");
            return;
        }

        $userId = $input['userId'];
        $productId = $input['productId'];

        try {
            $query = "INSERT INTO favorites (userId, productId) VALUES (:userId, :productId)";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);

            $stmt->execute();

            echo $this->response(1, "Product added to favorites successfully.");
        } catch (PDOException $e) {
            echo $this->response(0, $e->getMessage());
        }
    }

    public function removeFavorite($userId, $productId)
    {
        try {
            $query = "DELETE FROM favorites WHERE userId = :userId AND productId = :productId";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);

            $stmt->execute();

            echo $this->response(1, "Product removed from favorites successfully.");
        } catch (PDOException $e) {
            echo $this->response(0, $e->getMessage());
        }
    }

    public function getFavProducts($userId)
    {
        try {
            $query = "SELECT p.id, p.productName, p.description, p.category, p.price, p.image, p.date,p.quantity,
            u.profile, u.name
            FROM products p
            JOIN favorites f ON p.id = f.productId
            JOIN users u ON f.userId = u.id
            WHERE f.userId = :userId";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();

            $favProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo $this->response(1, "Favorite products retrieved successfully.", $favProducts);
        } catch (PDOException $e) {
            echo $this->response(0, $e->getMessage());
        }
    }
    

    private function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$favProductsController = new FavProductsController();

switch ($method) {
    case 'POST':
        $favProductsController->addFavProduct();
        break;

    case 'GET':
        $userId = $_GET['userId'];
        $favProductsController->getFavProducts($userId);
        break;

    case 'DELETE':
        $userId= $_GET['userId'] ?? null;
        $productId = $_GET['productId'] ?? null;
        $favProductsController->removeFavorite($userId, $productId);
        break;

}
