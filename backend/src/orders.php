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

class OrderController {
    private $conn;

    public function __construct() {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function addOrder() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        try {
            $this->conn->beginTransaction();
            
            $stmt = $this->conn->prepare(
                "INSERT INTO orders (userId,phno, address, city, zip, country, note, totalprice, delivery) 
                 VALUES (:userId, :phno, :address, :city, :zip, :country, :note, :totalprice, :delivery)"
            );

            $stmt->execute([
                'userId' => $data['userId'],
                'phno' => $data['phno'],
                'address' => $data['address'],
                'city' => $data['city'],
                'zip' => $data['zip'],
                'country' => $data['country'],
                'note' => $data['note'],
                'totalprice' => $data['totalprice'],
                'delivery' => $data['delivery']
            ]);

            $orderId = $this->conn->lastInsertId();

            foreach ($data['productId'] as $index => $productId) {
                $stmt = $this->conn->prepare(
                    "INSERT INTO order_products (order_id, product_id, quantity) 
                     VALUES (:order_id, :product_id, :quantity)"
                );
                $stmt->execute([
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'quantity' => $data['quantity'][$index]
                ]);
            }
            

         
            $this->conn->commit();

            echo $this->response(1, "Order placed successfully", ['orderId' => $orderId]);
        } catch (PDOException $e) {
            $this->conn->rollBack();
            echo $this->response(0, "Failed to place order", $e->getMessage());
        }
    }

    public function getOrder() {
        $userId = $_GET['userId'] ?? null;
    
        if (!$userId) {
            echo $this->response(0, "User ID is required.");
            return;
        }
    
        try {
            $query = "
            SELECT o.id AS orderId, o.userId, o.totalprice, o.delivery, o.order_date,
                   u.name, u.email, o.phno, o.address, o.city, o.country, o.zip, o.note,
                   p.productName, p.image, p.price, op.quantity
            FROM orders o
            JOIN users u ON o.userId = u.id
            JOIN order_products op ON o.id = op.order_id
            JOIN products p ON op.product_id = p.id
            WHERE o.userId = :userId
            ORDER BY o.order_date DESC
            ";
    
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            if ($orders) {
                echo $this->response(1, "Order data fetched successfully.", $orders);
            } else {
                echo $this->response(0, "No orders found for this user.");
            }
        } catch (PDOException $e) {
            echo $this->response(0, "Failed to fetch orders: " . $e->getMessage());
        }
    }
    
    private function response($status, $message, $data = null) {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$orderController = new OrderController();

switch ($method) {
    case 'POST':
        $orderController->addOrder();
        break;
    
    case 'GET':
        $orderController->getOrder();
        break;

    default:
        echo json_encode(["status" => 0, "message" => "Invalid Request Method"]);
        break;
}
