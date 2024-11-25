<?php
class DbConnect
{
    private $server;
    private $port;
    private $user;
    private $password;
    private $dbname;

    const ERR_MODE = PDO::ERRMODE_EXCEPTION;

    public function __construct($server = "localhost", $port = 3306, $user = "root", $password = "", $dbname = "marketplace")
    {
        $this->server = $server;
        $this->port = $port;
        $this->user = $user;
        $this->password = $password;
        $this->dbname = $dbname;
    }

    public function connect()
    {
        try {
            $conn = new PDO("mysql:host={$this->server};port={$this->port};dbname={$this->dbname}", $this->user, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, self::ERR_MODE);
            return $conn;
            
        } catch (PDOException $e) {
            throw new Exception("Database connection error: " . $e->getMessage());
        }
    }
}
?>