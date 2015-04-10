var user;
var main;
var _callBack;
var _errBack;
var fb = require('facebook');
	fb.appid = '201613399910723';
	fb.permissions = ['email'];
	fb.forceDialogAuth = true;

exports.init = function(callBack,errBack,dontShow){
	if(isLoggedIn()){
		callBack();
	}else if(_getAccessToken()){
		loadUser(callBack);
	}else{
		show(callBack,errBack,dontShow);
	}
	
};

exports.loggedIn = function(){
	return isLoggedIn();
};


function isLoggedIn(){
			if(user){
				return true;
			}else{
				return false;
			}
}

function _getAccessToken(){
	var FB_ACCESSTOKEN = Ti.App.Properties.getString("FB_ACCESSTOKEN");
	return FB_ACCESSTOKEN;
}

exports.logout = function(){
	fb.logout();
	Ti.App.Properties.setString("FB_ACCESSTOKEN", null);
	Ti.App.Properties.setString("login.user.id",null);
};

exports.getAccessToken = function(){
	return _getAccessToken();
};

exports.refresh = function(){
	loadUser(function(){
		
	});
};


function loadUser(_callBack){
	Ti.API.debug("login.loadUser");
	var User = require('ui/common/data/User');
	
	var userid = Ti.App.Properties.getString("login.user.id");
	
	if(!userid){
		userid = "me";
	}
	
       user = new User(userid,function(){
    	 Ti.App.Properties.setString("login.user.id",user.getId());
    	 	_callBack();
    	 	setTimeout(function(){
				Ti.App.fireEvent("userLoggedIn");
			},500);
    	});
}

function onLogin(e,_callBack){
	Ti.API.error("####################################" + fb.getAccessToken());
	Ti.App.Properties.setString("FB_ACCESSTOKEN", fb.getAccessToken());
	
	loadUser(function(){
		_callBack();
	});
	
}

var _fbsEventListener = false;
function show(callBack,errBack,_dontShow){
	if(_dontShow){
		if(errBack){
			errBack();
		}
		return;
	}
	
	if(!_fbsEventListener){
	_fbsEventListener = true;
	fb.addEventListener('login', function(e) {
		Ti.API.error("####################################" + fb.getAccessToken());
		if(fb.getAccessToken()){
    		onLogin(e,callBack);   
    	}else{
			//do nothing
    	}
	});
	}
	
    fb.authorize();
}

function showWindow(callBack,errBack,_dontShow){	
	if(fb.loggedIn){
		onLogin(null,callBack);
		return;
	}	
	
	if(_dontShow){
		if(errBack){
			errBack();
		}
		return;
	}
	
	 
    var slide_it_top = Titanium.UI.createAnimation();
    slide_it_top.top = 1; // to put it back to the left side of the window
    slide_it_top.duration = 400;
	
	if(main){
		main.open(slide_it_top);
	}else{
		build();
		main.open(slide_it_top);
	}

}

function build(){
	
	main = Ti.UI.createWindow({
		backgroundColor:"#40a3ff",
		top:600
	});
	
	var base = Ti.UI.createView({
		width:Ti.UI.FILL,height:Ti.UI.FILL,top:0
	});
	
	var cancel_bg = Ti.UI.createView({
		width:100,height:50,borderRadius:4,bottom:-25,
		backgroundImage:"images/trans.png",opacity:0.9
	});
	
	
	cancel_bg.addEventListener("click",function(){
			var slide_it_bottom = Titanium.UI.createAnimation();
    		slide_it_bottom.top = 600; // to put it back to the left side of the window
    		slide_it_bottom.duration = 400;
    		main.close(slide_it_bottom);
    		if(_errBack){
    			_errBack();
    		}
	});
	
	
	var lbl = Ti.UI.createLabel({
		text:"cancel",color:"#40a3ff",top:0
	});
	
	cancel_bg.add(lbl);
	
	var bg = Ti.UI.createImageView({
		image:"images/signup/bg1.png",
		width:204,height:222
	});
	main.add(base);
	
	base.add(bg);
		
	base.add(cancel_bg);

   
    bg.addEventListener('singletap',function(){
    	Ti.API.debug("login btn clicked");
        fb.authorize();
    });
  
}

exports.getUser = function(){
	if(user){
		return user;
	}else{
		var User = require('ui/common/data/User');
	    return new User(null,function(){},{});
	}
};

exports.setFeed = function(_flairs){
	Ti.API.info("login.setFeed");
	user.setFeed(_flairs);
};

function launchSignup(_callBack){
	var signup = require('ui/common/signup/Signup1');
	signup.init(_callBack);
}

