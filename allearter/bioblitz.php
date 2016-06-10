<?

header('Content-type: application/json');

include('../common/Db.php');

class BioBlitz extends Db {

	public function __construct() {
		parent::__construct();

		if (isset($_GET['opposit'])) {
			$this->getOpposit();
		} else {
			$this->getQuery();
		}
	}

	protected function getQuery() {
		$param=$_GET['query'];

		$param=urldecode($param);

		$param=str_replace('XXX', ' ', $param);

		$scope=$_GET['scope'];

		$this->fileDebug(print_r($_GET, true));
		$this->fileDebug('query :'.$param.' scope: '.$scope);

		if ($scope=='t') {
			$field='Videnskabeligt_navn';
		} else {
			$field='Dansk_navn';
		}

		$SQL='select '.$field.' from allearter where '.$field.' like "%'.$param.'%" limit 20';

		$this->fileDebug($SQL);

		//mysql_set_charset('utf8');

		$result=$this->query($SQL);
		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=',';
			//$JSON.='"'.utf8_encode($row[$field]).'"';
			$JSON.='"'.$row[$field].'"';
		}
		$JSON='{ "options": ['.$JSON.'] }';
		$this->fileDebug($JSON);
		echo $JSON;
	}

/*
	protected function getQuery() {
		$param=$_GET['query'];
		$param=explode('XXX', $param);

		$scope=$_GET['scope'];

		//$this->fileDebug(print_r($_GET, true));
		//$this->fileDebug('query :'.$param.' scope: '.$scope);

		if ($scope=='t') {
			$field='Videnskabeligt_navn';
		} else {
			$field='Dansk_navn';
		}

		$SQL='select '.$field.' from allearter where ';
		$like='';
		foreach ($param as $p) {
			if ($like!='') $like.=' and ';
			$like.=$field.' like "%'.$p.'%"';
		}
		$SQL.=$like.' limit 20';

		$this->fileDebug($SQL);

		mysql_set_charset('utf8');

		$result=$this->query($SQL);
		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=',';
			$JSON.='"'.$row[$field].'"';
		}
		$JSON='{ "options": ['.$JSON.'] }';
		echo $JSON;
	}
*/
	protected function getOpposit() {	
		//$opposit=utf8_decode($_GET['opposit']);
		$opposit=urldecode($_GET['opposit']);
		$opposit=$_GET['opposit'];
		$opposit=str_replace('XXX',' ',$opposit);
		$scope=$_GET['scope'];

		$this->fileDebug(print_r($_GET, true));
		$this->fileDebug('opposit :'.$opposit.' scope :'.$scope);

		mysql_set_charset('utf8');

		if ($scope=='t') {
			$SQL='select Dansk_navn from allearter where Videnskabeligt_navn="'.$opposit.'"';
			$row=$this->getRow($SQL);
			//$name=utf8_encode($row['Dansk_navn']);
		} else {
			$SQL='select Videnskabeligt_navn from allearter where Dansk_navn="'.$opposit.'"';
			$row=$this->getRow($SQL);
			$name=$row['Videnskabeligt_navn'];
		}

		$this->fileDebug($SQL);

		echo '{ "name" : "'.$name.'" }';
	}

}

$blitz = new BioBlitz();

?>
