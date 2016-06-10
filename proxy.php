<?

if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
	header('HTTP/1.0 403 Forbidden');
    die('You are not allowed to access this file.');     
}

function fileDebug($text) {
	$fh = fopen('debug.txt', 'a') or die();
	fwrite($fh, $text."\n");
	fclose($fh);
}
function is_utf8($string) {
    // From http://w3.org/International/questions/qa-forms-utf-8.html
    return preg_match('%^(?:
          [\x09\x0A\x0D\x20-\x7E]            # ASCII
        | [\xC2-\xDF][\x80-\xBF]             # non-overlong 2-byte
        |  \xE0[\xA0-\xBF][\x80-\xBF]        # excluding overlongs
        | [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}  # straight 3-byte
        |  \xED[\x80-\x9F][\x80-\xBF]        # excluding surrogates
        |  \xF0[\x90-\xBF][\x80-\xBF]{2}     # planes 1-3
        | [\xF1-\xF3][\x80-\xBF]{3}          # planes 4-15
        |  \xF4[\x80-\x8F][\x80-\xBF]{2}     # plane 16
    )*$%xs', $string);
}

header('Content-type: application/json');
$url=$_GET['url'];
/*
if (strpos($url, 'ZZZZ')!==false) {
	$url=str_replace('ZZZZ','?',$url);
	$url=str_replace('AAAA','&',$url);
}
*/
$q=true;
foreach ($_GET as $key=>$value) {
	//$value=rawurlencode($value);
	//$value=str_replace(' ', 'XXX', $value);
	if ($key!='url') {
		$value=urlencode($value);
		if (!$q) {
			$url.='?'.$key.'='.$value;
			$q=true;
		} else {
			$url.='&'.$key.'='.$value;
		}
	}
}
fileDebug($url);
	
//$html=utf8_decode(file_get_contents($url));
$html=file_get_contents($url);
//if (is_utf8($html)) $html=utf8_decode($html);
echo $html;
?>
