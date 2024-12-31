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

    public function getOrders()
    {
        try {
            $query = "SELECT o.id AS orderId, o.id, o.userId, o.totalprice, o.delivery, o.order_date,
                   u.name, u.email, u.profile, o.phno, o.address, o.city, o.country, o.zip, o.note,
                   p.productName, p.image, p.price, op.quantity
            FROM orders o
            JOIN users u ON o.userId = u.id
            JOIN order_products op ON o.id = op.order_id
            JOIN products p ON op.product_id = p.id
            ORDER BY o.order_date DESC
";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $orders = $stmt->fetchAll();
            if ($orders) {
                echo $this->response(1, "Order data fetched successfully.", $orders);
            } else {
                echo $this->response(0, "No orders found for this user.");
            }
        } catch (PDOException $e) {
            echo $this->response(0, "Failed to fetch orders: " . $e->getMessage());
        }
    }

    public function deleteOrder($orderId)
    {
        try {
            $this->conn->beginTransaction();

            $deleteOrderProducts = "DELETE FROM order_products WHERE order_id = :order_id";
            $stmt = $this->conn->prepare($deleteOrderProducts);
            $stmt->bindParam(':order_id', $orderId, PDO::PARAM_INT);
            $stmt->execute();

            $deleteOrder = "DELETE FROM orders WHERE id = :order_id";
            $stmt = $this->conn->prepare($deleteOrder);
            $stmt->bindParam(':order_id', $orderId, PDO::PARAM_INT);
            $stmt->execute();

            $this->conn->commit();

            if ($stmt->rowCount() > 0) {
                echo $this->response(1, "Order deleted successfully.");
            } else {
                echo $this->response(0, "No order found with the provided ID.");
            }
        } catch (PDOException $e) {
            $this->conn->rollBack();
            echo $this->response(0, "Failed to delete order: " . $e->getMessage());
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
        $orderController->getOrders();
        break;

    case 'DELETE':
        $orderId = isset($_GET['orderId']) ? intval($_GET['orderId']) : 0;
        if ($orderId > 0) {
            $orderController->deleteOrder($orderId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'Invalid or missing order ID.']);
        }
        break;
}
