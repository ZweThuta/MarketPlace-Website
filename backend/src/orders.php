<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

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
                "INSERT INTO orders (userId, address, city, zip, country, note, totalprice, delivery) 
                 VALUES (:userId, :address, :city, :zip, :country, :note, :totalprice, :delivery)"
            );

            $stmt->execute([
                'userId' => $data['userId'],
                'address' => $data['address'],
                'city' => $data['city'],
                'zip' => $data['zip'],
                'country' => $data['country'],
                'note' => $data['note'],
                'totalprice' => $data['totalprice'],
                'delivery' => $data['delivery']
            ]);

            $orderId = $this->conn->lastInsertId();

            foreach ($data['productId'] as $productId) {
                $stmt = $this->conn->prepare(
                    "INSERT INTO order_products (order_id, product_id, quantity) 
                     VALUES (:order_id, :product_id, :quantity)"
                );
                $stmt->execute([
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'quantity' => 1  
                ]);
            }

         
            $this->conn->commit();

            echo $this->response(1, "Order placed successfully", ['orderId' => $orderId]);
        } catch (PDOException $e) {
            $this->conn->rollBack();
            echo $this->response(0, "Failed to place order", $e->getMessage());
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

    default:
        echo json_encode(["status" => 0, "message" => "Invalid Request Method"]);
        break;
}
