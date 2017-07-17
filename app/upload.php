<?php
// проверяем, что есть файл
if((!empty($_FILES["uploaded_file"])) && ($_FILES['uploaded_file']['error'] == 0)) {
  // проверяем, что файл это изображение JPEG и его размер не больше 350кб
  $filename = basename($_FILES['uploaded_file']['name']);

  $ext = substr($filename, strpos($filename, '.') + 1);

  if (($ext == "xml") && ($_FILES["uploaded_file"]["size"] < 999999999999999)) {
    $filename = 'workSpace.xml';

    // путь для сохранения файла
      $newname = dirname(__FILE__).'/upload/'.$filename;
      // проверяем, файл с таким названием уже есть на сервере
      if (($ext == "xml")) {
        // переместить загруженный файл в новое место
        if ((move_uploaded_file($_FILES['uploaded_file']['tmp_name'],$newname))) {
        	echo "<h1>Фаил загружаеться , подождите </h1>";
        	
    
        } else {
           echo "Произошла ошибка при загрузке файла!";
        }
      } else {
         echo "Ошибка: файл ".$_FILES["uploaded_file"]["name"]." уже существует";
      }
  } else {
    echo "<h1>Это не xml</h1>";
    echo "<h2>Жди</h2>";
    echo "<script>
              
          setTimeout('window.history.back(2)', 1000)  
        </script>";
  }
} else {
 echo "Ошибка: файл не загружен!";
}
?>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="jquery-3.1.1.min.js"></script>
  <link rel="stylesheet" href="css/global.css">
</head>
<body>
   

  <div id="preloader-holder" class="preloadHide">
    <div id="preloader">
      <div class="preloader-item"></div>
    </div>
  </div>


    <script>

      setTimeout(function () { $("#preloader-holder").remove(); },1500);

      setTimeout(function () { document.location.href = "http://prabu.ru/test3/"; }, 1500); 
    
   </script>
</body>
</html>