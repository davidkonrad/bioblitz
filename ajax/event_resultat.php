<?

include('Db.php');

class EventResultat extends Base {

	public function __construct() {
		parent::__construct();
		if (!isset($_GET['event_id'])) return;
		$this->getInfo();
	}

	protected function getInfo() {
		mysql_set_charset('utf8');

		$SQL='select * from event_fund where event_id='.$_GET['event_id'];
		$result=$this->query($SQL);

		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=', ';
			$JSON.=$this->rowToJSON($row);
		}
		$JSON='{ "fund" : ['.$JSON.'] }';
		echo $JSON;
	}

}

$resultat = new EventResultat();
?>

