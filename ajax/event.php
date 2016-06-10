<?

include('Db.php');

class EventInfo extends Base {
	private $event_id;

	public function __construct() {
		parent::__construct();
		$this->event_id=(isset($_GET['event_id'])) ? $_GET['event_id'] : 0;
		if ($this->event_id>0) {
			$this->getInfo();
		} else {
			echo '{ "error" : "yes" }';
		}
	}

	protected function getInfo() {
		$SQL='select * from events where id='.$this->event_id;
		mysql_set_charset('utf8');
		$row=$this->getRow($SQL);
		echo $this->rowToJSON($row);
	}
}

$event = new EventInfo();

?>	
	

