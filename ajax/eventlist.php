<?

include('Db.php');

class EventList extends Base {

	public function __construct() {
		parent::__construct();
		$this->getInfo();
	}

	protected function getInfo() {
		$scope = isset($_GET['scope']) ? $_GET['scope'] : false;
		switch ($scope) {
			case 'reduced' :
				$SQL='select id, dato, dato_text, titel from events where synlig=1 order by dato';
				break;
			default :
				$SQL='select id, dato, dato_text, titel from events order by dato';
				break;
		}

		$result=$this->query($SQL);
		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=', ';
			$JSON.=$this->rowToJSON($row);
		}
		$JSON='{ "events" : [ '.$JSON.' ] }';
		echo $JSON;
	}
}

$eventlist = new EventList();

?>
