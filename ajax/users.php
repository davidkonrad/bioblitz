<?

include('Db.php');

class Users extends Base {

	public function __construct() {
		parent::__construct();
		$action = (isset($_GET['action'])) ? $_GET['action'] : false;
		switch ($action) {
			case 'create' :
				$this->createUser();
				break;

			case 'get' :
				$this->getUsers();
				break;

			/*
			case 'save' :
				$this->saveUser();
				break;
			*/

			case 'delete' :
				$this->deleteUser();
				break;

			case 'check' :
				$this->checkUser();
				break;

			default :
				break;		
		}
	}

	private function createUser() {
		$event_id = (isset($_GET['event_id'])) ? $_GET['event_id'] : false;
		$name = (isset($_GET['username'])) ? $_GET['username'] : false;
		$password = (isset($_GET['password'])) ? $_GET['password'] : false;
		$email = (isset($_GET['email'])) ? $_GET['email'] : '';
		if ($event_id && $name && $password) {
			$SQL='insert into event_login (event_id, brugernavn, password, email) values ('.
				$this->q($event_id).
				$this->q($name).
				$this->q($password).
				$this->q($email, false).')';

			$this->exec($SQL);
		}
	}

	private function deleteUser() {
		$id = (isset($_GET['user_id'])) ? $_GET['user_id'] : false;
		if ($id) {
			$SQL='delete from event_login where id='.$id;
			$this->exec($SQL);
		}
	}

	private function getUsers() {
		$id = (isset($_GET['event_id'])) ? $_GET['event_id'] : false;
		if ($id) {
			$SQL='select * from event_login where event_id='.$id.' and `admin`=0 order by id';
			mysql_set_charset('utf8');
			$result=$this->query($SQL);
			$JSON='';
			while ($row = mysql_fetch_assoc($result)) {
				if ($JSON!='') $JSON.=', ';
				$JSON.=$this->rowToJSON($row);
			}
			$JSON='{ "users" : [ '.$JSON.' ] }';
			echo $JSON;
		}
	}

	/*
	private function saveUser() {
		$SQL='update events set '.
			'dato='.$this->q($this->getParam('event-dato')).
			'dato_text='.$this->q($this->getParam('event-dato-tekst')).
			'titel='.$this->q($this->getParam('event-titel')).
			'beskrivelse='.$this->q($this->getParam('event-beskrivelse')).
			'arrangoer='.$this->q($this->getParam('event-arrangoer')).
			'kontaktperson='.$this->q($this->getParam('event-kontaktperson')).
			'kontaktperson_mail='.$this->q($this->getParam('event-kontaktperson-email')).
			'lat='.$this->q($this->getParam('event-lat')).
			'`long`='.$this->q($this->getParam('event-lng')).
			'stedbeskrivelse='.$this->q($this->getParam('event-sted'), false).' '.
			'where id='.$_GET['event-id'];

		$this->exec($SQL);

		if (mysql_affected_rows()>0) {
			echo 'Eventen er gemt';
		} else {
			echo 'Der opstod en fejl';
		}
	}
	*/

	private function checkUser() {
		$user = (isset($_GET['username'])) ? $_GET['username'] : false;
		//$event_id = (isset($_GET['event_id'])) ? $_GET['event_id'] : false;
		if ($user) {
			//$SQL='select count(*) as c from event_login where BINARY brugernavn="'.$user.'" and event_id='.$event_id;
			$SQL='select count(*) as c from event_login where BINARY brugernavn="'.$user.'"';
			$row=$this->getRow($SQL);
			echo $row['c'];
		}
	}

}

$users = new Users();

?>
