<?

include('Db.php');

class Lookup extends Base {

	public function __construct() {
		parent::__construct();

		mysql_set_charset('utf8');
		
		header('Content-type: application/json');

		$lookup = (isset($_GET['lookup'])) ? $_GET['lookup'] : false;
		$find = (isset($_GET['find'])) ? $_GET['find'] : false;
		$event_id = (isset($_GET['event_id'])) ? $_GET['event_id'] : false;

		if ($lookup && $find && $event_id) switch($lookup) {
			case 'hold' :
				$this->lookup('finder_hold', $find, $event_id);
				break;

			case 'gruppe' :
				$this->lookup('finder_gruppe', $find, $event_id);
				break;

			case 'navn' :
				$this->lookup('finder_navn', $find, $event_id);
				break;

			case 'bestemmer' :
				$this->lookup('bestemmer', $find, $event_id);
				break;

			case 'indtaster' :
				$this->lookup('indtaster', $find, $event_id);
				break;

			default : 
				break;
		}
	}

	protected function lookup($field, $find, $event_id) {
		$SQL='select distinct '.$field.' from event_fund '.
			'where '.$field.' like "%'.$find.'%" '.
			'and event_id='.$event_id;

		mysql_set_charset('utf8');

		$result=mysql_query($SQL);

		$json = [];
		while ($row = mysql_fetch_assoc($result)) {
			$json[] = $row[$field];
		}
		$json = array('options' => $json);
		echo json_encode($json);
	}
}

$lookup = new Lookup();

?>
