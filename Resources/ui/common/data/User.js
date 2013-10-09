
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');

function User(id,_callBack,_data){
	Ti.API.debug("User.init " + id);
	this.id = id;
	
	if(!_data){
		_data = portal.getUserData(this.id);
	}
	
	if(_data){
		var that = this;
		this._data = _data;		
 	 	this.id = this._data.id; 
 	 	setTimeout(function(){
					_callBack(that);
		}, 10 );
	}else{		
		this.load(_callBack);
	}
	
	return this;
}

User.prototype.load = function(_callBack){
	Ti.API.debug("User.load " + this.id);
	var that = this;
		
	var url = "http://flair.me/search.php";	
	var _data = {type:"user",id:this.id,accessToken:login.getAccessToken()};
		
	Ti.API.debug("User.load sending data " + _data);
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	Ti.API.debug("User.load recieved data " + this.responseText);
 	 	 var response = JSON.parse(this.responseText);
         if(response.status){
 	 		that._data = response;	
 	 		that.id = that._data.id; 
 	 		portal.setUserData(that.id,response);
 	 	 }
 	 	 	_callBack(that);
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

User.prototype.getId = function(){
	return this.id;
}

User.prototype.setPlace = function(_place){
	this._data.place = _place;
}

User.prototype.getPlace = function(){
	if(this._data.place){
		return this._data.place;
	}else{
		return false;
	}
}

User.prototype.getRole = function(){
	if(this._data.place){
		return this._data.place.role;
	}else{
		return false;
	}
}


User.prototype.setData = function(data){
	this._data = data;
}


User.prototype.getName = function(){
	return this._data.name;
}

User.prototype.getPhoto = function(){
	return this._data.photo;
}

User.prototype.getPhotoBig = function(){
	return this._data.photo_big;
}

User.prototype.setFeed = function(_feed){
	Ti.API.info("user.setFeed " + _feed.length);
	this._data.feed = _feed;
	portal.setUserData(this.id,this._data);
}

User.prototype.isInvited = function(){
	return this._data.invited;
}

User.prototype.feed = function(){
	return this._data.feed;
}

User.prototype.isAdmin = function(){	
   var Login = require('ui/common/Login');
   var user = Login.getUser();
   if(user.getId() == this.getId()){
   	return true;
   }else{
   	return false;
   }
}

User.prototype.loadFriends = function(){
	var that = this;
	Ti.Facebook.requestWithGraphPath('me/friends', {fields: 'first_name,last_name,id,photo'}, 'GET', function(e) {
    	if(e.success){
    		Ti.API.debug('friends loaded');
        	var d = JSON.parse(e.result);
        	var rows = d.data;
        	that.friends = rows;
    	}
	});	
	
		var url = "http://flair.me/search.php";
		var _data = {type:"friends",accessToken:login.getAccessToken()};
	
 	var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         var response = JSON.parse(this.responseText);
         that.friendsUsing = response.cars;
         that.friendsUsingString = response.friendsStr;
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 
		
}

User.prototype.getAllFriends = function(){
	return this.friends;
	
}

User.prototype.getUserFriends = function(){
	return this.friendsUsing;	
}

User.prototype.setDirty = function(){
    portal.setDirty(this.getId());
}

module.exports = User;
