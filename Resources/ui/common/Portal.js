var main;
var nav;
var _location = {};
var _places = [];
var login = require('ui/common/Login');
var _db = require('ui/common/data/DB');

exports.getLocation = function(){
	return _location;
};

exports.loadPlaces = function(callBack,query){
	_loadPlaces(callBack,query);
};

function _loadPlaces(callBack,query) {
		var  url="http://services.flair.me/search.php";
		var _dataStr = {};
		query = query.trim();
		if(_location.latitude && query.length > 6){
			//do nothing;
		}else{
			callBack([_places]);return;
		}
		
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.lat = _location.latitude;
		_dataStr.lng = _location.longitude;
		if(query){
			_dataStr.search = query;
		}
		_dataStr.accessToken=login.getAccessToken();
		debugger;
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
};

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
		
};



exports.init = function(){	
	initLocation();
	login.init(function(){
		draw();
	},function(){
		draw();
	},true);
	
};

var _menuStatus = false;
exports.toggleMenu = function(callBack){
	if(_menuStatus){
		_menuStatus=false;
		_resetMenu(callBack);
	}else{
		_menuStatus=true;
		_openMenu();
	}
};

function _resetMenu(callBack){
	var slide_it_right = Titanium.UI.createAnimation();
    	slide_it_right.left = 0; // to put it back to the left side of the window
    	slide_it_right.duration = 300;	
		nav.animate(slide_it_right,function(){
			if(callBack){
		  		callBack();
			}
		});
		_wallTempView.removeEventListener("click",_resetMenu);
		_wall.remove(_wallTempView);
}

var _wallTempView;
function _openMenu(){
	_wallTempView = Ti.UI.createView({left:0,top:0,width:Ti.UI.FILL,height:Ti.UI.FILL,bubbleParent:false,backgroundColor:"transparent"});
	_wallTempView.addEventListener("click",function(){
		_resetMenu();
	});
	_wall.add(_wallTempView);
		var slide_it_right = Titanium.UI.createAnimation();
    	slide_it_right.left = -250; // to put it back to the left side of the window
    	slide_it_right.duration = 300;
    	nav.animate(slide_it_right);
};

var _menu;
var _wall;
function draw(){
	_menu = require('ui/common/wall/Menu');
	_menu.init();
    
	var Wall = require('ui/common/wall/Wall');
	
	_wall = Wall.init("nearby");
	
	nav = Titanium.UI.iOS.createNavigationWindow({
   		window: _wall,width:320
	});

	nav.open();
}


exports.open = function(win,animated){
	if(animated !== false){
		nav.openWindow(win,{animated:true});
	}else{
		nav.openWindow(win,{animated:false});
	}
};

exports.close = function(win,animated){
	if(animated !== false){
		nav.closeWindow(win,{animated:true});
	}else{
		nav.closeWindow(win,{animated:false});
	}
	win = null;
};

exports.close_all = function(){
	//var x = nav.getChildren();
	while(nav.getChildren().length > 1){
		nav.closeWindow(nav.getChildren()[nav.getChildren().length-1]);
	}
	
};

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
};

exports.setUserData = function(id,_data){
	var date = new Date();
	_data._lastLoaded = date.getTime();
	var login = require('ui/common/Login');
	var user = login.getUser();
		if(user.getId() == id){
			user.setData(_data);
		}
	Ti.App.Properties.setString("userData_" + id, JSON.stringify(_data));
};

exports.getUserData = function(id){
	var _data = Ti.App.Properties.getString("userData_" + id);
	if(_data && _data !=="undefined" && _data !==undefined){
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
};