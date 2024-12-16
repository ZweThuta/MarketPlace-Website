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

class CartController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function getCartByUserId($userId)
    {
        try {
            $sql = "SELECT c.id AS cartId, c.userId, c.productId, c.quantity, 
                           p.productName, p.description, p.price, p.image 
                    FROM cart c 
                    INNER JOIN products p ON c.productId = p.id 
                    WHERE c.userId = :userId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
            $stmt->execute();
            $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($cartItems) {
                return $this->response(1, 'Cart items retrieved successfully.', $cartItems);
            } else {
                return $this->response(0, 'No items found in the cart.');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    // Add a product to the cart
    public function addToCart($userId, $productId, $quantity)
    {
        try {
            $sql = "SELECT id, quantity FROM cart WHERE userId = :userId AND productId = :productId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
            $stmt->bindParam(":productId", $productId, PDO::PARAM_INT);
            $stmt->execute();
            $existingItem = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existingItem) {
                $newQuantity = $existingItem['quantity'] + $quantity;
                $updateSql = "UPDATE cart SET quantity = :quantity WHERE id = :cartId";
                $updateStmt = $this->conn->prepare($updateSql);
                $updateStmt->bindParam(":quantity", $newQuantity, PDO::PARAM_INT);
                $updateStmt->bindParam(":cartId", $existingItem['id'], PDO::PARAM_INT);
                if ($updateStmt->execute()) {
                    return $this->response(1, 'Cart updated successfully.');
                } else {
                    return $this->response(0, 'Failed to update cart.');
                }
            } else {
                $insertSql = "INSERT INTO cart (userId, productId, quantity) VALUES (:userId, :productId, :quantity)";
                $insertStmt = $this->conn->prepare($insertSql);
                $insertStmt->bindParam(":userId", $userId, PDO::PARAM_INT);
                $insertStmt->bindParam(":productId", $productId, PDO::PARAM_INT);
                $insertStmt->bindParam(":quantity", $quantity, PDO::PARAM_INT);
                if ($insertStmt->execute()) {
                    return $this->response(1, 'Product added to cart successfully.');
                } else {
                    return $this->response(0, 'Failed to add product to cart.');
                }
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    public function updateCartItem($cartId, $quantity)
    {
        try {
            $sql = "UPDATE cart SET quantity = :quantity WHERE id = :cartId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":quantity", $quantity, PDO::PARAM_INT);
            $stmt->bindParam(":cartId", $cartId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return $this->response(1, 'Cart item updated successfully.');
            } else {
                return $this->response(0, 'Failed to update cart item.');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    public function deleteCartItem($cartId)
    {
        try {
            $sql = "DELETE FROM cart WHERE id = :cartId";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":cartId", $cartId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return $this->response(1, 'Cart item deleted successfully.');
            } else {
                return $this->response(0, 'Failed to delete cart item.');
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
$cartController = new CartController();

switch ($method) {
    case 'GET':
        $userId = $_GET['userId'] ?? null;
        if ($userId) {
            echo $cartController->getCartByUserId($userId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'User ID is required.']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['userId'], $data['productId'], $data['quantity'])) {
            echo $cartController->addToCart($data['userId'], $data['productId'], $data['quantity']);
        } else {
            echo json_encode(['status' => 0, 'message' => 'User ID, Product ID, and Quantity are required.']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['cartId'], $data['quantity'])) {
            echo $cartController->updateCartItem($data['cartId'], $data['quantity']);
        } else {
            echo json_encode(['status' => 0, 'message' => 'Cart ID and Quantity are required.']);
        }
        break;

    case 'DELETE':
        $cartId = $_GET['cartId'] ?? null;
        if ($cartId) {
            echo $cartController->deleteCartItem($cartId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'Cart ID is required.']);
        }
        break;

    default:
        echo json_encode(['status' => 0, 'message' => 'Invalid request method.']);
        break;
}
