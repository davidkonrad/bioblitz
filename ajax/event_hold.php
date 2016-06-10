<?

include('Db.php');

class EventHold extends Base {
	private $event_id;

	public function __construct() {
		parent::__construct();
		$this->event_id = $this->getParam('event_id');
		$this->getInfo();
	}

	protected function getInfo() {
		$SQL='select distinct finder_hold from event_fund where event_id='.$this->event_id.' order by finder_hold';
		//mysql_set_charset('utf8');
		$result=$this->query($SQL);
		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=', ';
			$JSON.='"'.$row['finder_hold'].'"';
		}
		$JSON='{ "hold" : [ '.$JSON.' ] }';
		echo $JSON;
	}
}

$eventhold = new EventHold();

?>

