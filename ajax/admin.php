<?

include('Db.php');

class Admin extends Base {
	private $event_id;

	public function __construct() {
		parent::__construct();

		$this->event_id = (isset($_GET['event_id'])) ? $_GET['event_id'] : false;

		$action = (isset($_GET['action'])) ? $_GET['action'] : false;
		switch ($action) {
			case 'create' :
				$this->createEvent();
				break;

			case 'get' :
				$this->getEvent();
				break;

			case 'save' :
				$this->saveEvent();
				break;

			case 'update-admin' : 
				$this->updateAdmin();
				break;

			case 'get-admin' : 
				$this->getAdmin();
				break;

			default :
				break;		
		}
	}

	private function createEvent() {
		mysql_set_charset('utf8');

		$name = (isset($_GET['name'])) ? $_GET['name'] : false;
		if ($name) {
			$SQL='insert into events (titel) values ('.$this->q($name, false).')';
			$this->exec($SQL);
			$this->event_id=mysql_insert_id();
			$this->createAdmin();
			echo $this->event_id;
		}
	}

	private function getEvent() {
		$event_id = (isset($_GET['event_id'])) ? $_GET['event_id'] : false;
		if ($event_id) {
			$SQL='select * from events where id='.intval($event_id);
			mysql_set_charset('utf8');
			$row=$this->getRow($SQL);
			echo $this->rowToJSON($row);
		}
	}

	private function saveEvent() {
		$synlig = isset($_GET['event-synlig']) ? 1 : 0;
		$SQL='update events set '.
			'synlig='.$this->q($synlig).
			'dato='.$this->q($this->getParam('event-dato')).
			'dato_text='.$this->q($this->getParam('event-dato-tekst')).
			'titel='.$this->q($this->getParam('event-titel')).
			'beskrivelse='.$this->q($this->getParam('event-beskrivelse')).
			'arrangoer='.$this->q($this->getParam('event-arrangoer')).
			'kontaktperson='.$this->q($this->getParam('event-kontaktperson')).
			'kontaktperson_mail='.$this->q($this->getParam('event-kontaktperson-mail')).
			'lat='.$this->q($this->getParam('event-lat')).
			'`long`='.$this->q($this->getParam('event-lng')).
			'stedbeskrivelse='.$this->q($this->getParam('event-sted'), false).' '.
			'where id='.$this->event_id;

		mysql_set_charset('utf8');
		$this->exec($SQL);

		switch (mysql_affected_rows()) {
			case -1 :
				echo 'Der opstod en fejl [ '.mysql_error().' ]';
				break;
			case 0 :
				echo 'Der var ingen ændringer at gemme';
				break;
			default :	
				echo 'Eventen er gemt';
				break;
		}
	}


	/*************************************************
		event admins
	**************************************************/
	private function getAdmin() {
		$SQL='select * from event_login where event_id='.$this->event_id.' and admin=1';
		if (!$this->hasData($SQL)) {
			$this->createAdmin();
			$this->getAdmin();
		} else {
			$row=$this->getRow($SQL);
			echo $this->rowToJSON($row);
		}
	}

	private function createAdmin() {
		$SQL='insert into event_login (event_id, brugernavn, password, admin) values('.
			$this->q($this->event_id).
			$this->q('event'.$this->event_id).
			$this->q($this->getPassword()).
			$this->q('1', false).
		')';
		$this->exec($SQL);
	}

	private function updateAdmin() {
		$SQL='update event_login set '.
			'brugernavn='.$this->q($_GET['brugernavn']).
			'password='.$this->q($_GET['password'], false).' '.
			'where event_id='.$this->event_id .' and id='.$_GET['id'];

		$this->exec($SQL);
		echo 'Admin opdateret';
	}	
		
	private function getPassword() {
	    $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
	    $pass = array(); 
	    $alphaLength = strlen($alphabet) - 1; 
	    for ($i = 0; $i < 8; $i++) {
	        $n = rand(0, $alphaLength);
	        $pass[] = $alphabet[$n];
	    }
	    return implode($pass);
	}
	
}

$admin = new Admin();

?>
