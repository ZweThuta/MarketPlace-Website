<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include("dbConnect.php");

class SearchController {
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function searchProducts()
    {
        if (!isset($_GET['query']) || empty($_GET['query'])) {
            echo $this->response(0, "Search query is missing");
            exit;
        }

        $query = trim($_GET['query']); 

        try {
            $sql = "SELECT products.*, users.name, users.profile 
            FROM products 
            JOIN users 
            ON products.userId = users.id 
            WHERE products.productName LIKE :query 
            OR products.description LIKE :query 
            OR products.category LIKE :query";
    
            $stmt = $this->conn->prepare($sql);

            $searchParam = "%" . $query . "%";
            $stmt->bindParam(':query', $searchParam, PDO::PARAM_STR);

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($results) {
                echo $this->response(1, "Products found", $results);
            } else {
                echo $this->response(0, "No products found");
            }
        } catch (PDOException $e) {
            echo $this->response(0, "Error fetching products: " . $e->getMessage());
        }
    }

    private function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$searchController = new SearchController();

switch ($method) {
    case 'GET':
        $searchController->searchProducts();
        break;
    default:
        echo json_encode(['status' => 0, 'message' => 'Invalid request method']);
        break;
}
?>
