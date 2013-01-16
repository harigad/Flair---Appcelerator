var user;
var main;
exports.init = function(_callBack){
	
	if(isLoggedIn()){
		if(user){			
			_callBack();
		}else{
			launchSignup(_callBack);
		}
	}else{
		show(_callBack);
	}
	
}

function isLoggedIn(){
		if(Ti.Facebook.getLoggedIn()){
			if(user){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}	
}

function loadUser(_callBack){
	Ti.API.debug("login.loadUser");
	var User = require('ui/common/data/User');
    user = new User("me",function(){
    	user.loadFriends();
    	_callBack();    	
    	});
}

function onLogin(e,_callBack){
	Ti.API.debug("login sucessful");
	
	var props = Ti.App.Properties.listProperties();
	for (var i=0,ilen=props.length; i<ilen; i++){
    	Ti.App.Properties.removeProperty(props[i]);
	}
	
	loadUser(function(){	
		Ti.API.debug("user load successful");
		
		var db = require('ui/common/data/DB');
		db.open();
		db.load();
		
		var login = require('ui/common/Login');	
		login.init(_callBack);
		main.close();		
	});
}	

function show(_callBack){	

	if(Ti.Facebook.getLoggedIn()){
		onLogin(_callBack);
		return;
	}	
	
	main = Ti.UI.createWindow({
		backgroundImage:'images/signup/bg.png'
	});

	Ti.Facebook.addEventListener('login', function(e) {
    	onLogin(e,_callBack);    	
	});

	Ti.Facebook.addEventListener('logout', function(e) {
    	alert('Logged out');
	});    
    
	var btn = Ti.Facebook.createLoginButton({
    top : 250,
    style : Ti.Facebook.BUTTON_STYLE_NORMAL
    });
    
    main.add(btn);
    main.open();
}

exports.getUser = function(){
	return user;
}


function launchSignup(_callBack){
	var signup = require('ui/common/signup/Signup1');
	signup.init(_callBack);
}

