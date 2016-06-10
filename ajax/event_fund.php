<?

include('Db.php');

class EventFund extends Base {

	public function __construct() {
		parent::__construct();
		$action=$this->getParam('action');
		switch ($action) {
			case 'get' : 
				$this->getFund();
				break;
			case 'update' : 
				$this->updateFund();
				break;
			case 'create' : 
				$this->createFund();
				break;
			default :
				break;
		}
	}

	protected function getFund() {
		$id=$this->getParam('id');
		if ($id=='') {
			echo $this->getError();
			return;
		}

		mysql_set_charset('utf8');

		$SQL='select * from event_fund where LNR='.$id;
		$row=$this->getRow($SQL);
		if (!is_array($row)) {
			echo $this->getError();
			return;
		}

		$SQL='select filename from event_fund_billeder where fund_id='.$id;
		$result=$this->query($SQL);
		$row['billeder']=array();
		while ($r = mysql_fetch_assoc($result)) {
			$row['billeder'][]=$r['filename'];
		}

		$JSON = $this->rowToJSON($row);
		echo $JSON;
	}

	protected function firstOccurrence($taxon, $event_id) {
		$SQL='select count(*) as c from event_fund where taxon="'.$taxon.'" and event_id="'.$event_id.'"';
		$row=$this->getRow($SQL);
		return ($row['c']>0) ? 0 : 1;
	}

	protected function createFund() {
		$event_id=$this->getParam('event_id');
		$taxon=$this->getParam('taxon');
		$dknavn=$this->getParam('dknavn');
		$finder_navn=$this->getParam('finder_navn');
		$finder_hold=$this->getParam('finder_hold');
		$finder_gruppe=$this->getParam('finder_gruppe');
		$lat=$this->getParam('lat');
		$long=$this->getParam('long');
		$bestemmer=$this->getParam('bestemmer');
		$indtaster=$this->getParam('indtaster');
		$artsgruppe=$this->getParam('artsgruppe');
		$artsgruppe_dk=$this->getParam('artsgruppe_dk');
		$rige_dk=$this->getParam('rige_dk');
		$endeligt_bestemt=$this->getParam('endeligt_bestemt');
		$noter=$this->getParam('noter');

		$SQL='insert into event_fund '.
		'(event_id, taxon, dknavn, finder_navn, finder_hold, finder_gruppe, lat, '.
		'lng, bestemmer, indtaster, artsgruppe, artsgruppe_dk, rige_dk, endeligt_bestemt, '.
		'first_occurrence, noter) values('.

		$this->q($event_id).
		$this->q($taxon).
		$this->q($dknavn).
		$this->q($finder_navn).
		$this->q($finder_hold).
		$this->q($finder_gruppe).		
		$this->q($lat).
		$this->q($long).
		$this->q($bestemmer).
		$this->q($indtaster).
		$this->q($artsgruppe).
		$this->q($artsgruppe_dk).
		$this->q($rige_dk).
		$this->q($endeligt_bestemt).
		$this->q($this->firstOccurrence($taxon, $event_id)).
		$this->q($noter, false).
		')';

		mysql_set_charset('utf8');

		$this->exec($SQL);
		echo (mysql_error()!='') ? mysql_error() : mysql_insert_id();
	}

	protected function updateFund() {
		$event_id=$this->getParam('event_id');
		$taxon=$this->getParam('taxon');
		$dknavn=$this->getParam('dknavn');
		$finder_navn=$this->getParam('finder_navn');
		$finder_hold=$this->getParam('finder_hold');
		$finder_gruppe=$this->getParam('finder_gruppe');
		$lat=$this->getParam('lat');
		$long=$this->getParam('long');
		$bestemmer=$this->getParam('bestemmer');
		$indtaster=$this->getParam('indtaster');
		$artsgruppe=$this->getParam('artsgruppe');
		$artsgruppe_dk=$this->getParam('artsgruppe_dk');
		$rige_dk=$this->getParam('rige_dk');
		$endeligt_bestemt=$this->getParam('endeligt_bestemt');
		$LNR=$this->getParam('update-fund-id');
		$noter=$this->getParam('noter');

		$SQL='update event_fund set '.

			'taxon='.$this->q($taxon).
			'dknavn='.$this->q($dknavn).
			'finder_navn='.$this->q($finder_navn).
			'finder_hold='.$this->q($finder_hold).
			'finder_gruppe='.$this->q($finder_gruppe).		
			'lat='.$this->q($lat).
			'lng='.$this->q($long).
			'bestemmer='.$this->q($bestemmer).
			'indtaster='.$this->q($indtaster).
			'artsgruppe='.$this->q($artsgruppe).
			'rige_dk='.$this->q($rige_dk).
			'endeligt_bestemt='.$this->q($endeligt_bestemt).
			'noter='.$this->q($noter).
			'artsgruppe_dk='.$this->q($artsgruppe_dk, false).
			
			'where LNR="'.$LNR.'"';
	
		//echo $SQL;
		$this->exec($SQL);
		echo (mysql_error()!='') ? mysql_error() : '1'; //need to return a number
	}

}

$fund = new EventFund();

?>
