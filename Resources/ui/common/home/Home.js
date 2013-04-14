var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var wall = require('ui/common/wall/Wall');
var flairWin = require('ui/common/flair/Flair');
var profile = require('ui/common/userProfile/UserProfile');
var activeThumb;

exports.init = function() {
Ti.API.debug("home init");

  var user = login.getUser();
  activeThumb = null;
   var main = Titanium.UI.createWindow({
    	title: 'home',    	
    	titleImage: 'images/home/logo_small.png',
    	backgroundColor: '#fff',
    	borderWidth:0,
    	fullScreen: true
	});	
	

	var home = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 290,
  		top:0,
  		left:17.5,
  		height:398
	});
	
	home.addEventListener("scrollEnd",function(e){
		Ti.API.debug("scrollEnd");
		this.scrollTo(0,0);
	});
	
	var homeMenu = Titanium.UI.createView(
		 {
		  	width: '290',
		  	height: Ti.UI.SIZE,
		  	top:15,
		  	layout: 'horizontal'
		 }
	);

//Print Top Menu

	var nearbyWin = wall.init("nearby"); 
  	var friendsWin = wall.init("friends");  
  	//var profileWin = 
  	
	var nearby = _createThumb({"id":"nearby","photo":""},'#fff');
		nearby.addEventListener('singletap',function(e){
			portal.open(nearbyWin);
		});
	var friends = _createThumb({"id":"friends","photo":""},'#eee');
		friends.addEventListener('singletap',function(e){
			portal.open(nearbyWin);
		});
	var me = _createThumb({"id":"me","photo":""},'#fff');
		me.addEventListener('singletap',function(e){
			portal.open(profile.init(user.getId(),user.getName(),user.getPhoto()));
		});
		
	homeMenu.add(nearby);
	homeMenu.add(friends);
	homeMenu.add(me);

//Print Icons
	
	homeMenu.add(_createFlairThumb({"id":1,"photo":""},'#eee'));
	homeMenu.add(_createFlairThumb({"id":2,"photo":""},'#fff'));
	homeMenu.add(_createFlairThumb({"id":3,"photo":""},'#eee'));
	
	homeMenu.add(_createFlairThumb({"id":7,"photo":""},'#fff'));
	homeMenu.add(_createFlairThumb({"id":8,"photo":""},'#eee'));
	homeMenu.add(_createFlairThumb({"id":9,"photo":""},'#fff'));
	
	homeMenu.add(_createFlairThumb({"id":4,"photo":""},'#eee'));
	homeMenu.add(_createFlairThumb({"id":5,"photo":""},'#fff'));
    homeMenu.add(_createFlairThumb({"id":6,"photo":""},'#eee'));

	
	home.add(homeMenu);	
	
	main.add(home);
		
	return main;
}



function _tabBar(wall,home,profile){
	var tabBar = Titanium.UI.createView(
		 {
		  	height: 'auto',
		  	width: '100%',
		  	backgroundImage: 'images/headerBg.jpg',
		  	backgroundRepeat: true,
		  	bottom:0,
		  	layout:'horizontal'
		 }
	);
	
	var customSlider = Titanium.UI.createSlider({
        min:1,
        max:3,
        value:2,
        width:220,
        height:20,
        top:10,
        bottom:10,
        left:50,     
        leftTrackImage:'images/home/logo_small.png',
        rightTrackImage:'images/home/home_me_btn.png',
        thumbImage:'images/home/home_checkin_btn.png',
        highlightedThumbImage: 'images/home/logo_small.png',
        highlightedThumbImage: 'images/home/logo_small.png',
        _currentValue: 2,
        _currentWindow:home
    });
 
    customSlider.addEventListener('change',function(e)
    {
        if ( this.value >= 1 && this.value <= 1.5){
        	if(this._currentValue !== 1){
            	Ti.API.debug('slide to feed');
            	this.value = 1;
            	this._currentValue = 1;
            	this._currentWindow.hide();
            	this._currentWindow = wall;
            	this._currentWindow.show();
            }else{
            	this.value = 1;
            }
        }else{
            if (this.value >1.5 && this.value < 2.5){
            	if(this._currentValue !== 2){
                	Ti.API.debug('slide to home');
                	this.value = 2;
                	this._currentValue = 2;
                	this._currentWindow.hide();
            		this._currentWindow = home;
            		this._currentWindow.show();                	
               }else{
               		this.value = 2;
               }
            }else{
                if (this.value >2.5 ){
                	if(this._currentValue !== 3){
                    	Ti.API.debug('slide to me');
                    	this.value = 3;
                    	this._currentValue = 3;
                    	this._currentWindow.hide();
            			this._currentWindow = profile;
            			this._currentWindow.show();
                   }else{
                   		this.value = 3;
                   }
                }
            }
        }
    });

	tabBar.add(customSlider);
	
	return tabBar;
	
}

function _createPlaceBg(bgColor){
	var inner_bg =  Titanium.UI.createView(
		 {
		  	width: '85',
		  	height: '85',
		  	backgroundColor:bgColor,
		  	borderRadius:4,
		  	_bgColor:bgColor,bubbleParent:true
		 }
	);
	
	return inner_bg;
	
}

function _createInnerBg(_data,bgColor){
	
	
	var inner =  Titanium.UI.createView(
		 {
		  	width: 70,
		  	height: 70,
		  	backgroundImage:'images/flairs/100/' + _data.id + '.png'
		 }
	);
	
	var inner_bg =  Titanium.UI.createView(
		 {
		  	width: '85',
		  	height: '85',
		  	backgroundColor:bgColor,
		  	borderRadius:4,
		  	_bgColor:bgColor,
		  	_inner:inner
		 }
	);
	
	inner_bg.add(inner);
	
	return inner_bg;
	
}


function _createThumb(_data,bgColor){
	
	var _inner_bg = _createInnerBg(_data,bgColor);
	
	var outer =  Titanium.UI.createView(
		 {
		  	width: 100,
		  	height: 100,
		  	top:-2.5,
		  	bottom:-2.5,
		  	left:-2.5,
		  	right:-2.5,
		  	backgroundImage:'images/feed/feed_flair_shadow.png',		  	
		  	borderRadius: 4,
		   	_data: _data,
		   	_bgColor:bgColor,
		   	_inner_bg:_inner_bg
		 }
	);	
	
	outer.add(_inner_bg);
		
	return outer;
}


function _createFlairThumb(_data,bgColor){
	var thumb = _createThumb(_data,bgColor);
	
	thumb.addEventListener('singletap',function(){
		Ti.API.debug("Flair Icon Clicked " + _data.id);	
		activeThumb = thumb;
		
		//thumb._inner_bg._inner.animate({duration:500,opacity:0},function(){
		 flairWin.init(_data,thumb);
		// thumb.add(newBg);
		// newBg.animate({duration:500,view:_createInnerBg(thumb._data,thumb._bgColor),transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
		//});
		
		
	});	
	
	return thumb;
}
	
	