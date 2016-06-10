<?

include('Db.php');

class Upload extends Base {

	public function __construct() {
		parent::__construct();

		if ($_FILES["file"]["error"] > 0) return;

		$event_id=(isset($_POST['upload-event_id'])) ? $_POST['upload-event_id'] : false;
		$fund_id=(isset($_POST['upload-fund_id'])) ? $_POST['upload-fund_id'] : false;

		if (!$event_id || !$fund_id) return;
		
		//define ('SITE_ROOT', realpath(dirname(__FILE__)));
		//move_uploaded_file($_FILES['file']['temp_name'], SITE_ROOT.'/static/images/slides/1/1.jpg');

		$path='../billedupload/'.$event_id.'/'.$_FILES["file"]["name"];
		move_uploaded_file($_FILES["file"]["tmp_name"], $path);

		$host = $_SERVER["SERVER_ADDR"]; 
		if (($host=='127.0.0.1') || ($host=='::1')) {
			$realpath='http://localhost/blitz/billedupload/'.$event_id.'/'.$_FILES["file"]["name"];
		} else {
			$realpath='http://daim.snm.ku.dk/bioblitz/billedupload/'.$event_id.'/'.$_FILES["file"]["name"];
		}

		$SQL='insert into event_fund_billeder set '.
			'event_id='.$this->q($event_id).
			'fund_id='.$this->q($fund_id).
			'filename='.$this->q($realpath, false);
		$this->exec($SQL);

		header('location: ../index.html?goto=foto');
	}

}

$upload = new Upload();

?>
