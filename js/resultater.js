
var Res = {

	//defaults
	DK_Lat : 56.30, 
	DK_Long : 11.65,
	DK_Zoom : 7,
	zoom_off : "Zoom ind",
	zoom_on : "Zoom ud",

	//vars
	map : null,
	artsgruppe : '',
	hold : '*',
	markers : [],
	resultat_json : '',
	holdArtsgrupper : '',
	infoBox : null,
	infoBoxText: null,

	init : function() {
		$('#myTab a:first').tab('show');
		this.initMap();
		this.placerFund();
		this.initArtsgruppeSelect();
		this.initHoldSelect();
		this.getHoldArtsgrupper();
		this.initPiktogrammer();

		this.infoBoxText = document.createElement("div");
        this.infoBoxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px; font-size: 14px; line-height:15px;";
        this.infoBoxText.innerHTML = "";
                
        var myOptions = {
			content: this.infoBoxText
			,disableAutoPan: false
			,maxWidth: 0
			,pixelOffset: new google.maps.Size(0, -15)
			,zIndex: null
			,boxStyle: { 
				opacity: 0.85,
				width: "200px"
			}
			,closeBoxMargin: "10px 2px 2px 2px"
			,closeBoxURL: "https://www.google.com/intl/en_us/mapfiles/close.gif"
			,infoBoxClearance: new google.maps.Size(1, 1)
			,isHidden: false
			,pane: "floatPane"
			,enableEventPropagation: false
        };

		this.infoBox = new InfoBox(myOptions);

		$("#download-csv").click(function() {
			var url='download.php?type=csv&event_id='+Blitz.event_id;
			window.location=url;
		});
		$("#download-gbif").click(function() {
			var url='download.php?type=gbif&event_id='+Blitz.event_id;
			window.location=url;
		});
		$("#download-excel").click(function() {
			alert('ok');
			var url='download.php?type=excel&event_id='+Blitz.event_id;
			window.location=url;
		});
	},

	initMap : function () {
		google.maps.visualRefresh = true;
		this.map = Res.googleMap('statistik-map', window.Blitz.lat, window.Blitz.long, 16);
		this.map.setCenter(new google.maps.LatLng(window.Blitz.lat, window.Blitz.long));
		this.map.setMapTypeId('satellite');
	},

	googleMap : function(elem_id, lat, lng, zoom) {
		zoom = (typeof zoom=='number') ? zoom : Res.DK_Zoom;
		var latlng = new google.maps.LatLng(lat, lng);

		var stylers = [{
			//remove "Danmark / Denmark"
			featureType: "administrative.country",
			elementType: 'labels',
			stylers: [{ visibility: 'off' }]
		},{
			//remove points of interest
			featureType: "poi",
			elementType: 'all',
			stylers: [{ visibility: 'off' }]
		}, {
			//remove road labels
	    featureType: "road",
	    elementType: "labels",
	    stylers: [{ "visibility": "off" }]
	  }];
	
		//console.log(google.maps.MapTypeControlStyle)

		var mapOptions = {
			zoom: zoom,
			center: latlng,
			zoomControl: true,
			streetViewControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_TOP
			},
		  mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        //position: google.maps.ControlPosition.TOP_CENTER
	    },
			styles : stylers,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		}
		//
		var map = new google.maps.Map(document.getElementById(elem_id), mapOptions);	

		if (map.keyDragZoomEnabled) {
			map.enableKeyDragZoom({
				visualEnabled: true,
				//visualPosition: google.maps.ControlPosition.LEFT,
				visualPositionMargin: new google.maps.Size(35, 0),
				visualImages: {},
				visualTips: {
					off: Res.zoom_off,
					on: Res.zoom_on
				}
			});
		}

		map.setCenter(new google.maps.LatLng(lat, lng));
		return map;
	},

	evalFund : function(fund) {
		if (Res.hold!='*') {
			if (fund.finder_hold!=Res.hold) return false;
		}
		if (Res.artsgruppe!='') {
			if (fund.artsgruppe_dk!=Res.artsgruppe) return false;
		}
		return true;
	},

	placerFund : function() {
		var bounds = new google.maps.LatLngBounds();
		count=0;
		var url='ajax/event_resultat.php';
		url+='?event_id='+Blitz.event_id;
		$.ajax({
			url : url,
			dataType : 'json',
			cache : false,
			success : function(json) {
				for (var i=0;i<json.fund.length;i++) {
					var fund=json.fund[i];
					if (Res.evalFund(fund)) {
						var icon=($.inArray(fund.artsgruppe_dk, artsgruppe_icons)) ?	
							artsgruppe_icons[fund.artsgruppe_dk] :
							artsgruppe_ukendt_icon;
		
						if (icon==null) {
							icon=artsgruppe_ukendt_icon;
						}
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(fund.lat, fund.lng),
							icon: icon,
							LNR: fund.LNR,
							fund: fund,
							map: Res.map,
							draggable : true
						});

						bounds.extend(marker.position);

						google.maps.event.addListener(marker, 'click', function() {
							window.Blitz.showFund(this.LNR);
						});

						google.maps.event.addListener(marker, 'mouseover', function() {
							var content='';
							if (this.fund.artsgruppe_dk!='') content+=this.fund.artsgruppe_dk+'<br>';
							if (this.fund.taxon!='') content+='<em>'+this.fund.taxon+'</em><br>'; 
							if (this.fund.dknavn!='') content+=this.fund.dknavn+'<br>';
							content+='Fundet af : '+this.fund.finder_navn+'<br>';
							content+='Bestemt af : '+this.fund.bestemmer+'<br>';
			
							Res.infoBoxText.innerHTML=content;
							Res.infoBox.setPosition(this.position);
							Res.infoBox.open(Res.map, this);
						});

						/*
						//flyt rundt på kort
						google.maps.event.addListener(marker, 'dragend', function(event) {
							var LNR=this.LNR;
							$.ajax({
								url: 'ajax/move.php?LNR='+LNR+'&lat='+event.latLng.lat()+'&lng='+event.latLng.lng(),
								success : function(html) {
									//alert(html);
								}
							});
						});
						*/

					} else {
						console.log('Ikke godkendt',fund);
					}
				}
				if (!bounds.isEmpty()) {
					Res.map.fitBounds(bounds);
				}
			}
		});
	},

	initHoldSelect : function() {
		var url='ajax/event_hold.php';
		url+='?event_id='+Blitz.event_id;
		$.ajax({
			url : url,
			dataType : 'json',
			cache : false,
			success : function(json) {
				$("#select-hold").append('<option value="*">[ Alle hold ]</option>');
				for (var i=0;i<json.hold.length;i++) {
					var caption=(json.hold[i]!='') ? json.hold[i] : '< ikke angivet >';
					$("#select-hold").append('<option value="'+json.hold[i]+'">'+caption+'</option>');
				}
			}
		});
	},

	initArtsgruppeSelect : function() {
		var url='ajax/fund_artsgrupper.php?event_id='+Blitz.event_id;
		$.ajax({
			url: url,
			dataType: 'json',
			success : function (json) {
				$("#select-artsgruppe").append('<option value="">[ Alle artsgrupper ]</option>');
				for (var i=0;i<json.artsgrupper.length;i++) {
					$("#select-artsgruppe").append('<option value="'+json.artsgrupper[i]+'">'+json.artsgrupper[i]+'</option>');
				}
			}
		});
		$("#select-artsgruppe").click(function() {
			if ($(this).val()!=Res.artsgruppe) {
				Res.artsgruppe=$(this).val();
				Res.initMap();
				Res.placerFund();
			}
		});
		$("#select-hold").click(function() {
			if ($(this).val()!=Res.hold) {
				Res.hold=$(this).val();
				Res.initMap();
				Res.placerFund();
			}
		});
	},

	chartHoldArtsgrupper : function(id, hold, artsgrupper) {
		var colors = [];
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Artsgruppe');
		data.addColumn('number', 'Antal fund');
		for (var i=0;i<artsgrupper.length;i++) {
			var artsgruppe=artsgrupper[i];
			data.addRow([artsgruppe, artsgrupper[artsgruppe].count]);
			switch (artsgrupper[artsgruppe].rige) {

				case 'Dyreriget' :
					colors.push("#3366cc");
					break;

				case 'Planteriget' :
					colors.push("#109618");
					break;

				case 'Svamperiget' :
					colors.push("#ff9900");
					break;

				case 'Riget Chromista' :
					colors.push("#b82e2e");
					break;

				default : 
					colors.push("#dadada");
					break;
			}
		}
		var options = {
			title: 'Hold '+hold,
			width: 440,
			height: 300,
			pieSliceText: 'value',
			pieSliceTextStyle: { fontSize: '22' },
			colors : colors,
			chartArea: {left:-10,top:50,width:400,height:"100%"},
			backgroundColor: { stroke: "#ebebeb", strokeWidth: 1, fill: "#fff" }
	    };
	    var chart = new google.visualization.PieChart(document.getElementById(id));
	    chart.draw(data, options)
	},

	chartHoldRiger : function(holdriger) {	
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Hold');
		data.addColumn('number', 'Ej bedømt');
		data.addColumn('number', 'Dyreriget');
		data.addColumn('number', 'Planteriget');
		data.addColumn('number', 'Svamperiget');
		data.addColumn('number', 'Riget Chromista');

		for (var i=0;i<holdriger.length;i++) {
			var item=holdriger[i];
	 		data.addRow([item.hold, item.ejbestemt, item.dyreriget, item.planteriget, item.svamperiget, item.chromista]);
		}
		//var height=(holdriger.length)*45;
		var height=900;
		var innerHeight=height-130;
		new google.visualization.BarChart(document.getElementById('bar-riger')).
			draw(data, {
				title:"Holdenes fund fordelt på riger",
				isStacked : true,
				colors: ["#dadada", "#3366cc", "#109618", "#ff9900", "#b82e2e"],
				width: 900, 
				height: height,
				chartArea: {left:100,top:50,width:650,height: innerHeight},
		        vAxis: {title: "Hold", textStyle : { fontSize : '10' }},
		        hAxis: {title: "Antal"}
			});
		/*
		{"#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"}
		*/
	},

	parseHoldArtsgrupper : function(json) {
		var hold=[];
		for (i=0;i<json.fund.length;i++) {
			var fund=json.fund[i];
			if ((fund.finder_hold!='') && ($.inArray(fund.finder_hold, hold)<0)) {
				hold.push(fund.finder_hold);
			}
		}
		for (var i=0;i<hold.length;i++) {
			var holdnavn=hold[i];
			var artsgrupper=new Array();//[];
			for (count=0;count<json.fund.length;count++) {
				var fund=json.fund[count];
				if (fund.finder_hold==holdnavn) {
					var artsgruppe = (fund.artsgruppe_dk!='') ? fund.artsgruppe_dk : 'Ukendt';
					if ($.inArray(artsgruppe, artsgrupper)==-1) {
						artsgrupper.push(artsgruppe);
						var info = new Object();
						info.count=1;
						info.rige=fund.rige_dk;
						artsgrupper[artsgruppe]=info;
					} else {
						artsgrupper[artsgruppe].count++;
					}
				}
			}
			artsgrupper.sort(function(a, b) {
				return (artsgrupper[a].count>artsgrupper[b].count) ? -1 : 1;
			});
			var id='chart'+i;
			$("#hold-artsgrupper").append('<div class="piechart" id="'+id+'"></div>');
			Res.chartHoldArtsgrupper(id, holdnavn, artsgrupper);
		}
	},

	parseHoldRiger : function(json) {
		var hold=[];
		for (i=0;i<json.fund.length;i++) {
			var fund=json.fund[i];
			if ((fund.finder_hold!='') && ($.inArray(fund.finder_hold, hold)<0)) {
				hold.push(fund.finder_hold);
			}
		}
		var holdriger=[];
		for (var i=0;i<hold.length;i++) {
			var holdnavn=hold[i];
			var rige=new Object();
			rige.hold=holdnavn;
			rige.dyreriget=0;
			rige.planteriget=0;
			rige.protozoriget=0;
			rige.chromista=0;
			rige.svamperiget=0;
			rige.ejbestemt=0;
			for (count=0;count<json.fund.length;count++) {
				var fund=json.fund[count];
				if (fund.finder_hold==holdnavn) {
					switch (fund.rige_dk) {

						case 'Dyreriget' : 
							rige.dyreriget++;
							break;

						case 'Planteriget' : 
							rige.planteriget++;
							break;

						case 'Svamperiget' : 
							rige.svamperiget++;
							break;

						case 'Riget Chromista' : 
							rige.chromista++;
							break;

						case '' :
						case 'xxx' :
						case ' ' :
							rige.ejbestemt++;
							break;

						default :
							break;
					}
				}
			}
			holdriger.push(rige);
		}
		$("#hold-riger").append('<div id="bar-riger"></div>');
		Res.chartHoldRiger(holdriger);
	},

	getHoldArtsgrupper : function() {
		var url='ajax/event_resultat.php';
		url+='?event_id='+Blitz.event_id;
		$.ajax({
			url : url,
			dataType : 'json',
			cache : false,
			success : function(json) {
				Res.parseHoldRiger(json);
				Res.parseHoldArtsgrupper(json);
			}
		});						
	},

	initPiktogrammer : function() {
		var div='<div style="float:left;clear: none; margin-right:20px;width:170px;vertical-align:top;">';
		var html='<br>'+div;
		var count=1;
		for (var key in artsgruppe_icons) {
			if (artsgruppe_icons[key]!=artsgruppe_default_icon) {
				html+='<img src="'+artsgruppe_icons[key]+'">';
				html+='&nbsp;';
				html+='<span style="position:relative;top:-14px;">'+key+'</span>';
				html+='<br>';
				count++;
				if (count>=4) {
					html+='</div>'+div;
					count=1;
				}
			}
		}
		html+='<img src="'+artsgruppe_default_icon+'">&nbsp;<span style="position:relative;top:-14px;">Øvrige</span>';
		html+='</div>';
		$('#piktogrammer').html(html);
	},

};


