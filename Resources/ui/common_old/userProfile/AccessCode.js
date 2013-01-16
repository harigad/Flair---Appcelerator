var login = require('ui/common/Login');
var searchPlaceNav = require('ui/common/userProfile/SearchPlace');
var user = login.getUser();
var _view;
var main;
var _place;

exports.launch = function(_data,place){
	if(place){
		_place = place;
	}else{
		_place = null;	
	}
	if(!_view){
		_init(_data);
	}else{
		_build(_data);
	}	
}


function _build(_data){
	clear(_view);
	if(!_place){
		if(_data){
			_loadCode(_data);
		}
		return;
	}
	
	var _code_label_left = Ti.UI.createLabel({
		top:10,
		left:10,
		right:10,
		width:300,
  		color: '#666',  		
  		text: _place.name,
  			font: {
         		fontSize: 22
    		}
  	});
  	_view.add(_code_label_left);
  	
  	var _code_label_left = Ti.UI.createLabel({
		top:0,
		left:10,
		right:10,
		width:300,
  		color: '#666',  		
  		text: _place.vicinity,
  			font: {
         		fontSize: 14
    		}
  	});
  	_view.add(_code_label_left);
  
	var _code_label = Ti.UI.createLabel({
		top:10,
		left:10,
  		width:'auto',
  		color: '#999',
  		text: "Access Code : ",
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,	
  			font: {
         		fontSize: 22
    		}
  	});
	_view.add(_code_label);
	
	var _code_label = Ti.UI.createLabel({
		top:10,
  		width:'auto',
  		color: '#2179ca',
  		text: " " + _place.code,
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,	
  			font: {
         		fontSize: 22
    		}
  	});
	_view.add(_code_label);
	
	
	var _tip_label = Ti.UI.createLabel({
		top:10,
		left:10,
		right:10,
  		color: '#333',  		
  		text: "Dial 1-866-291-9993 from the landline @ the " + _place.name + "</b> and enter the above verification code.",
  			font: {
         		fontSize: 14
    		}
  	});
	_view.add(_tip_label);	
	
	
	var _save_btn = Titanium.UI.createView(
		 {
		  	width: 'auto',
		  	height: 'auto',
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
  		text: "SAVE",
  			font: {
         		fontSize: 18
    		}
  	});
	_save_btn.add(_save_txt);
	
	
	var _delete_btn = Titanium.UI.createView(
		 {
		  	width: 'auto',
		  	height: 'auto',
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
  		text: "DELETE",
  			font: {
         		fontSize: 18
    		}
  	});
	_delete_btn.add(_delete_txt);
	
	_delete_btn.addEventListener('click',function(){
		_deleteCode(user.getPlace());
		user.setPlace(null);
		searchPlaceNav.close(true);
		main.close();
	});
	
	_save_btn.addEventListener('click',function(){
		searchPlaceNav.close(true);
		main.close();
	});
	
	main.open();
	
}

function _deleteCode(_data){
	var url = "http://flair.me/search.php";	
	var _data = {type:"role",pid:_data.pid,accessToken:Ti.Facebook.getAccessToken(),action:"delete"};
 	 	
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
	var url = "http://flair.me/search.php";	
	var _data = {type:"role",pid:_data.pid,accessToken:Ti.Facebook.getAccessToken()};
 	 	
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	 var _response = JSON.parse(this.responseText);
 	 	 if(_response.status){
 	 	 	 user.setPlace(_response.place);
 	 	 	 _place = _response.place;
 	 		_build(); 	
 	 	 }
 	 },
 	 onerror: function(e){
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
