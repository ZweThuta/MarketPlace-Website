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

class CategoryController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function getCategory(){
        $sql = "SELECT DISTINCT category FROM products";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
    if ($result) {
        echo $this->response(1, "Categories retrieved successfully.", $result);
    } else {
        echo $this->response(0, "No categories found.");
    }
}
    private function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$categoryController = new CategoryController();

switch ($method) {

    case 'GET':
        $categoryController->getCategory();
        break;
        
    default:
        echo json_encode(['status' => 0, 'message' => 'Invalid request method.']);
        break;
}
