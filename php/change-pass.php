<?php
require_once 'db.php';
require_once 'form-validation.php';

if (isset($_POST)) {
  $oldPass = md5($_POST['old-password']);
  $newPass = md5($_POST['new-password']);
  $id = intval($_POST['id']);

  if (passValidation($oldPass) && passValidation($newPass)) {
    //select data from db
    $sql = "SELECT password,name FROM users1 WHERE id=:id and password=:pass";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['id' => $id, 'pass' => $oldPass]);
    $res = $stmt->fetch();

    // print_r($res);
    if ($stmt->rowCount()) {
      $sql = "UPDATE users1 SET password=:pass WHERE id=:id";
      $stmt = $conn->prepare($sql);
      $stmt->execute(['pass' => $newPass, 'id' => $id]);

      if ($stmt->rowCount()) {
        echo 'Password change successfully';
      } else {
        echo 'Something went wrong';
      }
    } else {
      echo 'Old password wrong';
    }

    // if (count($res)) {
    //   echo 123;
    // } else {
    //   echo 'Password wrong';
    // }
  }
}

?>