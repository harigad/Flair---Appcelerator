var main;
var nav;
var _location;
var _places;

exports.getLocation = function(){
	return _location;
}

exports.getPlaces = function(callBack){
	if(callBack){
		loadPlaces(callBack);
	}else{
		return _places;
	}
}

function loadPlaces(callBack) {
	var  url="https://flair.me/search.php";
		var _dataStr = {};
		
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.lat = _location.latitude;
		_dataStr.lng = _location.longitude;
		_dataStr.accessToken=Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	Ti.API.info(this.responseText);
     	 _places = JSON.parse(this.responseText);
     	 if(callBack){
     	 	callBack(_places);
     	 }
     },
     onerror : function(e) {
         Ti.API.error("Sending Flair to Server " + e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);		
}

function initLocation(){
	Titanium.Geolocation.purpose = "Find nearby Places";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	
	var my_location = Titanium.Geolocation.getCurrentPosition(function(e) {
        if (e.error) {
            Ti.API.log('error: ' + JSON.stringify(e.error) );
            return;
        } 
        
 		var portal = require('ui/common/Portal');
 		_location = e.coords;
 		if(!_places){
 			loadPlaces(); 		
 		}
		/*var current_longitude = e.coords.longitude;
		var current_latitude = e.coords.latitude;
		var current_altitude = e.coords.altitude;
		var current_heading = e.coords.heading;
		var current_accuracy = e.coords.accuracy;
		var current_speed = e.coords.speed;
		var current_timestamp = e.coords.timestamp;
		var current_altitudeAccuracy = e.coords.altitudeAccuracy;*/
	});
		
}

exports.remove = function(win){
	win.close();
	nav.remove(win);
}


exports.init = function(){	
	main = Titanium.UI.createWindow();

	var Home = require('ui/common/home/Home');
	var home = Home.init();
	
	nav = Titanium.UI.iPhone.createNavigationGroup({
   		window: home
	});

	main.add(nav);

	nav.open(home, {animated:true});

	main.open();
	
	initLocation();
}

exports.open = function(win){
	nav.open(win,{animated:true});
}
