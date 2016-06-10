<?

include('Db.php');

class FundImg extends Base {

	public function __construct() {
		parent::__construct();
		
		$event_id=$this->getParam('event_id');
		$fund_id=$this->getParam('fund_id');
		$filename=$this->getParam('filename');

		$SQL='insert into event_fund_billeder (event_id, fund_id, filename) values('.
			$this->q($event_id).
			$this->q($fund_id).
			$this->q($filename, false).
			')';

		$this->exec($SQL);
	}

}

$fundimg = new FundImg();

?>
