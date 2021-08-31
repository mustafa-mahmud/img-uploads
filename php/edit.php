<?php
require_once 'db.php';
require_once 'form-validation.php';

if (isset($_POST)) {
  $name = $_POST['edit-name'];
  $age = $_POST['edit-age'];
  $id = intval($_POST['id']);
  $oldImg = $_POST['old-img'];

  $img = $_FILES['edit-img-file']['size'] ? $_FILES['edit-img-file'] : false;

  if ($img) {
    if (nameValidation($name) && ageValidaion($age) && imgValidation($img)) {
      $sql = "UPDATE users1 SET name=:name,age=:age,img=:img WHERE id=:id";
      $stmt = $conn->prepare($sql);
      $stmt->execute(['name' => $name, 'age' => $age, 'img' => $_SESSION['img-name'], 'id' => $id]);

      if ($stmt->rowCount()) {
        echo 'Edited successfully';
        unlink("../$oldImg");
      } else {
        echo 'Something wrong';
      }
    }
  }

  if (!$img) {
    if (nameValidation($name) && ageValidaion($age)) {
      $sql = "UPDATE users1 SET name=:name,age=:age WHERE id=:id";
      $stmt = $conn->prepare($sql);
      $stmt->execute(['name' => $name, 'age' => $age, 'id' => $id]);

      if (true) {
        echo 'Edited successfully';
      } else {
        echo 'Something went wrong';
      }
    }
  }

}
?>