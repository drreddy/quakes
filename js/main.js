
var map_one, map_two, month_data, day_data;

var markers_one = [];

// varibles for single point visualization

var single_point_marker, single_point_circle = null;

var single_point_infoWindows = [] , single_point_markers = [];

// flag to pause and resume the animation

var anim_flag=0, speed_flag=0;

var anim_time = 1000;

var interval, quake_func;

$('#state').text("Playing");
$('#speed_val').text(anim_time);

$("#infobotright").delay(5000).fadeOut("slow");
$("#slide").delay(2500).slideUp("slow");

$("#inforight").click(function(){
	$("#slide").slideDown("slow");        
	$("#slide").delay(2500).slideUp("slow");
});

$("#int_link_one").click(function(){
	event.preventDefault(); 
	var target = $(this).attr("href");
	$("body,html").stop().animate({ scrollLeft: $(target).offset().left }, 1500 );
	anim_flag = 1;       
});

$("#int_link_two").click(function(){
	event.preventDefault(); 
	var target = $(this).attr("href");
	$("body,html").stop().animate(
		{ scrollLeft: $(target).offset().left },
		{
		    duration: 1500,
		    complete: function() {
		        setTimeout(function() {
		            anim_flag = 0;  
		        }, 100);
			}
		}
	);     
});

$("#slow").click(function(){
	if(anim_time < 1600 && speed_flag == 0){
		anim_time = anim_time + 300;
		window.clearInterval(interval);
		interval = setInterval(quake_func, anim_time);
		$('#speed_val').text(anim_time);
		//console.log(anim_time);
	}      
});

$("#fast").click(function(){
	if(anim_time > 400 && speed_flag == 0){
		anim_time = anim_time - 300;
		window.clearInterval(interval);
		interval = setInterval(quake_func, anim_time);
		$('#speed_val').text(anim_time);
		//console.log(anim_time);
	}       
});

$("#reset").click(function(){
	anim_time = 1000;
	window.clearInterval(interval);
	interval = setInterval(quake_func, anim_time);
	$('#speed_val').text(anim_time);
	//console.log(anim_time);
});

$("#play_pause").click(function(){
	if(speed_flag == 0){
		speed_flag = 1;
		$("#play_pause").text("Play");
		$('#state').text("Paused");
	}else{
		speed_flag = 0;
		$("#play_pause").text("Pause");
		$('#state').text("Playing");
	}       
});

var colorarray = ['#cc0000', '#ff9900', '#009900'];

function initialize() {
    var mapOptions1 = {
      zoom: 2,
      center: new google.maps.LatLng(22, -250),
      //mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType": "all", "elementType": "labels","stylers": [ { "visibility": "off" } ]}]
    };

    map_one = new google.maps.Map(document.getElementById('map1_canvas'),
        mapOptions1);

    var mapOptions2 = {
      zoom: 2,
      center: new google.maps.LatLng(22, -250),
      //mapTypeId: google.maps.MapTypeId.ROADMAP,
      //disableDefaultUI: true,
      styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}]
    };

    map_two = new google.maps.Map(document.getElementById('map2_canvas'), mapOptions2);


    $.ajax({
	    url: 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/2.5/month', //'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojsonp',
	    dataType: 'jsonp',
	    jsonp: false,
	    jsonpCallback: 'eqfeed_callback'
	}).done(function(data) {
	    //console.log(data.features.length);
	    month_data = data;
	    full_data_viz(data);
	});



    $.ajax({
	    url: 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/1.0/day', //'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojsonp',
	    dataType: 'jsonp',
	    jsonp: false,
	    jsonpCallback: 'eqfeed_callback'
	}).done(function(data) {
	    //console.log(data.features.length);
	    day_data = data;
	    //point_viz(data);
	});

	google.maps.event.addListener(map_two, 'rightclick', function(event){
    	//alert("point_viz function calling");
    	//point_viz(event.latLng);
    	
    	// at most one marker will be in the center always so we remove all the others

    	if( single_point_marker != null && single_point_circle !=null ){
			single_point_marker.setMap(null);
			single_point_circle.setMap(null);
    	}

    	for (i in single_point_markers){
    		single_point_markers[i].setMap(null);
    	}

    	single_point_markers = [];

    	single_point_infoWindows = [];

    	single_point_marker = new google.maps.Marker({
	        map:       map_two,
	        position:  event.latLng,
	        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
	    });

	    single_point_circle = new google.maps.Circle({
	        center: event.latLng,
	        radius: 160934,
	        strokeColor: "#FF0000",
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: "#FF0000",
	        fillOpacity: 0.2,
	        map: map_two
	    });

	    map_two.panTo(event.latLng);
	    point_viz(event.latLng);
    });

};

 function full_data_viz(res) {
      quakes = res.features
      var i = 0;
      var num = quakes.length

      quake_func = function quake(){
      	if (anim_flag == 0 && speed_flag == 0){
      		if (i<num){

              var earthquake = quakes[i];

              var coords = earthquake.geometry.coordinates;

              if (i !==0 ){
                removemarker(markers_one[i-1]);
              } 

              var latLng = new google.maps.LatLng(coords[1],coords[0]);
              var marker = new google.maps.Marker({
                position: latLng,
                map: map_one,
                icon: getCircle(earthquake.properties.mag)
              });

              date = new Date(parseInt(earthquake.properties.time, 10));
              var info = "<div><div>Place: <b style='letter-spacing: 0.0625em;'>"+earthquake.properties.place+"</b></div><div style=''><div>Magnitude: <b style='letter-spacing: 0.0625em;'>"+earthquake.properties.mag+"</b></div><div>Date/Time: <b>"+date+"</b></div></div></div>";

              $('#info').html(info);

              markers_one.push(marker);

              i += 1
            }
            else{
              clearInterval(interval);
              markers_one = []
            }
      	}            
      };
      
      interval = setInterval(quake_func, anim_time);
      
      function removemarker(marker){
          marker.setMap(null)
      }
    };

