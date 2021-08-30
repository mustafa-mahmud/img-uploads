<?php
require_once 'db.php';

if (isset($_POST)) {
  $id = json_decode(file_get_contents('php://input'));

  $sql = "DELETE FROM users1 WHERE id=:id";
  $stmt = $conn->prepare($sql);
  $stmt->execute(['id' => $id]);

  if ($stmt->rowCount()) {
    echo 'Deleted successfully';
  } else {
    echo 'Something wrong';
  }
}
?>