
var COOKIE_EVENT		= 'blitz_event_id';

var COOKIE_USER			= 'blitz_user_id';
var COOKIE_USERNAME		= 'blitz_username';
var COOKIE_PASSWORD		= 'blitz_password';
var COOKIE_STATUS		= 'blitz_status';
var COOKIE_USER_EVENT	= 'blitz_user_event';

var COOKIE_LASTPAGE		= 'blitz_lastpage';
var COOKIE_LAST_HOLD	= 'blitz_lasthold';
var COOKIE_LAST_GRUPPE	= 'blitz_lastgruppe';

var USER_ANON 		= 0; //anonymous user
var USER_EVENT		= 1; //event user, logged in 
var USER_ADMIN 		= 2; //event user, administrator
var USER_SUPER		= 3; //super administrator

var User = {
	user_name : null,
	user_event_id : null,
	user_id : null,
	status : USER_ANON,

	login : function() {
		var username=encodeURIComponent($("#username").val());
		var password=encodeURIComponent($("#password").val());
		$.ajax({
			url: 'ajax/login.php?username='+username+'&password='+password,
			dataType: 'json',
			success : function(result) {
				if (result.hasOwnProperty('error')) {
					console.log('error');
					$("#login").addClass('warning');
					$("#username").addClass('warning');
					$("#password").addClass('warning');
					return;
				} else {
					switch (parseInt(result.admin)) {
						case 0 :
							User.status=USER_EVENT;
							break;
						case 1 :
							User.status=USER_ADMIN;
							break;
						case 99 :
							User.status=USER_SUPER;
							break;
						default :
							User.status=USER_ANON;
							break;
					}
					User.user_name=result.brugernavn;
					User.user_event_id=result.event_id;
					User.user_id=result.id;
					User.setUserCookie(result.id, result.brugernavn, result.password, result.event_id, User.status);
				}

				if (User.isSuperUser()) {		
					window.location = 'admin.html';
				} else {
					User.doLogin(User.user_id, User.user_name, User.event_id);
					Blitz.loadEvent(result.event_id, result.event_id); //two params
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	writeUserCookie : function(key, value, now) {
		document.cookie = key+'='+value+'; expires=' + now.toUTCString();
	},

	setUserCookie : function(id, username, password, event_id, status) {
		var now = new Date();
		var time = now.getTime();
		time += 10800 * 1000; //3 hours
		now.setTime(time);
		this.writeUserCookie(COOKIE_USER, id, now);
		this.writeUserCookie(COOKIE_USERNAME, username, now);
		if (password) this.writeUserCookie(COOKIE_PASSWORD, password, now);
		this.writeUserCookie(COOKIE_USER_EVENT, event_id, now);
		this.writeUserCookie(COOKIE_STATUS, status, now);
	},

	doLogin : function(user_id, username, event_id) {
		$("#login").hide();
		$("#logout").show();
		$("#currentuser").text(username);
		if (this.isEventAdmin()) {
			$("#nav-admin").removeClass('hidden');
			$("#nav-admin a").attr('href','admin.html');
		}
	},		

	logout : function() {
		$.removeCookie(COOKIE_USER);
		$.removeCookie(COOKIE_USERNAME);
		$.removeCookie(COOKIE_PASSWORD);
		$.removeCookie(COOKIE_USER_EVENT);
		$.removeCookie(COOKIE_STATUS);
		User.status=USER_ANON;
		this.user_name='';
		this.user_event_id='';
		this.user_id='';
		$("#logout").hide();
		$("#login").show();
		$("#login").removeClass('warning');
		$("#username").removeClass('warning');
		$("#password").removeClass('warning');
		window.location='index.html?goto=forside';
	},

	updatePermissions : function() {
		var isUser = (this.isEventUser()==true || 
					  this.isEventAdmin()==true || 
					  this.isSuperUser()==true);

		var ok=this.isSuperUser() || ((Blitz.event_id==this.user_event_id) && isUser);

		Blitz.enableBtn("#admin-data", ok);
		Blitz.enableBtn("#admin-image", ok);

		if (this.isSuperUser()) {
			$("#nav-administration").show();
		}
	},

	checkLogin : function() {
		console.log('checkLogin');
		var u = $.cookie(COOKIE_USER);
		if ((u!='') && (u!=='undefined') && (parseInt(u)>0)) {
			User.user_name=$.cookie(COOKIE_USERNAME);
			User.user_event_id=parseInt($.cookie(COOKIE_USER_EVENT));
			User.user_id=parseInt($.cookie(COOKIE_USER));
			User.status=parseInt($.cookie(COOKIE_STATUS));
			User.doLogin(User.user_id, User.user_name, User.event_id);
			User.updatePermissions();
			//update 3 hours login, dont include password
			User.setUserCookie(User.user_id, User.user_name, false, User.user_event_id, User.status);
		}
	},

	isAdmin : function() {
		if (this.isEventAdmin() || this.isSuperUser()) return true;
		return false;
	},

	isAnonUser : function() {
		return (User.status == USER_ANON);
	},

	isEventUser : function() {
		return (User.status == USER_EVENT);
	},

	isEventAdmin : function() {
		return (User.status == USER_ADMIN);
	},
	
	isSuperUser : function() {
		return (User.status == USER_SUPER);
	}

}

$(document).ready(function() {
	$("#login input").on('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)	User.login();
	});
});


