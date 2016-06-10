
<?

include('Db.php');

class CSV extends Base {
	private $fields=array(
		'LNR'=>'#',
		'_timestamp'=>'Tid',
		'endeligt_bestemt'=>'Bedømt',
		'first_occurrence'=>'Første fund',
		'taxon'=>'Videnskabeligt navn',
		'dknavn'=>'Dansk navn',
		'artsgruppe'=>'Artsgruppe',
		'artsgruppe_dk'=>'Artsgruppe dk',
		'rige_dk'=>'Rige',
		'lat'=>'Lat.',
		'lng'=>'Long.',
		'finder_navn'=>'Finder',
		'finder_hold'=>'Hold',
		'finder_gruppe'=>'Gruppe',
		'bestemmer'=>'Bestemmer',
		'indtaster'=>'Indtaster'
	);
	private $crlf = '<br>';		

	private function getText($value) {
		if ($value=='1') return 'X';
		return '';
	}

	public function __construct() {
		parent::__construct();

		echo '<head>';
		echo '<meta charset="utf-8">';
		echo '</head><body>';
		
		$SQL='select * from event_fund order by LNR';
		//mysql_set_charset('utf8');
		$result=$this->query($SQL);

		$line='';
		foreach ($this->fields as $field=>$value) {
			if ($line!='') $line.=';';
			$line.='"'.$value.'"';
		}
		echo $line.$this->crlf;
	
		while ($row = mysql_fetch_assoc($result)) {
			$line='';
			foreach ($this->fields as $field=>$value) {
				if ($line!='') $line.=';';
				if ($field=='first_occurrence' || $field=='endeligt_bestemt') {
					$line.='"'.$this->getText($row[$field]).'"';
				} else {
					$line.='"'.$row[$field].'"';
				}
			}
			echo $line.$this->crlf;
		}
					
	}
		
}

$csv = new CSV();

?>

