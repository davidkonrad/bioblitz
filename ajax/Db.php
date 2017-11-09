<?php

class Db {
	private $database;
	private $hostname;
	private $username;
	private $password;
	private $link;
  
	public static function getInstance(){
		static $db = null;
		if ( $db == null ) $db = new Db();
		return $db;
	}

	public function __construct() { 
		$host = $_SERVER["SERVER_ADDR"]; 
		if (($host=='127.0.0.1') || ($host=='::1')) {
			$this->database = 'blitz';
			$this->hostname = 'localhost';
			$this->username = 'root';
			$this->password = 'dadk'; 
		} else {
			$this->database = 'blitz';
			$this->hostname = 'localhost';
			$this->username = 'root';
			$this->password = 'mguGQ&j"a?4\@;aW';
		}

		try {
			$this->link=mysql_connect($this->hostname, $this->username, $this->password);
			if (!$this->link) {
				die('Could not connect: ' . mysql_error());
			} else {
				mysql_select_db ($this->database);
				mysql_set_charset('utf8');
			}

		} catch (Exception $e){
			throw new Exception('Could not connect to database.');
			exit;
 		}
	}

	public function setUTF8() {
		mysql_set_charset('UTF8',$this->link);
	}

	public function setLatin1() {
		mysql_set_charset('Latin1',$this->link);
	}

	public function setASCII() {
		mysql_set_charset('ASCII',$this->link);
	}

	public function exec($SQL) {
		mysql_query($SQL);
	}

	public function query($SQL) {
		$result=mysql_query($SQL);
		return $result;
	}

	public function getRow($SQL) {
		$result=mysql_query($SQL);
		$result=mysql_fetch_assoc($result);
		return $result;
	}

	public function hasData($SQL) {
		$result=mysql_query($SQL);
		return is_array(@mysql_fetch_array($result));
	}

	public function getRecCount($table) {
		$SQL='select count(*) from '.$table;
		$count=$this->getRow($SQL);
		return $count[0];
	}		

	public function q($string, $comma = true) {
		$string=mysql_real_escape_string($string);
		return $comma ? '"'.$string.'",' : '"'.$string.'"';
	}
	
	//	
	//common database functions
	//not nessecarily related to Db, but implemented here so we always have access to them in child classes
	//
	public function getFields($table) {
		$SQL='show columns from '.$table;
		$result=$this->query($SQL);
		$return = array();
		while ($row = mysql_fetch_assoc($result)) {
			$return[]=$row;
		}
		return $return;		
	}

	public function removeLastChar($s) {
		return substr_replace($s ,"", -1);
	}

	public function getLanguages() {
		$SQL='select lang_id, name from zn_languages order by lang_id';
		$result=$this->query($SQL);
		$a=array();
		while ($row=mysql_fetch_array($result)) {
			$a[]=$row;
		}
		return $a;
	}

	//url, current page info
	public function currentDomain() {
		return $_SERVER['HTTP_HOST'];
	}

	public function currentURL() {
		$domain = $this->currentDomain(); 
		$url = "http://" . $domain . $_SERVER['REQUEST_URI'];
		//change & to &amp;
		$url=str_replace('&','&amp;',$url);
		return $url;
	}

	public function currentSemanticName() {
		$url=$this->currentURL();
		$file=explode("/",$url);
		$file=$file[sizeof($file)-1];
		return $file;
	}

	//debug
	public function debug($data) {
		echo '<pre>';
		print_r($data);
		echo '</pre>';
	}

	protected function fileDebug($text) {
		$file = "debug.txt";
		$fh = fopen($file, 'a') or die("");
		fwrite($fh, $text."\n");
		fclose($fh);
	}

	protected function isLocalhost() {
		$host = $_SERVER["SERVER_ADDR"]; 
		if (($host=='127.0.0.1') || ($host=='::1')) {
			return true;
		} else {
			return false;
		}
	}
}

/* base class for AJAX and JSON */
class Base extends Db {
	
	public function __construct() {
		parent::__construct();

		if ($this->isLocalhost()) {
			header('Access-Control-Allow-Origin	: *');
		}
	}

	protected function getError() {
		return '{ "error" : "yes" }';
	}

	protected function createError($error) {
		return '{ "error" : "'.htmlentities($error).'" }';
	}

	protected function getParam($name) {
		return (isset($_GET[$name])) ? urldecode($_GET[$name]) : '';
	}

	//recursive!!
	protected function rowToJSON($row) {
		$JSON='';
		foreach($row as $key=>$value) {

			$value = str_replace("\x0B", '', $value);
			$value = str_replace("\r", '', $value);
			$value = str_replace("\t", '', $value);
			$value = str_replace("\n", '', $value);
			$value = str_replace('"', "'", $value);

			if ($JSON!='') $JSON.=', ';

			if (is_array($value)) {
				$JSON.='"'.$key.'" : [ '.$this->rowToJSON($value).' ] ';
			} else {
				$JSON.='"'.$key.'" : "'.$value.'"';
			}
		}
		$JSON='{'.$JSON.'}';
		return $JSON;
	}
}

	
?>
