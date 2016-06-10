<?

header('Content-type: application/json');

include('../common/Db.php');

class BioBlitzRige extends Db {
	private $lookup;

	public function __construct() {
		parent::__construct();

		if (isset($_GET['lookup'])) {
			$this->lookup=urldecode($_GET['lookup']);
			$this->lookup=str_replace('XXX',' ',$this->lookup);
			$this->LookupRige_dk();
		}
	}

	protected function LookupRige_dk() {
		$SQL='select distinct Rige_dk from allearter where Artsgruppe_dk like "%'.$this->lookup.'%"';

		mysql_set_charset('utf8');

		$result=$this->query($SQL);

		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=',';
			$JSON.='"'.$row['Rige_dk'].'"';
		}
		$JSON='{ "options": ['.$JSON.'] }';
		echo $JSON;
	}

}

$blitz = new BioBlitzRige();

?>
