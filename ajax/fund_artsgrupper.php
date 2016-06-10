<?

include('Db.php');

class Artsgrupper extends Base {

	public function __construct() {
		parent::__construct();

		header('Content-type: application/json');

		$event_id = isset($_GET['event_id']) ? $_GET['event_id'] : false;
		if ($event_id) {
			$SQL='select distinct artsgruppe_dk from event_fund where event_id='.$event_id.' order by artsgruppe_dk asc';
		} else {
			$SQL='select distinct artsgruppe_dk from event_fund order by artsgruppe_dk asc';
		}

		$result=$this->query($SQL);

		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($row['artsgruppe_dk']!='') {
				if ($JSON!='') $JSON.=', ';
				$JSON.='"'.$row['artsgruppe_dk'].'"';
			}
		}
		$JSON='{ "artsgrupper" : [ '.$JSON.' ] }';
		echo $JSON;
	}

}

$artsgrupper = new Artsgrupper();

?>
