<?

include('Db.php');

class FundSoeg extends Base {
	private $SQL;

	public function __construct() {
		parent::__construct();
		$this->createSQL();
		$this->search();
	}

	protected function getWhere($where, $param, $field) {
		if ($this->getParam($param)!='') {
			if ($where!='') $where.=' and ';

			switch ($field) {
				case 'LNR' :
				case 'artsgruppe_dk' : 
					$where.=$field.' ="'.$this->getParam($param).'"';
					break;
				default :
					$where.=$field.' like "%'.$this->getParam($param).'%"';
					break;
			}

		}
		return $where;
	}

	protected function createSQL() {
		$SQL='select * from event_fund ';
		$where='event_id='.$this->getParam('soeg-event_id');
		
		$where=$this->getWhere($where, 'soeg-taxon', 'taxon');
		$where=$this->getWhere($where, 'soeg-artsgruppe_dk', 'artsgruppe_dk');
		$where=$this->getWhere($where, 'soeg-dknavn', 'dknavn');
		$where=$this->getWhere($where, 'soeg-finder', 'finder_navn');
		$where=$this->getWhere($where, 'soeg-finder-hold', 'finder_hold');
		$where=$this->getWhere($where, 'soeg-finder-gruppe', 'finder_gruppe');
		//
		$where=$this->getWhere($where, 'soeg-id', 'LNR');
		$where=$this->getWhere($where, 'soeg-indtaster', 'indtaster');

		$SQL.='where '.$where;

		if (isset($_GET['soeg-ej-bestemte'])) {
			$SQL.=' and endeligt_bestemt<>1';
		}

		$SQL.=' order by _timestamp desc';
		$this->SQL=$SQL;
	}	

	protected function getBilleder($fund_id) {
		$SQL='select count(*) as c from event_fund_billeder where fund_id='.$fund_id;
		$row=$this->getRow($SQL);
		return $row['c'];
	}

	protected function search() {
		mysql_set_charset('utf8');

		$result=$this->query($this->SQL);
		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=', ';
			$row['_timestamp']=date('d/m Y H:i', strtotime($row['_timestamp']));
			$row['billeder']=$this->getBilleder($row['LNR']);
			$JSON.=$this->rowToJSON($row);
		}
		$JSON='{ "soeg" : ['.$JSON.'] }';
		echo $JSON;
	}
}

$soeg = new FundSoeg();

?>
