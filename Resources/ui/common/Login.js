var user;
var main;
var fb = require('facebook');

exports.init = function(_callBack){

	fb.appid = '201613399910723';
	fb.permissions = ['publish_stream'];
	fb.forceDialogAuth = true;
	 
	if(isLoggedIn()){
	//	if(user){			
			_callBack();
		///}else{
	//		launchSignup(_callBack);
//		}
	}else{
		show(_callBack);
	}
	
}

function isLoggedIn(){
		if(fb.loggedIn){
			if(user){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}	
}

exports.getAccessToken = function(){
	return fb.getAccessToken();
}

function loadUser(_callBack){
	Ti.API.debug("login.loadUser");
	var User = require('ui/common/data/User');
	
	var userid = Ti.App.Properties.getString("login.user.id");
	
	if(!userid){
		var db = require("ui/common/data/DB");
		db.load();
		userid = "me";
	}
	
       user = new User(userid,function(){
    	 Ti.App.Properties.setString("login.user.id",user.getId());
    	 if(user.isInvited()){
    	 	_callBack();
    	 }else{
    	     var newWin = Ti.UI.createWindow({
    	     	backgroundImage:'images/signup/notify.png'
    	     });
    	     newWin.open();
    	 }
    	});
}

function onLogin(e,_callBack){
	loadUser(function(){
	
		var login = require('ui/common/Login');	
		login.init(_callBack);
		if(main){
			main.close();
		}
	});
	
}	

function show(_callBack){	
	if(fb.loggedIn){
		onLogin(null,_callBack);
		return;
	}	
	
	main = Ti.UI.createWindow({
		backgroundColor:"#990000",
		backgroundImage:'images/signup/bg1.png'
	});

	fb.addEventListener('login', function(e) {
    	onLogin(e,_callBack);    	
	});
     
    var btn = Ti.UI.createView({
    	left:10,top:190,
    	width:300,height:80,
    	borderRadius:4
    });
    
    main.add(btn);
    
    btn.addEventListener('singletap',function(){
    	Ti.API.debug("login btn clicked");
        fb.authorize();
    });
    
    main.open();
}

exports.getUser = function(){
	return user;
}

exports.setFeed = function(_flairs){
	Ti.API.info("login.setFeed");
	user.setFeed(_flairs);
}

function launchSignup(_callBack){
	var signup = require('ui/common/signup/Signup1');
	signup.init(_callBack);
}

