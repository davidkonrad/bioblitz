if (!window.console) console = { log: function(){} };

var SECTION_INDTAST = '#section-indtast';
var SECTION_FOTO = '#section-foto';
var SECTION_FUND = '#section-fund';
var SECTION_SOEG = '#section-soeg';
var SECTION_MANUAL = '#section-manual';
var SECTION_SHOW_FUND = '#section-show-fund';
var SECTION_STATISTIK = '#section-statistik';

var Blitz = {
	map : null,
	lat : null,
	long : null,
	current_section : '',
	marker : null,
	event_id : 0,
	current_fund : 0, 

	init : function() {
		var switch_event = this.getParam('event_id');
		if (switch_event) {
			this.loadEvent(switch_event, true);
		} else {
			var goto = this.getParam('goto');
			switch (goto) {
				case 'forside' : 
					this.setFrontpage(); 
					$("#nav-forside").addClass('active');
					break;

				case 'indtast' : 
					if (User.isSuperUser() || (this.event_id>0) && (this.event_id==User.user_event_id)) {
						this.setSection(SECTION_INDTAST);
						$(SECTION_INDTAST).load('include/indtast.html?ver=2014');
					} else {
						this.setFrontpage();
					}
					break;

				case 'foto' : 
					this.initWebcam();
					break;

				case 'fund' : 
					this.setSection(SECTION_FUND); 
					this.updateFundTable();
					break;

				case 'soeg' : 
					this.setSection(SECTION_SOEG); 
					$("#soeg-event_id").val(Blitz.event_id);
					this.restoreSearch();
					break;

				case 'manual' : 
					this.setManual('Indtastning');
					break;

				case 'statistik' : 
					this.initStatistik();
					break;
			
				default : 
					this.setFrontpage(); 
					$("#nav-forside").addClass('active');
					break;

			}
		}
	},

	setSection : function(section) {
		if ((section=='') || (section=='undefined')) this.setFrontpage();
		$("#section-frontpage").hide();
		$("#section-event").hide();
		$(SECTION_FUND).hide();
		$(SECTION_MANUAL).hide();
		$(SECTION_INDTAST).hide();
		$(SECTION_SOEG).hide();
		$(SECTION_FOTO).hide();
		$(SECTION_SHOW_FUND).hide();
		$(SECTION_STATISTIK).hide();

		$(section).show();
		document.cookie = COOKIE_LASTPAGE+'='+section;
		this.current_section=section;
	},

	setFrontpage : function() {
		this.setSection("#section-frontpage");
	},
		
	setLastPage : function() {
		if (this.user_name=='') {
			this.setFrontpage();
			return;
		}		
		var section=$.cookie(COOKIE_LASTPAGE);
		if (section) {
			this.setSection(section);
		} else {
			this.setFrontpage();
		}
	},

	loadEvent : function(event_id, event_frontpage) {
		this.event_id=event_id;
		$.ajax({
			url : 'ajax/event.php?event_id='+event_id,
			dataType: 'json',
			async : false, 
			success : function(json) {
				//console.log(json);
				if (json.hasOwnProperty('error')) return;
				$(".brand").text(json.titel);
				$(".brand").attr('href','index.html?event_id='+json.id);
				Blitz.setEventCookie(json.id);
				Blitz.lat=json.lat;
				Blitz.long=json.long;
				if (event_frontpage) {
					Blitz.setSection("#section-event");
					$("#event_title").text(json.titel);
					$("#event_desc").html(json.beskrivelse);
					$("#event_sted").text(json.stedbeskrivelse);
					$("#event_date").text(json.dato_text);
					$("#event_arrangoer").text(json.arrangoer);
					$("#event_kontaktperson").html(json.kontaktperson);
					$("#event_kontaktperson_mail").html('<a href="mailto:'+json.kontaktperson_mail+'">'+json.kontaktperson_mail+'</a>');
				}
				Blitz.enableBtn("#btn-event-fund", true);
				Blitz.enableBtn("#btn-event-soeg", true);
				Blitz.enableBtn("#btn-event-statistik", true);
				User.updatePermissions();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});				
	},

	wait : function(mode) {
		if (mode) {
			$('html, body').css("cursor", "wait");
		} else {
			$('html, body').css("cursor", "auto");
		}
	},

	setInputState : function(id) {
		if ($(id).val()!='') {
			$(id).parent().parent().removeClass('error');
			$(id).parent().parent().addClass('success');
			return true;
		} else {
			if (!$(id).parent().parent().hasClass('error')) $(id).parent().parent().addClass('error');
			$(id).parent().parent().removeClass('success');
			return false;
		}
	},

	forceInputState : function(id, state) {
		$(id).parent().parent().removeClass('error');
		$(id).parent().parent().removeClass('success');
		if (state) {
			$(id).parent().parent().addClass('success');
		} else {
			$(id).parent().parent().addClass('error');
		}
	},
		
	checkInput : function() {
		var ok = true;

		if ($("#endeligt_bestemt").is(':checked')) {
			if (!this.setInputState('#taxon')) ok=false;
		} else {
			var ok= ($("#taxon").val()!='' || $("#dknavn").val()!='');
			if (ok) {
				if ($("#taxon").val()!='') this.setInputState("#taxon");
				if ($("#dknavn").val()!='') this.setInputState("#dknavn");
			}
		}

		//var ok2 = ($('#finder_hold').val()!='' && $('#finder_navn').val()!='');
		var ok2 = ($('#finder_hold').val()!='' || $('#finder_gruppe').val()!='' || $('#finder_navn').val()!='');
		/*
		if (ok2) {
			this.setInputState('#finder_hold');
		} else {
			ok=false;
			if ($('#finder_hold').val()=='') {
				this.setInputState('#finder_hold')
			} else {
				this.setInputState('#finder_navn');
			}
		}
		*/
		this.forceInputState('#finder_navn', ok2);
		this.forceInputState('#finder_gruppe', ok2);
		this.forceInputState('#finder_hold', ok2);
		
		if (!this.setInputState('#bestemmer')) ok=false;
		if (!this.setInputState('#indtaster')) ok=false;
		if (!ok) {
			if (!$('#btn-save').hasClass('disabled')) $('#btn-save').addClass('disabled');
		} else {
			$('#btn-save').removeClass('disabled');
		}
	},
	
	initMap : function(setLat, setLong) {
		var lat=(setLat) ? setLat : Blitz.lat;
		var long=(setLong) ? setLong : Blitz.long;

		this.map = Res.googleMap('fund-map', lat, long, 17);
		if (!setLat) this.initLatLong(Blitz.lat, Blitz.long);

		google.maps.event.addListener(this.map, 'click', this.setLatLong);
		google.maps.event.addListener(this.map, 'drop', this.setLatLong);

		this.checkInput();
		$("#fund-form input").on('propertychange keyup input paste change', function(e) {
			Blitz.checkInput();
		});

		Blitz.marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, long),
			map: Blitz.map,
			raiseOnDrag: false,
			icon: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
			animation: google.maps.Animation.DROP,
			draggable: true
		});

		google.maps.event.addListener(Blitz.marker, 'dragend', this.setLatLong);

		Blitz.map.setMapTypeId('satellite');
		Blitz.map.setCenter(Blitz.marker.getPosition());
		/*
		this.map.setMapTypeId('satellite');
		setTimeout(function() {
			Blitz.map.setMapTypeId('satellite');
			google.maps.event.trigger(Blitz.map, "resize");
		}, 500);//google.maps.MapTypeId.SATELLITE);
		*/
	},

	initLatLong : function(lat, long) {
		//center of dk if not defined
		lat = lat || 56.126627523318206;
		long = long || 11.457741782069204;
		$("#lat").val(lat.toString().substring(0,10));
		$("#long").val(long.toString().substring(0,10));
	},

	setLatLong : function(event) {
		Blitz.initLatLong(event.latLng.lat(), event.latLng.lng());
		if (Blitz.marker!=null) {
			Blitz.marker.setPosition(event.latLng);
		} else {
			Blitz.marker = new google.maps.Marker({
				position: event.latLng,
				map: Blitz.map,
				draggable: false
			});
		}
	},

	setEventCookie : function(event_id) {
		document.cookie = COOKIE_EVENT+'='+event_id;
	},

	getEventCookie : function(event_id) {
		return $.cookie(COOKIE_EVENT) || false;
	},

	checkEvent : function() {
		if (!this.hasParams()) return;
		var current_event = this.getEventCookie();
		if (current_event) this.loadEvent(current_event, false);
	},

	showMsg : function(msg) {
		var w = (window.innerWidth-300)/2;
		var h = (window.innerHeight-160)/2;
		$("#msg").css('left',w+'px');
		$("#msg").css('top',h+'px');
		$("#msg").html(msg);
		$("#msg").show();
		setTimeout(function() {
			$("#msg").fadeOut(1000);
		}, 1000);
	},

	enableBtn : function(button_id, enable) {
		if (enable) {
			$(button_id).removeClass('btn-warning');
			$(button_id).addClass('btn-success');
		} else {
			$(button_id).removeClass('btn-success');
			$(button_id).addClass('btn-warning');
		}
	},
	
	populateEvents : function() {
		var scope = (User.isEventAdmin() || User.isSuperUser()) ? '?scope=all' : '?scope=reduced';
		$.ajax({
			url: 'ajax/eventlist.php'+scope,
			dataType: 'json',
			async : false,
			success : function(json) {
				var half = Math.abs(json.events.length / 2);
				for (var i=0;i<json.events.length;i++) {
					var event=json.events[i];
					var href='index.html?event_id='+event.id;
					var title=event.dato_text+' - '+event.titel;
					var li='<li><a href="'+href+'" title="'+title+'">';
					li+=event.titel+'</li>';
					$("#event-dropdown").append(li);
					/*
					if (i<=half) {
						$("#event-dropdown-1").append(li);
					} else {
						$("#event-dropdown-2").append(li);
					}
					*/
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	saveFund : function() {
		var params = $("#fund-form").serialize();
		params+=($("#update-fund-id").val()=='') ? '&action=create' : '&action=update'
		var url='ajax/event_fund.php?'+params;
		var endeligt_bestemt = ($("#endeligt_bestemt").is(':checked')) ? 1 : 0;
		url+='&endeligt_bestemt='+endeligt_bestemt;
		$.ajax({
			url: url,
			success : function(html) {
				//html contains mysql_error() OR id of last inserted fund
				if (isNumber(html)) {
					if ($("#update-fund-id").val()=='') {
						$("#h2-indtastning").html('Fundets id : <span class="fund-id-label">'+html+'</span>');
						Blitz.showMsg('Fundet er gemt');
						$("#btn-save").addClass('disabled');
					} else {
						Blitz.showMsg('Fundet er opdateret');
					}
					document.cookie = COOKIE_LAST_HOLD+'='+$("#finder_hold").val();
					document.cookie = COOKIE_LAST_GRUPPE+'='+$("#finder_gruppe").val();
				} else {
					if (html!='') {
						//alert(html); //mysql_error
					}
				} 
			}
		});			
	},

	newFund : function() {
		$("#h2-indtastning").text('Indtastning af fund');
		$("#fund-form input[type='text']").val('');
		$("#noter").val('');

		document.getElementById("endeligt_bestemt").checked=true;

		$("#finder_hold").val($.cookie(COOKIE_LAST_HOLD));
		$("#finder_gruppe").val($.cookie(COOKIE_LAST_GRUPPE));
		$("#indtaster").val($.cookie(COOKIE_USERNAME));

		setTimeout(function() {
			Blitz.initLatLong(Blitz.lat, Blitz.long);
			Blitz.checkInput();
		}, 500);
	},

	editFund : function(fund_id) {
		this.setSection(SECTION_INDTAST);
		$(SECTION_INDTAST).load('include/indtast.html');
		var url='ajax/event_fund.php';
		url+='?action=get';
		url+='&id='+fund_id;
		$.ajax({
			url : url,
			dataType: 'json',
			success : function(json) {
				$("#taxon").val(json.taxon);
				$("#dknavn").val(json.dknavn);
				$("#finder_gruppe").val(json.finder_gruppe);
				$("#finder_hold").val(json.finder_hold);
				$("#finder_navn").val(json.finder_navn);
				$("#lat").val(json.lat);
				$("#long").val(json.lng);
				$("#bestemmer").val(json.bestemmer);
				$("#indtaster").val(json.indtaster);
				$("#h2-indtastning").html('Rediger fund : <span class="fund-id-label">'+json.LNR+'</span>');
				$("#update-fund-id").val(json.LNR);
				$("#artsgruppe").val(json.artsgruppe);
				$("#artsgruppe_dk").val(json.artsgruppe_dk);
				$("#rige_dk").val(json.rige_dk);
				if (json.endeligt_bestemt==1) {
					$("#endeligt_bestemt").attr('checked','checked');
				} else {
					$("#endeligt_bestemt").removeAttr('checked');
				}
				Blitz.initMap(json.lat, json.lng);
			}
		});
	},	

	createFinderNavn : function(fund) {
		var finder_navn = '';
		if (fund.finder_gruppe!='') finder_navn+=fund.finder_gruppe;
		if (fund.finder_hold!='') {
			if (finder_navn!='') finder_navn+=', ';
			finder_navn+=fund.finder_hold;
		}
		if (fund.finder_navn!='') {
			if (finder_navn!='') finder_navn+=', ';
			finder_navn+=fund.finder_navn;
		}
		return finder_navn;
	},

	updateFundTable : function() {
		var url='ajax/fund_tabel.php';
		url+='?event_id='+this.event_id;
		$.ajax({
			url : url,
			dataType : 'json',
			cache : false,
			success : function(json) {
				$("#table-fund > tbody").empty();
				for (var i=0;i<json.fund.length;i++) {
					var fund=json.fund[i];
					var click=' onclick="Blitz.showFund(&quot;'+fund.LNR+'&quot;);" title="Klik for at se alle oplysninger om fundet"';
					var css='';
					if (fund.minago<60) css=' class="info"';
					if (fund.minago<16) css=' class="success"';
					var tr='<tr'+css+click+' style="cursor:pointer;">';
					var ok=(fund.endeligt_bestemt==1) ? '<i class="i-link icon-ok"></i>' : '';
					tr+='<td>'+ok+'</td>';
					tr+='<td>'+fund.LNR+'</td>';
					tr+='<td>'+fund.dknavn+'</td>';
					tr+='<td>'+fund.taxon+'</td>';
					tr+='<td>'+fund.artsgruppe_dk+'</td>';
					tr+='<td>'+fund._timestamp+'</td>';
					tr+='<td class="center">'+fund.count+'</td>';
					tr+='<td>'+fund.finder_navn+'</td>';
					tr+='<td>'+fund.finder_hold+'</td>';
					tr+='<td>'+fund.finder_gruppe+'</td>';

					if (parseInt(fund.billeder)>0) {
						tr+='<td'+click+'>'+fund.billeder+'&nbsp;<img src="ico/photo.png"></td>';
					} else {
						tr+='<td></td>';
					}

					tr+='</tr>';
					$('#table-fund tbody').append(tr);
				}
				if (Blitz.current_section==SECTION_FUND) {
					setTimeout(function() {
						Blitz.updateFundTable();
					}, 30000);
				}
				var h2='Fund : '+json.fund.length+' arter, '+fund.total+' fund i alt';
				$("#h2-fund").text(h2);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	initWebcam : function(id) {
		this.setSection(SECTION_FOTO);
		if ((id=='undefined') || (!isNumber(id))) {
			id=prompt('Tast fund-id (løbenr)','');
			if ((id=='') || (!isNumber(id))) {
				Blitz.setFrontpage();
				Blitz.showMsg('Fund id <em>skal</em> angives!');
				return;
			}
		}		
		this.current_fund=id;
		var url='ajax/event_fund.php';
		url+='?action=get';
		url+='&id='+id;
		$.ajax({
			url : url,
			dataType: 'json',
			success : function(json) {
				if (json.hasOwnProperty('error')) {
					Blitz.showMsg('Fund #'+id+' eksisterer ikke');
					Blitz.setFrontpage();
					return false;
				}
				var h2='Fund - tilknyt foto(s), ';
				h2+=json.taxon;
				if (json.dknavn!='') h2+=' / '+json.dknavn;
				h2+=' ('+json.LNR+')';
				$("#h2-webcam").text(h2);
				this.current_fund=json.LNR;
				//
				$("#upload-event_id").val(Blitz.event_id);
				$("#upload-fund_id").val(Blitz.current_fund);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
		webcam.set_hook('onComplete', 'webcamCompletion');
	},

	webcamTakePicture : function() {
		webcam.freeze();
		$("#btn-foto-save").removeClass('btn-danger');
		$("#btn-foto-save").addClass('btn-success');
	},

	webcamUpload : function() {
		webcam.upload();
	},

	webcamAssocFund : function(event_id, fund_id, filename) {
		this.wait(true);
		var url='ajax/fund_img.php';
		url+='?event_id='+event_id;
		url+='&fund_id='+fund_id;
		url+='&filename='+filename;
		$.ajax({
			url: url,
			success : function(msg) {
				//alert(msg);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('webcamAssocFund error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	fundInfo : function(caption, text) {
		return '<div class="desc-caption">'+caption+'</div><div class="desc-info">'+text+'</div>';
	},

	showFund : function(fund_id) {
		this.setSection(SECTION_SHOW_FUND);
		var url='ajax/event_fund.php';
		url+='?action=get';
		url+='&id='+fund_id;
		$.ajax({
			url : url,
			dataType: 'json',
			cache : false,
			success : function(json) {
				var text=(json.taxon!=='') ? '<em>'+json.taxon+'</em>' : 'Ikke bedømt';
				text+=(json.dknavn!='') ? ' / '+json.dknavn : '';

				$("#show-fund-details").append('<h3>'+text+'</h3>');
			
				if (json.endeligt_bestemt=='1' && json.first_occurrence=='1') {
					$("#show-fund-details").append('<h4 style="color:forestgreen">Første endeligt bedømte registrering af arten</h3>');
				}
			
				var rige=(json.rige_dk!='xxx') ? json.rige_dk : 'Ikke bedømt';
				var artsgruppe=(json.artsgruppe_dk!='') ? json.artsgruppe_dk : 'Ikke bedømt';

				$("#show-fund-details").append(Blitz.fundInfo('Rige', rige));
				$("#show-fund-details").append(Blitz.fundInfo('Artsgruppe', artsgruppe));
				$("#show-fund-details").append(Blitz.fundInfo('Finder', json.finder_navn));
				$("#show-fund-details").append(Blitz.fundInfo('Hold', json.finder_hold));
				$("#show-fund-details").append(Blitz.fundInfo('Gruppe', json.finder_gruppe));
				$("#show-fund-details").append(Blitz.fundInfo('Tidspunkt', json._timestamp));
				$("#show-fund-details").append(Blitz.fundInfo('Sted', json.lat+' / '+json.lng));
				$("#show-fund-details").append(Blitz.fundInfo('Bestemmer', json.bestemmer));
				$("#show-fund-details").append(Blitz.fundInfo('Indtaster', json.indtaster));

				var billeder=json.billeder[0];
				for (var filename in billeder) {
					var img='<br><img src="'+billeder[filename]+'" style="float:left;clear:both;"><br>';
					$("#show-fund-details").append(img);
				}

				if (json.endeligt_bestemt==1) {
					var url='https://allearter-databasen.dk/api/?get=art&query='+json.taxon;					
					$.ajax({
						url : url,
						dataType: 'json',
						success : function(json) {
							if (json.allearter[0].Billede!='') {
								var img='<img src="'+json.allearter[0].Billede+'" style="width:400px;">';
								$("#type-billede").append(img);
							}
						},
						error: function(jqXHR, textStatus, errorThrown) {
							alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
						}
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}

		});
	},

	soeg : function(restoring) {
		var params = $("#fund-soeg").serialize();
		var url='ajax/fund_soeg.php?'+params;
		$.ajax({
			url: url,
			dataType: 'json',
			cache : false,
			success : function(json) {
				$("#table-soeg > tbody").empty();
				for (var i=0;i<json.soeg.length;i++) {
					var soeg=json.soeg[i];
					var click=' onclick="Blitz.showFund(&quot;'+soeg.LNR+'&quot;);" ';
					var tr='<tr title="Klik for at se alle oplysninger om fundet">';
					if (Blitz.user_name!='') {
						tr+='<td><i class="i-link icon-camera icon-2x" title="Tilføj webcam-billede til fund" onclick="Blitz.initWebcam(&quot;'+soeg.LNR+'&quot;);"></td>';
						tr+='<td><i class="i-link icon-edit icon-2x" title="Rediger fund" onclick="Blitz.editFund(&quot;'+soeg.LNR+'&quot;);" ></td>';
					}

					var ok=(soeg.endeligt_bestemt==1) ? '<i class="i-link icon-ok icon-2x"></i>' : '';
					tr+='<td'+click+'>'+ok+'</td>';
					tr+='<td'+click+'>'+soeg.LNR+'</td>';
					tr+='<td'+click+' style="max-width:200px;overflow-x:hidden;text-overflow:ellipsis;" title="'+soeg.taxon+'">'+soeg.taxon+'</td>';
					tr+='<td'+click+'>'+soeg.artsgruppe_dk+'</td>';
					tr+='<td'+click+'>'+soeg.dknavn+'</td>';
					tr+='<td'+click+'>'+soeg.finder_navn+'</td>';
					tr+='<td'+click+'>'+soeg.finder_hold+'</td>';
					if (parseInt(soeg.billeder)>0) {
						tr+='<td'+click+'>'+soeg.billeder+'&nbsp;<img src="ico/photo.png"></td>';
					} else {
						tr+='<td></td>';
					}
					tr+='<td'+click+'>'+soeg.indtaster+'</td>';
					tr+='<td>'+soeg._timestamp+'</td>';

					tr+= (User.isEventAdmin() || User.isSuperUser()) 
						?  '<td><button class="btn btn-mini btn-danger btn-fund-delete" LNR="'+soeg.LNR+'" type="button" style="font-weight:bold;" title="Slet fund">&times;</button></td>'
						: '<td></td>'

					tr+='</tr>';
					$('#table-soeg tbody').append(tr);
				}
				if (!restoring) Blitz.saveSearch();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error : '+jqXHR.responseText+' '+textStatus+' '+errorThrown);
			}
		});
	},

	initStatistik : function() {
		this.setSection(SECTION_STATISTIK);
		/*
			new hackish wait to ensure visualization is loaded
			using callback would need huge changes to the entire structure of the app
		*/
		var wait = setInterval(function() {
			if (google.visualization && google.visualization.BarChart) {
				clearInterval(wait);
				Res.init();
			}
		}, 100);
	},

	saveSearch : function() {
		$("#fund-soeg input").each(function() {
			document.cookie = $(this).attr('id')+'='+$(this).val();
			var hasData = $("#table-soeg tbody").length>0;
			document.cookie = 'soeg-data='+hasData.toString();
		});
	},

	restoreSearch : function() {
		$("#fund-soeg input").each(function() {
			if ($(this).attr('id')!='soeg-event_id') {
				var val=$.cookie($(this).attr('id'));
				$(this).val(val);
			}
		});
		if ($.cookie('soeg-data')) Blitz.soeg(true);
	},
	
	getParam : function(param) {
		param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + param + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if(results == null) {
			return "";
		} else {
		    return decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	},

	hasParams : function() {
		return (window.location.search!='');
	},

	setManual : function(manual) {
		this.setSection(SECTION_MANUAL);
		switch (manual) {
			case 'Indtastning' : 
				$(SECTION_MANUAL).load('manual/indtastning.html?ver=123');
				break;
			case 'Resultater' :
				$(SECTION_MANUAL).load('manual/res.html?ver=123');
				break;
			default :
				break;	
		}
	}

};

function isNumber(o) {
	return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

function webcamCompletion(msg) {
	if (msg.match(/(http\:\/\/\S+)/)) {
		var image_url = RegExp.$1;
		Blitz.webcamAssocFund(Blitz.event_id, Blitz.current_fund, msg);
		$("#foto-msg").text(msg+' er gemt ..');
		webcam.reset();
	} else {
		alert('Fejl : '+msg);
	}
	Blitz.wait(false);
}

$(document).ready(function() {
	if (Admin.isAdmin()) return;
	Blitz.checkEvent();
	User.checkLogin(); //update login info if available
	Blitz.populateEvents();
	Blitz.init();
	$(".event").click(function(e) {
		if ($(this).hasClass('btn-warning')) {
			e.preventDefault();
			e.stopPropagation();
		}
	});
	$("#btn-soeg").click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		Blitz.soeg(false);
	});
	$("#btn-foto-save").click(function() {
		if ($(this).hasClass('btn-warning')) return;
		Blitz.webcamUpload();
	});
	$("#btn-foto-take").click(function() {
		Blitz.webcamTakePicture();
	});
	$("#btn-foto-new").click(function() {
		$("#btn-foto-save").removeClass('success');
		$("#btn-foto-save").addClass('warning');
		webcam.reset();
	});
	if (Blitz.user_name!='') {
		$("#table-soeg thead tr").prepend('<th></th>');
		$("#table-soeg thead tr").prepend('<th></th>');
	}
	$("#fund-soeg input").on('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)	Blitz.soeg();
	});

	//look artsgrupper up once
	$.ajax({
		url: 'https://allearter-databasen.dk/api/?get=artsgrupper&query=',
		success: function(json) {
			var artsgrupper = []
			json.allearter.forEach(function(item) { 
				if (!~artsgrupper.indexOf(item.Artsgruppe_dk)) artsgrupper.push(item.Artsgruppe_dk)
			})
			$("#soeg-artsgruppe_dk").typeahead({
				items : 20,
				source: artsgrupper
			})
		}
	});

	$("#soeg-taxon").typeahead({
		items : 20,
		source: function (query, process) {
			var url='https://allearter-databasen.dk/api/?get=arter&type=lat&&query='+encodeURIComponent(query);
			return $.get(url, {}, function(data) {
				return process(data.allearter.map(function(item) { return item.Videnskabeligt_navn }));
			})
		}
  });

	$("#soeg-dknavn").typeahead({
		items : 20,
		source: function (query, process) {
			var url='https://allearter-databasen.dk/api/?get=arter&type=dk&query='+encodeURIComponent(query);
			return $.get(url, {}, function(data) {
				return process(data.allearter.map(function(item) { return item.Dansk_navn }));
			})
		}
  });

	//delete fund, 12062016
	$('body').on('click', '.btn-fund-delete', function() {
		var LNR = $(this).attr('LNR')
		if (confirm('Dette vil slette fundet permanent - er du sikker på du vil fortsætte?')) {
			$.ajax({
				url: 'ajax/event_fund.php?action=delete&LNR='+LNR,
				success: function(msg) {
					Blitz.soeg()
				}
			})
		}
	})


});

