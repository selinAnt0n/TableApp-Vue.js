<?php
 
// Здесь нужно сделать все проверки передаваемых файлов и вывести ошибки если нужно
 
// Переменная ответа
$data = array();
 
if( isset( $_GET['uploadfiles'] ) ){

    $error = false;
    $files = array();

    $uploaddir = './upload/'; // . - текущая папка где находится submit.php
 
    // Создадим папку если её нет
 
    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );
 
    // переместим файлы из временной директории в указанную
    foreach( $_FILES as $file ){
        if( move_uploaded_file( $file['tmp_name'], $uploaddir . basename('workSpace.xml') ) ){
            //$files[] = realpath( $uploaddir . 'workSpace.xml');
             $files[] = realpath( $uploaddir . 'workSpace.xml' );
        }
        else{
            $error = true;
        }
    }
 
    $data = $error ? array('error' => 'Ошибка загрузки файлов.') : array('files' => $files );
 
    echo json_encode( $data );

}