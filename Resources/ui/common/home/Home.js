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
    	barColor:'#000',  
    	backgroundColor: '#eee',
    	barImage: 'images/headerBg.jpg',
    	borderWidth:0
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
		  	height: 'auto',
		  	top:15,
		  	layout: 'horizontal'
		 }
	);

//Print Top Menu

	var nearbyWin = wall.init("nearby"); 
  	var friendsWin = wall.init("friends");  
  	var profileWin = profile.init(user.getId(),user.getName(),user.getPhoto());
  	
	var nearby = _createThumb({"id":"nearby","photo":""},'#eee');
		nearby.addEventListener('click',function(e){
			portal.open(nearbyWin);
		});
	var friends = _createThumb({"id":"friends","photo":""},'#ddd');
		friends.addEventListener('click',function(e){
			portal.open(friendsWin);
		});
	var me = _createThumb({"id":"me","photo":""},'#eee');
		me.addEventListener('click',function(e){
			portal.open(profileWin);
		});
		
	homeMenu.add(nearby);
	homeMenu.add(friends);
	homeMenu.add(me);
//Print Icons
	
	var row_2 = home_row(_createFlairThumb({"id":1,"photo":""},'#ddd'),
	_createFlairThumb({"id":2,"photo":""},'#eee'),
	_createFlairThumb({"id":3,"photo":""},'#ddd'),
	homeMenu,
	290
	);
	
	var row_3 = home_row(_createFlairThumb({"id":7,"photo":""},'#eee'),
	_createFlairThumb({"id":8,"photo":""},'#ddd'),
	_createFlairThumb({"id":9,"photo":""},'#eee'),
	row_2._container,
	192
	);
	
	var row_4 = home_row(_createFlairThumb({"id":4,"photo":""},'#ddd'),
	_createFlairThumb({"id":5,"photo":""},'#eee'),
	_createFlairThumb({"id":6,"photo":""},'#ddd'),
	row_3._container,
	94
	);
	
	row_3._container.add(Titanium.UI.createView(
		 {
		  	width: '290',
		  	height: '2',
		 }
	));

/*	homeMenu.add(_createFlairThumb({"id":7,"photo":""},'#eee'));
	homeMenu.add(_createFlairThumb({"id":8,"photo":""},'#ddd'));
	homeMenu.add(_createFlairThumb({"id":9,"photo":""},'#eee'));
	
	homeMenu.add(_createFlairThumb({"id":4,"photo":""},'#ddd'));
	homeMenu.add(_createFlairThumb({"id":5,"photo":""},'#eee'));
	homeMenu.add(_createFlairThumb({"id":6,"photo":""},'#ddd'));
*/	
	home.add(homeMenu);	
	
	main.add(home);
		
	return main;
}

function home_row(item1,item2,item3,parentScroll,_height){
	var homeMenu_one = Titanium.UI.createView(
		 {
		  	width: '290',
		  	height: 'auto',
		  	top:0,
		  	layout: 'horizontal'
		 }
	);	
	
	homeMenu_one.add(item1);
	homeMenu_one.add(item2);
	homeMenu_one.add(item3);
	
	var home_one = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 290,
  		top:0,
  		left:0,
  		height:_height,
  		_container: homeMenu_one
	});
	
	
	home_one.addEventListener("scrollEnd", function(){
		Ti.API.debug("scrollend");
		this.scrollTo(0,0);
	});
	
	home_one.add(homeMenu_one);
	
	parentScroll.add(home_one);
	
	return home_one;
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
	
	thumb.addEventListener('click',function(){
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
	
	