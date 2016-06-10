<?
//flyt marker / event_fund

include('Db.php');

class Move extends Db {
	
	public function __construct() {
		parent::__construct();

		$LNR=$_GET['LNR'];
		$lat=$_GET['lat'];
		$lng=$_GET['lng'];
		
		$SQL='update event_fund set lat="'.$lat.'", lng="'.$lng.'" where LNR='.$LNR;
		$this->exec($SQL);
	}
}

$move = new Move();

?>		

