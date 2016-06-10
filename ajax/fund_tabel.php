<?

include('Db.php');

class EventFund extends Base {
	private $event_id;
	private $last_id;

	public function __construct() {
		parent::__construct();
		$this->event_id = $this->getParam('event_id');
		$this->last_id = $this->getParam('last_id');
		$this->getData();
	}

	protected function getTaxonCount($taxon) {
		$SQL='select count(*) as c from event_fund where event_id="'.$this->event_id.'" and taxon="'.$taxon.'"';
		mysql_set_charset('utf8');
		$row=$this->getRow($SQL);
		return $row['c'];
	}

	protected function getMinAgo($timestamp) {
		return floor(abs(time() - strtotime($timestamp)) / 60);
	}

	protected function getBilleder($fund_id) {
		$SQL='select count(*) as c from event_fund_billeder where fund_id='.$fund_id;
		$row=$this->getRow($SQL);
		return $row['c'];
	}

	protected function getData() {
		$SQL='select count(*) as c from event_fund where event_id='.$this->event_id;
		$row=$this->getRow($SQL);
		$count=$row['c'];

		$SQL='select taxon, dknavn, finder_navn, finder_hold, finder_gruppe, artsgruppe_dk, _timestamp, '.
			'endeligt_bestemt, lat, lng, rige_dk, LNR '.
			'from event_fund '.
			'where event_id='.$this->event_id.' '.
			'and first_occurrence=1 order by _timestamp desc';

		mysql_set_charset('utf8');
		$result=$this->query($SQL);

		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=', ';
			$row['billeder']=$this->getBilleder($row['LNR']);
			$row['total']=$count;
			$row['count']=$this->getTaxonCount($row['taxon']);
			$row['minago']=$this->getMinAgo($row['_timestamp']);
			$JSON.=$this->rowToJSON($row);
		}
		$JSON='{ "fund" : ['.$JSON.'] }';
		echo $JSON;
	}
}

$fund = new EventFund();

?>
