var main;
var nav;
var _location;
var _places;
var login = require('ui/common/Login');

exports.getLocation = function(){
	return _location;
}

exports.getPlaces = function(callBack,load){
	if(load || _places.length ===0){
		loadPlaces(callBack);
	}else{
		callBack(_places);
	}
}

function loadPlaces(callBack) {
		Ti.API.error("places init 1");
		var  url="https://flair.me/search.php";
		var _dataStr = {};
		
		if(_location){
			//do nothing;
		}else{
			_location = {};
		}
		
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.lat = _location.latitude;
		_dataStr.lng = _location.longitude;
		_dataStr.accessToken=login.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     		Ti.API.error("places init 2");
     	Ti.API.info(this.responseText);
     	 _places = JSON.parse(this.responseText);
     	 if(callBack){
     	 		Ti.API.error("places init 3");
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

exports.initLocation = function(_callBack){
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
 		//if(!_places){
 			Ti.API.error("places init");
 			loadPlaces(_callBack); 		
 		//}
		/*var current_longitude = e.coords.longitude;
		var current_latitude = e.coords.latitude;
		var current_altitude = e.coords.altitude;
		var current_heading = e.coords.heading;
		var current_accuracy = e.coords.accuracy;
		var current_speed = e.coords.speed;
		var current_timestamp = e.coords.timestamp;
		var current_altitudeAccuracy = e.coords.altitudeAccuracy;*/
	});
		
	Ti.Geolocation.addEventListener("location", function(e){
		_location = e.coords;
	});	
		
}

exports.remove = function(win){
	win.close();
	nav.remove(win);
}


exports.init = function(){	
//		var props = Ti.App.Properties.listProperties();
//		for (var i=0;i<props.length;i++){
//    			Ti.App.Properties.removeProperty(props[i]);
//		}	
   _places = [];
	main = Titanium.UI.createWindow();

	var Places = require('ui/common/flair/Places');
	var places = Places.init();
	
	nav = Titanium.UI.iPhone.createNavigationGroup({
   		window: places
	});

	main.add(nav);

	nav.open(places, {animated:true});

	main.open();
	
	//initLocation();
}

exports.open = function(win,_animated){
	if(_animated !== false){
		nav.open(win,{animated:true});
	}else{
		nav.open(win,{animated:false});
	}
}

exports.setDirty = function(id){
  	var _data = Ti.App.Properties.getString("userData_" + id);
	if(_data){
		var obj = JSON.parse(_data);
		obj._dirty = true;
		var portal = require("ui/common/Portal");
		portal.setUserData(id,obj);
	}else{
		return false;
	}
}

exports.setUserData = function(id,_data){
	var date = new Date();
	_data._lastLoaded = date.getTime();
	var login = require('ui/common/Login');
	var user = login.getUser();
		if(user.getId() == id){
			user.setData(_data);
		}
	Ti.App.Properties.setString("userData_" + id, JSON.stringify(_data));
}

exports.getUserData = function(id){
	var _data = Ti.App.Properties.getString("userData_" + id);
	if(_data){
		var obj = JSON.parse(_data);
		if(obj._dirty || obj.invited != true){
			return false;
		}else{
			if(obj._lastLoaded){
				var now = new Date();	
				var diff = (now.getTime() - obj._lastLoaded);
				if(diff > (60*10*1000)){
					return false;
				}else{
					return obj;
				}
			}else{
				return false;	
			}
		}
	}else{
		return false;
	}
}