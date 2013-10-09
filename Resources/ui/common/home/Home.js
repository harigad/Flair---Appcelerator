var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var wall = require('ui/common/wall/Wall');
var newHires = require('ui/common/wall/NewHires');
var flairWin = require('ui/common/flair/Flair');
var profile = require('ui/common/userProfile/UserProfile');
var activeThumb;
var _callBack;
var main;
exports.init = function(callBack,person_name) {

	login.init(function(){
		init_process(callBack,person_name);
	});
	
}	
	
function init_process(callBack,person_name){	
Ti.API.debug("home init");

  _callBack = callBack;

  var user = login.getUser();
  activeThumb = null;
    main = Titanium.UI.createWindow({
    	title: 'home',
    	barColor: '#fff',   	
		navBarHidden: true,
    	borderWidth:0,
    	backgroundImage:'images/trans.png',
    	fullScreen: true,top:500
	});	

	var container = Titanium.UI.createView({
		height: Ti.UI.FILL,
		width:Ti.UI.FILL,
		top:85,backgroundColor:'#eee',
	});

	var homeMenu = Titanium.UI.createView(
		 {
		  	width: '290',left:17.5,
		  	layout: 'horizontal'
		 }
	);

	var header = Titanium.UI.createView({
		top:0,	height: Ti.UI.SIZE,
		width:Ti.UI.FILL,layout:'vertical'
	});
	
	var lbl = Ti.UI.createLabel({
		color: '#666',textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		width:Ti.UI.FILL,height: Ti.UI.SIZE,top:0,
		 font: { fontSize:16 },
		text: 'Pick a Flair for'
	});
	
	header.add(lbl);		
	
	var lbl_name = Ti.UI.createLabel({
		color: '#333',textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		width:Ti.UI.FILL,height: Ti.UI.SIZE,bottom:10,
		font: { fontSize:36 },
		text: person_name
	});
	header.add(lbl_name);

  homeMenu.add(header);

	//Print Top Menu
	var nearbyWin;
  	var friendsWin;
	var userWin;
  	// = wall.init("nearby"); 
  	//var profileWin = 
  	
	var nearby = _createThumb({"id":"nearby","photo":""},'#fff');
		nearby.addEventListener('singletap',function(e){
			if(!nearbyWin){
				nearbyWin = newHires.init(); 
			}
			portal.open(nearbyWin);
		});
		
	var friends = _createThumb({"id":"friends","photo":""},'#eee');
		friends.addEventListener('singletap',function(e){
			if(!friendsWin){
				friendsWin = wall.init("nearby"); 
			}
			portal.open(friendsWin);
		});
		 			
	var me = _createThumb({"id":"me","photo":""},'#fff');
		me.addEventListener('singletap',function(e){
			//if(!userWin){
				userWin = profile.init(user.getId(),user.getName(),user.getPhotoBig());
			//}
			portal.open(userWin);
		});
		
	//homeMenu.add(nearby);
	//homeMenu.add(friends);
	//homeMenu.add(me);

//Print Icons
	
	homeMenu.add(_createFlairThumb({"id":1,"photo":""},'#f1f1f1'));
	homeMenu.add(_createFlairThumb({"id":2,"photo":""},'#fff'));
	homeMenu.add(_createFlairThumb({"id":3,"photo":""},'#f1f1f1'));
	
	homeMenu.add(_createFlairThumb({"id":7,"photo":""},'#fff'));
	homeMenu.add(_createFlairThumb({"id":8,"photo":""},'#f1f1f1'));
	homeMenu.add(_createFlairThumb({"id":9,"photo":""},'#fff'));
	
	homeMenu.add(_createFlairThumb({"id":4,"photo":""},'#f1f1f1'));
	homeMenu.add(_createFlairThumb({"id":5,"photo":""},'#fff'));
    homeMenu.add(_createFlairThumb({"id":6,"photo":""},'#f1f1f1'));

	
	//home.add(homeMenu);	
	container.add(homeMenu);
	main.add(container);
	var slide_it_top = Titanium.UI.createAnimation();
    slide_it_top.top = 0; // to put it back to the left side of the window
    slide_it_top.duration = 300;
	main.open(slide_it_top);	
	//main.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
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
		_callBack(_data,main);
		thumb._inner_bg._inner.setBackgroundImage("");
		var inner = Ti.UI.createLabel({
			height:'auto',
			width: 70,
  			text:"saving...",
  			color:"#666",
  			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  			font: {
         		fontSize: 13
    		}  				
		});	
		thumb._inner_bg._inner.add(inner);
		//thumb._inner_bg._inner.animate({duration:500,opacity:0},function(){
		// flairWin.init(_data,thumb);
		// thumb.add(newBg);
		// newBg.animate({duration:500,view:_createInnerBg(thumb._data,thumb._bgColor),transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
		//});
		
		
	});	
	
	return thumb;
}
	
	