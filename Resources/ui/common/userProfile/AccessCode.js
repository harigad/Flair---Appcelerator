var login = require('ui/common/Login');
var searchPlaceNav = require('ui/common/userProfile/SearchPlace');
var user = login.getUser();
var _view;
var main;
var _place;

exports.launch = function(_place){
	_init(_place);	
}

function _build(_place){
	if(!_place){
    	_place = user.getPlace();
	}
	var mapView = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region:{latitude:_place.lat, longitude:_place.lng, latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:true
    });
	
   var mapViewCont = Titanium.UI.createView(
		 {
		 	top:'0',
		  	height: '300'
		 }
	);	
	
   var mapDesc = Titanium.UI.createView(
		 {
		 	top:'0',
		  	height: '300',width:'320',bubbleParent:true,
		  	backgroundImage:'images/map_shade.png',layout:'vertical'
		 }
	);	
	var nameLabel = Ti.UI.createLabel({
  		left:10,
        top:'220',
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,shadowColor:'#333333',
  		color: '#fff',
  		text: _place.name,
  			font: {
         		fontSize: 16,fontWeight:'bold'
    		}
  		});  
	mapDesc.add(nameLabel);
	
	var addrLabel = Ti.UI.createLabel({
  		left:10,
    	width:'150',
  		height:Ti.UI.SIZE,
  		color: '#fff',
  		text: _place.vicinity,
  			font: {
         		fontSize: 14
    		}
  		});  
	mapDesc.add(addrLabel);
	
	mapViewCont.add(mapView);
	mapView.add(mapDesc);
	
	_view.add(mapViewCont);
	
	var _save_btn = Titanium.UI.createView(
		 {
		  	width: 300,
		  	height: 60 ,
		  	top:20,left:10,
		  	layout: 'horizontal',
		  	borderRadius:4,
		  	backgroundColor:'#2179ca'
		 }
	);
	_view.add(_save_btn);
	
	var _save_txt = Ti.UI.createLabel({
		top:15,
		bottom:15,
  		width:280,
  		left:10,
  		right:10,
  		color: '#fff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		text: "I Belong Here",
  			font: {
         		fontSize: 18
    		}
  	});
  	
	_save_btn.add(_save_txt);
	
	var _delete_btn = Titanium.UI.createView(
		 {
		  	width: 300,
		  	height: 60,
		  	top:10,
		  	left:10,
		  	layout: 'horizontal',
		  	borderRadius:4,
		  	backgroundColor:'#770000'
		 }
	);
	_view.add(_delete_btn);
	
	var _delete_txt = Ti.UI.createLabel({
		top:15,
		bottom:15,
  		width:280,
  		left:10,
  		right:10,
  		color: '#fff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		text: "No! I dont.",
  			font: {
         		fontSize: 18
    		}
  	});
  	
	_delete_btn.add(_delete_txt);
	
	_delete_btn.addEventListener('singletap',function(){
		_del(user,searchPlaceNav,main);
	});
	
	_save_btn.addEventListener('singletap',function(){
		_loadCode(_place);
	});

	main.open();	
}

function _del(user,searchPlaceNav,main){
	var dialog = Ti.UI.createAlertDialog({
    	cancel: -1,
    	buttonNames: ['Delete', 'Cancel'],
    	message: 'Are you sure?'
    });
    
    dialog.addEventListener('click', function(e){
      	Ti.API.debug('edit share dialog button clicked with index ' + e.index);
    	if (e.index === 0){
    		_deleteCode(user.getPlace());
			user.setPlace(null);
			searchPlaceNav.close(true,user);
			main.close();    		
    	}else{
    		//do nothing
    	}
    	
    });
    
    dialog.show();
}

function _deleteCode(_data){
	user.setDirty();
	var url = "http://flair.me/search.php";	
	var _data = {type:"role",pid:_data.pid,accessToken:login.getAccessToken(),action:"delete"};
 	 	
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	//do nothing
 	 },
 	 onerror: function(e){
 		 	//do nothing
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data);
	
}


function _loadCode(_data){
	user.setDirty();
	Ti.API.info("1" + _data);
	
	if(user.getPlace() === _data){
		 	 searchPlaceNav.close(false);
		     main.close();return;
	}
	
	Ti.API.info("2");
		
	var url = "http://flair.me/search.php";	
	var _data = {type:"role",pid:_data.pid,accessToken:login.getAccessToken()};
 	 	
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	Ti.API.info("3");
 	 	 var _response = JSON.parse(this.responseText);
 	 	 if(_response.status){
 	 	 	 user.setPlace(_response.place);
 	 	 	 searchPlaceNav.close(true,user);
		     main.close();
 	 	 }
 	 },
 	 onerror: function(e){
 	 	Ti.API.info("4");
 		 	Ti.API.error("User.load error " + e);
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 	
	
}




function _init(_data){
	main = Titanium.UI.createWindow({
    	title: 'New Access Code',    	
    	barColor:'#333',
    	backgroundColor: '#eee'    	
	});
		
	 _view = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 'auto',
		  	top:0,
		  	layout: 'horizontal'
	});
	main.add(_view);
	
	_build(_data);
}


function clear(_view){
	Ti.API.debug("clearing tableView with items = " + _view.children.length);
	for(var i=0;i<_view.children.length;i++){
			var c = _view.children[i];
			_view.remove(c);
	}
	Ti.API.debug("clearing done with items = " + _view.children.length);
}
