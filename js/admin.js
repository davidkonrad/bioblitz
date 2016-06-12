
var Admin = {

	editEvent : function(event_id) {
		if (CKEDITOR.instances['event-beskrivelse'] == undefined) {
			CKEDITOR.replace('event-beskrivelse', { toolbar:'bioblitz' } );
		}
		$("#section-frontpage").hide();
		$("#section-edit").show();
		$.ajax({
			dataType : 'json',
			url : 'ajax/admin.php?action=get&event_id='+event_id,
			success : function(event) {
				$("#h2-header").text('Rediger event - '+event.titel); 
				var synlig = event.synlig == 1;
				$("#event-synlig").attr('checked', synlig);
				$("#event_id").val(event_id);
				$("#event-titel").val(event.titel);
				$("#event-dato").val(event.dato);
				$("#event-dato-tekst").val(event.dato_text);
				$("#event-arrangoer").val(event.arrangoer);
				$("#event-kontaktperson").val(event.kontaktperson);
				$("#event-kontaktperson-mail").val(event.kontaktperson_mail);
				$("#event-sted").val(event.stedbeskrivelse);
				$("#event-lat").val(event.lat);
				$("#event-lng").val(event.long);
				$("#event-beskrivelse").val(event.beskrivelse);

				CKEDITOR.instances['event-beskrivelse'].setData(event.beskrivelse, function() {
					$('#event-adm-navn').animate({ scrollTop: 0 }, 0);
				}, false);

				Admin.populateUsers(event_id);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
		$.ajax({
			dataType : 'json',
			url : 'ajax/admin.php?action=get-admin&event_id='+event_id,
			success : function(admin) {
				$("#event-adm-navn").val(admin.brugernavn);
				$("#event-adm-password").val(admin.password);
				$("#event-adm-id").val(admin.id);
				$("#event-adm-navn").focus();
				$('#event-adm-navn').animate({ scrollTop: 0 }, 0);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	populateEvents : function() {
		$.ajax({
			url: 'ajax/eventlist.php',
			dataType: 'json',
			async : false,
			success : function(json) {
				$("#event-dropdown").empty();
				for (var i=0;i<json.events.length;i++) {
					var event=json.events[i];
					var title=event.dato_text+' - '+event.titel;
					var li='<li><a href="#" onclick="Admin.editEvent('+event.id+');" title="'+title+'">';
					li+=event.titel+'</li>';
					$("#event-dropdown").append(li);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	createEvent : function() {
		var event = prompt('Angiv et navn for den event der skal oprettes (navnet kan ændres på et senere tidspunkt) :', '');
		if ((event!='') && (event!=null)) {
			$.ajax({
				url : 'ajax/admin.php?action=create&name='+encodeURIComponent(event),
				success : function(event_id) {
					Admin.populateEvents();
					Admin.editEvent(event_id);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
				}
			});
		}
	},

	saveEvent : function() {
		CKEDITOR.instances['event-beskrivelse'].updateElement();
		var params = $("#event-form").serialize();
		$.ajax({
			url : 'ajax/admin.php?action=save&'+params,
			success : function(text) {
				$("#event-msg").text(text);
			}
		});
	},

	populateUsers : function(event_id) {
		$.ajax({
			dataType :'json',
			url : 'ajax/users.php?action=get&event_id='+event_id,
			success : function (json) {
				$("#table-users tbody").empty();	
				//console.log(json);
				for (var i=0;i<json.users.length;i++) {
					var user = json.users[i];
					var tr = '<tr>';
					tr += '<td>'+user.brugernavn+'</td>';
					tr += '<td>'+user.password+'</td>';
					tr += '<td>'+user.email+'</td>';
					tr += '<td><img src="ico/sc_fail.png" style="border:0px;cursor:pointer;" onclick="Admin.deleteUser('+user.id+','+event_id+');"></td>';
					$("#table-users tbody").append(tr);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	checkUser : function() {
		var user=$("#user-name").val();
		if (user.length<1) {
			$("#user-msg").html('&nbsp;');
			$("#event-user-save").removeClass('btn-primary btn-success btn-warning').addClass('btn-primary');
			return;
		}
		var event_id=$("#event_id").val();
		$.ajax({
			url : 'ajax/users.php?action=check&username='+user+'&event_id='+event_id,
			success : function(count) {
				//console.log(count);
				if (parseInt(count)>0) {
					$("#user-msg").removeClass('text-success');
					$("#user-msg").addClass('text-warning');
					$("#user-msg").html('<code>'+user+'</code> findes allerede.');
					$("#event-user-save").removeClass('btn-primary btn-success btn-warning').addClass('btn-warning');
				} else {
					$("#user-msg").removeClass('text-warning');
					$("#user-msg").addClass('text-success');
					$("#user-msg").html('<code>'+user+'</code> er ledigt.');
					$("#event-user-save").removeClass('btn-primary btn-success btn-warning').addClass('btn-success');
				}
			}
		});
	},
		
	deleteUser : function(user_id, event_id) {
		if (confirm('Slet bruger?')) {
			$.ajax({
				url : 'ajax/users.php?action=delete&user_id='+user_id+'&event_id='+event_id,
				success : function() {
					Admin.populateUsers(event_id);
				}
			});
		}
	},

	createUser : function (username, password, email) {
		var event_id=$("#event_id").val();
		$.ajax({
			url : 'ajax/users.php?action=create&username='+username+'&password='+password+'&email='+email+'&event_id='+event_id,
			success : function(response) {
				Admin.populateUsers(event_id);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	createPassword : function() {
		var length = 8,
			charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			pw = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			pw += charset.charAt(Math.floor(Math.random() * n));
		}
		$("#event-adm-password").val(pw);
	},

	updateAdmin : function() {
		var param='?action=update-admin';
		param+='&brugernavn='+encodeURIComponent($("#event-adm-navn").val());
		param+='&password='+encodeURIComponent($("#event-adm-password").val());
		param+='&event_id='+encodeURIComponent($("#event_id").val());
		param+='&id='+encodeURIComponent($("#event-adm-id").val());
		$.ajax({
			url: 'ajax/admin.php'+param,
			success : function(text) {
				$("#event-adm-msg").text(text);
			}
		});
	},

	isAdmin : function() {
		User.checkLogin(); 
		if (window.location.pathname.indexOf('admin.html')<0) return false;
		if (!User.isAdmin()) return false;
		return true;
	}

}

$(document).ready(function() {
	if (!Admin.isAdmin()) return;
	var map, marker;
	Admin.populateEvents();
	$("#event-dato").datepicker({
		format : 'yyyy-mm-dd'
	});
	$("#event-lat, #event-lng").click(function() {
		var lat = $("#event-lat").val()!='' ? $("#event-lat").val() : Res.DK_Lat;
		var lng = $("#event-lng").val()!='' ? $("#event-lng").val() : Res.DK_Long;
		//console.log(lat, lng);
		map = Res.googleMap('map-modal-map', lat, lng, 6);
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		marker = new google.maps.Marker({
			position : new google.maps.LatLng(lat, lng),
			map : map
		});
		google.maps.event.addListener(map, 'click', function(e) {
			marker.setPosition(e.latLng);
		});
		$("#map-modal").modal();
	});
	$("#map-modal").on('shown', function() {
		google.maps.event.trigger(map, 'resize');
		map.setCenter(marker.getPosition());
		$("#event-sted-update").click(function() {
			var position=marker.getPosition();
			$("#event-lat").val(position.lat());
			$("#event-lng").val(position.lng());
		});
	});
	$("#event-save").click(function() {
		Admin.saveEvent();
		return false;
	});
	$("#event-adm-save").click(function() {
		Admin.updateAdmin();
		return false;
	});
	$("#user-modal").on('shown', function() {
		$("#user-name").focus();
	});
	$("#user-create").click(function() {
		$("#user-name").val('');
		$("#user-msg").html('&nbsp;');
		$("#user-password").val('');
		$("#user-email").val('');
		$("#user-modal").modal();
		return false;
	});	
	$("#user-name").bind('keyup', function(e) {
		Admin.checkUser();
	});
	$("#event-user-save").click(function() {
		if (!$(this).hasClass('btn-success')) return false;
		Admin.createUser(
			encodeURIComponent($("#user-name").val()),
			encodeURIComponent($("#user-password").val()),
			encodeURIComponent($("#user-email").val())
		);
		$("#user-modal").modal('hide');
	});

	if (User.isEventAdmin()) {
		$("#nav-index a").attr('href', 'index.html?event_id='+User.user_event_id);
		$("#nav-create").addClass('hidden');
		$("#event-dropdown-li").addClass('hidden');
		$("#event-form-admin").addClass('hidden');
		Admin.editEvent(User.user_event_id);
	}

});


