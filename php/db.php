<?php
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'user_info';
$dsn = "mysql:host=$host;dbname=$dbname";

try {
  $conn = new PDO($dsn, $user, $password);
  $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
  $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

} catch (PDOException $e) {
  echo $e->getMessage();
}
?>