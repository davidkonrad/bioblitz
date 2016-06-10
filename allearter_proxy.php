<?
$kommando=$_SERVER['QUERY_STRING'];
$fra=strpos($kommando, 'url=')+4;
$url=substr($kommando, $fra);
echo utf8_decode(file_get_contents($url));
?>
