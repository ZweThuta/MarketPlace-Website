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

class OrderController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function getOrderByUser($userId)
    {
        try {
            $sql = "SELECT * FROM orders WHERE userId = :userId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($orders) {
                return $this->response(1, 'Orders retrieved successfully.', $orders);
            } else {
                return $this->response(0, 'No orders found.');
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
$orderController = new OrderController();

switch ($method) {

    case 'GET':
        $userId = $_GET['userId'];
        echo $orderController->getOrderByUser($userId);
        break;

    default:
        echo json_encode(["status" => 0, "message" => "Invalid Request Method"]);
        break;
}
