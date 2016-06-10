<?
//ryd op i identiske latlng fra bioblitz 2013

include('Db.php');

class CleanUp extends Db {
	
	public function __construct() {
		parent::__construct();
		echo 'ok';
		$ident=array();
		/*
		$SQL='select lat, lng from event_fund';
		$result=$this->query($SQL);
		while ($row = mysql_fetch_assoc($result)) {
			if (!empty($ident[$row['lat']])) {
				$ident[]=$row['lat'];
			} else {
				echo $row['lat'].','.$row['lng'].'<br>';
			}
		}
		*/
		//55.6919958,12.5838625
		$SQL='select LNR, lat, lng from event_fund where lat="55.6919958" and lng="12.5838625"';
		$result=$this->query($SQL);
		while ($row = mysql_fetch_assoc($result)) {
			$lat = rand(0, 100) / 500000;
			$lng = rand(0, 100) / 50000;
			switch (rand(0,3)) {
				case 0 :
					$lat=$row['lat']-$lat;
					$lng=$row['lng']-$lng;
					break;
				case 1:
					$lat=$row['lat']+$lat;
					$lng=$row['lng']-$lng;
					break;
				case 2: 
					$lat=$row['lat']+$lat;
					$lng=$row['lng']+$lng;
					break;
				case 3: 
					$lat=$row['lat']-$lat;
					$lng=$row['lng']+$lng;
					break;

					$lat=$lat+$row['lat'];
					$lng=$lng+$row['lng'];
					break;
			}
			echo $lat.','.$lng.'<br>';
			$SQL='update event_fund set lat="'.$lat.'", lng="'.$lng.'" where LNR='.$row['LNR'];
			$this->exec($SQL);
		}

	
	}
}

$cleanup = new CleanUp();		

?>
