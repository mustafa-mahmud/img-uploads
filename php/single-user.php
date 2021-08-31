<?php
require_once 'db.php';

if (isset($_POST)) {
  $name = $_POST['user-name'];
  $password = md5($_POST['user-password']);

  $sql = "SELECT name,age,img FROM users1 WHERE name=:name AND password=:pass";
  $stmt = $conn->prepare($sql);
  $stmt->execute(['name' => $name, 'pass' => $password]);

  if ($stmt->rowCount()) {
    $res = $stmt->fetch();

    echo json_encode($res);
  } else {
    echo 'name or password is wrong';
  }
}
?>