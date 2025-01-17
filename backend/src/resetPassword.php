<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json");


require './PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require './PHPMailer-master/PHPMailer-master/src/SMTP.php';
require './PHPMailer-master/PHPMailer-master/src/Exception.php';


include "dbConnect.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($to, $subject, $message)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'tirrr665@gmail.com';
        $mail->Password = 'ctsw nnhe htlf pnwa';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('tirrr665@gmail.com', 'TrendHaven');
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;

        $mail->send();
        return true;
    } catch (Exception) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

class UserController
{
    private $conn;

    public function __construct()
    {
        $db = new dbConnect();
        $this->conn = $db->connect();
    }

    public function forgotPassword($email)
    {
        try {
            $sql = "SELECT id, email FROM users WHERE email = :email";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            if ($stmt->rowCount() == 0) {
                return $this->response(0, 'Email not found!');
            }

            $stmt->fetch(PDO::FETCH_ASSOC);
            $resetCode = rand(100000, 999999);

            $updateSql = "UPDATE users SET reset_code = :reset_code WHERE email = :email";
            $updateStmt = $this->conn->prepare($updateSql);
            $updateStmt->bindParam(":reset_code", $resetCode);
            $updateStmt->bindParam(":email", $email);
            $updateStmt->execute();

            // Send email
            $subject = "Password Reset Request";
            $message = "<p>Dear user,</p>
                        <p>We received a request to reset your password. Please use the following code to reset your password:</p>
                        <p><strong>$resetCode</strong></p>
                        <p>If you did not request a password reset, please ignore this email.</p>
                        <p>Thank you,<br>TrendHaven Team</p>";
            if (sendEmail($email, $subject, $message)) {
                return $this->response(1, 'Reset code sent to email!');
            } else {
                return $this->response(0, 'Failed to send email!');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    public function validateResetCode($email, $resetCode)
    {
        try {
            $sql = "SELECT id FROM users WHERE email = :email AND reset_code = :reset_code";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":reset_code", $resetCode);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return $this->response(1, 'Reset code is valid!');
            } else {
                return $this->response(0, 'Invalid reset code!');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    public function resetPassword($email, $newPassword, $resetCode)
    {
        try {
            $sql = "SELECT id FROM users WHERE email = :email AND reset_code = :reset_code";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":reset_code", $resetCode);
            $stmt->execute();

            if ($stmt->rowCount() == 0) {
                return $this->response(0, 'Invalid reset code or email!');
            }

            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $updateSql = "UPDATE users SET password = :password, reset_code = NULL WHERE email = :email";
            $updateStmt = $this->conn->prepare($updateSql);
            $updateStmt->bindParam(":password", $hashedPassword);
            $updateStmt->bindParam(":email", $email);

            if ($updateStmt->execute()) {
                return $this->response(1, 'Password reset successfully!');
            } else {
                return $this->response(0, 'Failed to reset password!');
            }
        } catch (PDOException $e) {
            return $this->response(0, 'Database error: ' . $e->getMessage());
        }
    }

    public function response($status, $message, $data = null)
    {
        return json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    }
}


$method = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();
switch ($method) {
    case 'POST':
        $postData = json_decode(file_get_contents('php://input'), true);
        if (isset($postData['action'])) {
            switch ($postData['action']) {
                case 'forgotPassword':
                    echo $userController->forgotPassword($postData['email']);
                    break;
                case 'resetPassword':
                    echo $userController->resetPassword(
                        $postData['email'],
                        $postData['newPassword'],
                        $postData['resetCode']
                    );
                    break;

                default:
                    echo $userController->response(0, 'Invalid action!');
                    break;
            }
        } else {
            echo $userController->response(0, 'Action is required!');
        }
        break;
}
