<?

header('Content-type: application/json');

include('../common/Db.php');

class BioBlitzArtsgruppe extends Db {
	private $taxon;
	private $lookup;

	public function __construct() {
		parent::__construct();

		if (isset($_GET['taxon'])) {
			$this->taxon=urldecode($_GET['taxon']);
			$this->taxon=str_replace('XXX',' ', $this->taxon);
			$this->getArtsgrupper();
		}

		if (isset($_GET['lookup'])) {
			$this->lookup=urldecode($_GET['lookup']);
			$this->lookup=str_replace('XXX',' ',$this->lookup);
			$this->LookupArtsgrupper_dk();
		}
	}

	protected function getArtsgrupper() {
		$SQL='select Artsgruppe, Artsgruppe_dk from allearter where Videnskabeligt_navn="'.$this->taxon.'"';

		mysql_set_charset('utf8');

		$row=$this->getRow($SQL);

		$JSON='{ "Artsgruppe" : "'.$row['Artsgruppe'].'", "Artsgruppe_dk" : "'.$row['Artsgruppe_dk'].'"}';
		echo $JSON;
	}

	protected function LookupArtsgrupper_dk() {
		$SQL='select distinct Artsgruppe_dk from allearter where Artsgruppe_dk like "%'.$this->lookup.'%"';

		mysql_set_charset('utf8');

		$result=$this->query($SQL);

		$JSON='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($JSON!='') $JSON.=',';
			$JSON.='"'.$row['Artsgruppe_dk'].'"';
		}
		$JSON='{ "options": ['.$JSON.'] }';
		echo $JSON;
	}

}

$blitz = new BioBlitzArtsgruppe();

?>
