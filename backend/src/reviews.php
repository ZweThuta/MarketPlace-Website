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

class ReviewController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function addReview()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!isset($input['productId'], $input['ownerId'], $input['userId'], $input['comment'], $input['rating'])) {
            echo $this->response(0, "Invalid input. All fields are required.");
            return;
        }

        $productId = $input['productId'];
        $ownerId = $input['ownerId'];
        $userId = $input['userId'];
        $comment = trim($input['comment']);
        $rating = intval($input['rating']);
        $date = date("Y-m-d");

        if (empty($comment)) {
            echo $this->response(0, "Comment cannot be empty.");
            return;
        }

        if ($rating < 1 || $rating > 5) {
            echo $this->response(0, "Rating must be between 1 and 5.");
            return;
        }

        try {
            $query = "INSERT INTO reviews (productId, ownerId, userId, comment, rating, date) 
                      VALUES (:productId, :ownerId, :userId, :comment, :rating, :date)";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
            $stmt->bindParam(':ownerId', $ownerId, PDO::PARAM_INT);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':comment', $comment, PDO::PARAM_STR);
            $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
            $stmt->bindParam(':date', $date, PDO::PARAM_STR);

            if ($stmt->execute()) {
                echo $this->response(1, "Review added successfully.");
            } else {
                echo $this->response(0, "Failed to add review. Please try again.");
            }
        } catch (Exception $e) {
            echo $this->response(0, "An error occurred: " . $e->getMessage());
        }
    }

    public function getReviews($productId)
    {
        try {
            $query = "SELECT r.id, r.comment, r.rating, r.date, r.userId, u.name, u.email, u.profile
                  FROM reviews r 
                  INNER JOIN users u ON r.userId = u.id
                  WHERE r.productId = :productId
                  ORDER BY r.date DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
            $stmt->execute();

            $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($reviews) {
                echo $this->response(1, "Reviews fetched successfully.", $reviews);
            } else {
                echo $this->response(0, "No reviews found for this product.");
            }
        } catch (Exception $e) {
            echo $this->response(0, "An error occurred: " . $e->getMessage());
        }
    }

    public function getAverageRating($productId)
    {
        try {
            $query = "SELECT AVG(rating) AS averageRating FROM reviews WHERE productId = :productId";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $averageRating = $result['averageRating'] ?? 0;

            echo $this->response(1, "Average rating fetched successfully.", ['averageRating' => round($averageRating, 1)]);
        } catch (Exception $e) {
            echo $this->response(0, "An error occurred: " . $e->getMessage());
        }
    }

    public function deleteReview($reviewId)
{
    try {
        $sql = "SELECT * FROM reviews WHERE id = :reviewId";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':reviewId', $reviewId, PDO::PARAM_INT);
        $stmt->execute();
        $review = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$review) {
            return json_encode(['status' => 0, 'message' => 'Review not found.']);
        }

        $sql = "DELETE FROM reviews WHERE id = :reviewId";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':reviewId', $reviewId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return json_encode(['status' => 1, 'message' => 'Review deleted successfully.']);
        } else {
            return json_encode(['status' => 0, 'message' => 'Failed to delete the review.']);
        }
    } catch (PDOException $e) {
        return json_encode(['status' => 0, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}


    private function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$reviewController = new ReviewController();

switch ($method) {
    case 'POST':
        $reviewController->addReview();
        break;

    case 'GET':
        if (isset($_GET['productId'])) {
            $productId = intval($_GET['productId']);
            if (isset($_GET['average'])) {
                $reviewController->getAverageRating($productId);
            } else {
                $reviewController->getReviews($productId);
            }
        } else {
            echo json_encode(['status' => 0, 'message' => 'Product ID is required.']);
        }
        break;

    case 'DELETE':
        $reviewId = $_GET['reviewId'] ?? null;
        if ($reviewId) {
            echo $reviewController->deleteReview($reviewId);
        } else {
            echo json_encode(['status' => 0, 'message' => 'Review ID is required.']);
        }
        break;

    default:
        echo json_encode(['status' => 0, 'message' => 'Invalid request method.']);
        break;
}
