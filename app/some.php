<?php

$fp = fopen("convertBox/convertVersion.xml", "w");
    
fwrite($fp, $_POST['string']);
 
fclose($fp);

?>