function point_viz(cent){

	var all_data = day_data;

	var info_window_index = 0;

	//console.log("inside function check");

	for(i=0; i<all_data.features.length; i++){

		var earthquake = all_data.features[i];

		var coords = earthquake.geometry.coordinates;

		var checklatLng = new google.maps.LatLng(coords[1],coords[0]);

		var dist = google.maps.geometry.spherical.computeDistanceBetween (cent, checklatLng);

		//console.log(dist);

		if (dist <= 160934){

			marker_dist = new google.maps.Marker({
		        map:       map_two,
		        position:  checklatLng,
		        title: earthquake.properties.place,
		        infoWindowIndex: info_window_index
		    });

		    date = new Date(parseInt(earthquake.properties.time, 10));
          	var content = "<div><div style='font-size: 1.25em; font-weight: bold;'>"+earthquake.properties.place+"</div><div style='font-size: 1.15em;'><div>Magnitude: <b style='color: black;'>"+earthquake.properties.mag+"</b></div><div style='width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>URL: <a href='"+earthquake.properties.url+"' target='_blank'><b>"+earthquake.properties.url+"</b></a></div><div>Date/Time: <b>"+date+"</b></div></div></div>";

		    var infoWindow = new google.maps.InfoWindow({
	            content : content
	          });

	          google.maps.event.addListener(marker_dist, 'click', 
	              function(event)
	              {
	              	//console.log(this.infoWindowIndex);
	                single_point_infoWindows[this.infoWindowIndex].open(map_two, this);
	              }
	          );

	          //console.log(typeof single_point_infoWindows);

	          
	          single_point_markers.push(marker_dist);
	          single_point_infoWindows.push(infoWindow);

	        info_window_index = info_window_index + 1 ;
		};

		
	}

	if(info_window_index != 0){
		info = "<b>Total "+ single_point_infoWindows.length +" Quakes happened with in a 100 miles radius with magnitude >= 1 in the past day</b>"
		$('.two').html(info);
	}
	else{
		info = "<b>No Quakes happened with in a 100 miles radius with magnitude >= 1 in the past day</b>"
		$('.two').html(info);
	};

	map_two.setZoom(6);
};

  function getCircle(magnitude) {

    var fillcol;

    if ( magnitude >= 2.5 && magnitude <= 3.5 ){
      fillcol = colorarray[2];
    }else if ( magnitude >= 3.5 && magnitude <= 4.5 ) {
      fillcol = colorarray[1];
    }else{
      fillcol = colorarray[0]
    };

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: fillcol,
      fillOpacity: 0.2,
      scale: 2*magnitude, //Math.pow(2, magnitude) / Math.PI,
      strokeColor: "white",
      strokeWeight: 0.4
    };
  }

google.maps.event.addDomListener(window, 'load', initialize);