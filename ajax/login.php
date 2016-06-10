<?

include('Db.php');

class Login extends Base {
	private $user;
	private $pass;

	public function __construct() {
		parent::__construct();
		$this->user=(isset($_GET['username'])) ? $_GET['username'] : '';
		$this->pass=(isset($_GET['password'])) ? $_GET['password'] : '';

		if (!$this->eventLogin()) {
			echo $this->getError();
		}
	}

	function eventLogin()  {
		$SQL='select * from event_login where BINARY brugernavn="'.$this->user.'" and BINARY password="'.$this->pass.'"';
		if ($this->hasData($SQL)) {
			$row=$this->getRow($SQL);
			echo $this->rowToJSON($row);
			return true;
		} else {
			return false;
		}
	}

}

$login = new Login();

?>
