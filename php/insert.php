<?php
require_once 'db.php';
require_once 'form-validation.php';

if (isset($_POST)) {
  $name = $_POST['insert-name'];
  $age = $_POST['insert-age'];
  $password = $_POST['insert-password'];
  $img = $_FILES['insert-img-file']['size'] ? $_FILES['insert-img-file'] : false;

  if (nameValidation($name) && ageValidaion($age) && passValidation($password) && imgValidation($img)) {
    $sql = "INSERT INTO users1 (name,age,password,img) VALUES(:name,:age,:password,:image)";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['name' => $name, 'age' => $age, 'password' => md5($password), 'image' => $_SESSION['img-name']]);

    if ($stmt->rowCount()) {
      unset($_SESSION['img-name']);
      echo 'Inserted successfully';
    } else {
      echo 'Something wrong';
    }
  }
}
?>