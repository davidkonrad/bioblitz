<?

include('ajax/Db.php');

class Download extends Db {

	public function __construct() {
		parent::__construct();

		$type = isset($_GET['type']) ? $_GET['type'] : false;
		$event_id = isset($_GET['event_id']) ? $_GET['event_id'] : false;

		if ($type && $event_id) {
			switch ($type) {
				case 'csv' : 
					$this->csv($event_id, ';', 'csv');
					break;

				case 'excel' : 
					$this->csv($event_id, "\t", 'xls');
					break;

				case 'gbif' : 
					$this->gbif($event_id);
					break;
			
				default : 
					break;
			}	
		}
	}

	private function getFieldName($field) {
		switch ($field) {
			case 'event_id' :
				return 'Event ID';
				break;

			case '_timestamp' :
				return 'Tidsstempel';
				break;

			case 'taxon' :
				return 'Latinsk navn';
				break;

			case 'dknavn' :
				return 'Dansk navn';
				break;

			case 'finder_navn' :
				return 'Finder';
				break;

			case "finder_hold" : 
				return 'Hold';
				break;

			case "finder_gruppe" :
				return 'Gruppe';
				break;
			
			case "lat" :
				return 'Breddegrad';
				break;

			case "lng" :
				return 'Længdegrad';
				break;

			case "indtaster" :
				return 'Indtaster';
				break;

			case "bestemmer" :
				return 'Bestemmer';
				break;

			case "first_occurrence" :
				return 'Første fund';
				break;

			case "artsgruppe" :
				return 'Artsgruppe';
				break;

			case "artsgruppe_dk" :
				return 'Artsgruppe (dansk)';
				break;

			case "rige_dk" :
				return 'Rige';
				break;

			case "endeligt_bestemt";
				return 'Endeligt bestemt';
				break;

			default :
				return $field;
		}
	}

	private function headers() {
		$SQL='DESCRIBE event_fund';
		$result=$this->query($SQL);
		$header='';
		while ($row = mysql_fetch_assoc($result)) {
			if ($header!='') $header.=',';
			$header.='"'.$this->getFieldName($row['Field']).'"';
		}
		echo $header."\n";
	}

	private function csv($event_id, $delimiter, $ext) {
		header('Content-type: application/text');
		header('Content-Disposition: attachment; filename="bioblitz.'.$ext.'"');
	
		$this->headers();

		$SQL='select * from event_fund where event_id='.$event_id.' order by LNR';
		$result=$this->query($SQL);
		while ($row = mysql_fetch_assoc($result)) {
			$line='';
			foreach ($row as $field=>$value) {
				if ($line!='') $line.=$delimiter;

				switch ($field) {
					case 'first_occurrence' :
					case 'endeligt_bestemt' :
						$v = ($value==1) ? 'Ja' : 'Nej';
						break;

					default :
						$v=$value;
						break;
				}
								
				$line.='"'.$v.'"';
			}
			echo $line."\n";
		}
	}

	/****************************************************
			Darwin Core - GBIF
	****************************************************/
	private function gbifHeaders() {
		$headers=array(
			'occurrenceID',
			'datasetName',
			'basisOfRecord',
			'eventDate',
			'scientificName',
			'vernacularName',
			'countryCode',
			'decimalLatitude',
			'decimalLongitude',
			'identifiedBY',
			'kingdom'
		);
		$line = '';
		foreach ($headers as $header) {
			if ($line!='') $line.=',';
			$line.='"'.$header.'"';
		}
		return $line;
	}

	private function rigeToKingdom($rige) {
		switch ($rige) {
			case 'Planteriget' :
				return 'Plantae';
				break;
			case 'Riget Chromista' :
				return 'Chromista';
				break;
			case 'Svamperiget' :
				return 'Fungi';
				break;
			case 'Protozoriget' :
				return 'Protozoa';
				break;
			case 'Dyreriget' :
				return 'Animalia';
				break;

			default :
				//return "????".$rige;
				return ($rige!='') ? $rige : 'NA';
				break;
		}
	}

	private function getDate($timestamp) {
		$date = date_parse($timestamp);
		$year = $date['year'];
		$month = (strlen($date['month'])==2) ? $date['month'] : '0'.$date['month'];
		$day = (strlen($date['day'])==2) ? $date['day'] : '0'.$date['day'];
		return $year.'-'.$month.'-'.$day;
	}

	private function gbif($event_id) {
		header('Content-type: application/text');
		header('Content-Disposition: attachment; filename="bioblitz_gbif_export.csv"');

		$SQL='select * from events where id='.$event_id;
		$event=$this->getRow($SQL);
		$datasetName=$event['titel'];

		$doc = $this->gbifHeaders()."\n";
		
		$SQL='select * from event_fund where event_id='.$event_id.' and endeligt_bestemt=1 order by LNR';
		$result=$this->query($SQL);

		while ($row = mysql_fetch_assoc($result)) {
			$line='"'.$row['LNR'].'",';
			$line.='"'.$datasetName.'",';
			$line.='"humanObservation",';

			//$date = date("yyyy-mm-dd", $row['_timestamp']);
			//$date = date_parse($row['_timestamp']);
			//$line.='"'.$date['year'].'-'.$date['month'].'-'.$date['day'].'",';
			$line.='"'.$this->getDate($row['_timestamp']).'",';

			$line.='"'.$row['taxon'].'",';
			$line.='"'.$row['dknavn'].'",';
			$line.='"DK",';
			$line.='"'.$row['lat'].'",';
			$line.='"'.$row['lng'].'",';

			$line.='"'.$row['bestemmer'].'",'; //??
			$line.='"'.$this->rigeToKingdom($row['rige_dk']).'"';

			$doc.=$line."\n";
		}
		echo $doc;
	}
}

$download = new Download();

?>
