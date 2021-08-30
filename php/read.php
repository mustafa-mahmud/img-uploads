<?php
require_once 'db.php';

if (isset($_GET)) {
  $sql = "SELECT * FROM users1";
  $stmt = $conn->prepare($sql);
  $stmt->execute();

  if ($stmt->rowCount()) {
    echo json_encode($stmt->fetchAll());
  } else {
    echo 0;
  }
}
?>