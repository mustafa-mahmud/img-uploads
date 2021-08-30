<?php
session_start();

function nameValidation($name) {
  $name = trim(strip_tags($name));
  $patterns = "/^[a-zA-Z]+$/i";

  if (preg_match($patterns, $name)) {
    return true;
  } else {
    echo 'Name only text are allowed';
  }
}

function ageValidaion($age) {
  $age = trim(strip_tags($age));
  $age = abs(intval($age));
  $patterns = "/^[0-9]+$/i";

  if (preg_match($patterns, $age) && $age !== 0) {
    if (strlen(strval($age)) <= 3) {
      return true;
    } else {
      echo "Only age required";
    }
  } else {
    echo "Only age required";
  }
}

function passValidation($pass) {
  $pass = trim(strip_tags($pass));

  if ($pass) {
    if (strlen($pass) > 4) {
      return true;
    } else {
      echo 'Password must be 5 characters';
    }
  } else {
    echo 'Password is required';
  }
}

function imgValidation($img) {
  if ($img) {
    $name = $img['name'];
    $size = $img['size'];
    $type = $img['type'];
    $error = $img['error'];
    $temp = $img['tmp_name'];
    $validType = ['jpg', 'jpeg', 'png', 'gif'];

    if (!$error || $img === false) {
      $type = explode('/', $type);
      $name = explode('.', $name);
      $type = end($type);

      if (in_array($type, $validType)) {
        if ($size < 3000000) {
          $newName = uniqid(true) . md5(current($name)) . '_' . current($name) . '.' . end($name);
          $path = '../uploads/' . $newName;

          if (move_uploaded_file($temp, $path)) {
            $_SESSION['img-name'] = $newName;
            return true;
          } else {
            echo 'Something wrong, pla try again';
          }
        } else {
          echo 'Image size must be in 3mbs';
        }
      } else {
        echo 'Only jpeg , jpg , png or gif supported';
      }

    } else {
      echo 'Something wrong.';
    }
  } else {
    echo 'Image is required.';
  }
}

?>