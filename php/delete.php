<?php
require_once 'db.php';

if (isset($_POST)) {
  $idSrc = json_decode(file_get_contents('php://input'));

  $id = $idSrc->id;
  $img = '../' . $idSrc->img;

  $sql = "DELETE FROM users1 WHERE id=:id";
  $stmt = $conn->prepare($sql);
  $stmt->execute(['id' => $id]);

  if ($stmt->rowCount()) {
    echo 'Deleted successfully';
    unlink($img);
  } else {
    echo 'Something wrong';
  }
}
?>