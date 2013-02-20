var portal = require('ui/common/Portal');
var login = require('ui/common/Login');

exports.home = function() {
Ti.API.debug("home init");
   var home = Titanium.UI.createWindow({
    	title: name,    	
    	barColor:'#333',
    	backgroundColor: '#eee'  	
	});
	
	var scrollView = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 320,
  		top: 60
  		});	
	
	var FeedView = require('ui/common/feed/FeedView');
	var feed = new FeedView(login.getUser());
	
	scrollView.add(feed);
	home.add(scrollView);
	home.add(homeMenu());
	
	return home;
}

function loadData(){
	
	
	
	
}

function loadFriends(){
	

	
}

function homeMenu(){
	var homeMenu = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 63,
		  	top:0,
		  	left:0,
		 	backgroundImage: "images/home/home_btn_bg.png",
		 	backgroundRepeat: true
		 }
	);
	
	var checkIn = Ti.UI.createImageView({
  		image: "images/home/home_checkin_btn.png",
  		width: 100,
  		height: 50,
  		left: 10,
  		top: 0
	});		

	homeMenu.add(checkIn);
	
	var upload = Ti.UI.createImageView({
  		image: "images/home/home_upload_btn.png",
  		width: 100,
  		height: 50,
  		top: 0
	});		
	homeMenu.add(upload);
	
	var me = Ti.UI.createImageView({
  		image: "images/home/home_me_btn.png",
  		width: 100,
  		height: 50,
  		right: 10,
  		top: 0
	});		
	homeMenu.add(me);
	
	checkIn.addEventListener("touchstart",function(p,s){this.setOpacity(0.5);});	
	checkIn.addEventListener("touchend",function(p,s){this.setOpacity(1);});
	upload.addEventListener("touchstart",function(p,s){this.setOpacity(0.5);});	
	upload.addEventListener("touchend",function(p,s){this.setOpacity(1);});	
	me.addEventListener("touchstart",function(p,s){this.setOpacity(0.5);});	
	me.addEventListener("touchend",function(p,s){this.setOpacity(1);});
	
	checkIn.addEventListener('singletap',function(p,s){
		var win = require('ui/common/checkin/Checkin');
		win.init();		
	});
	
	me.addEventListener('singletap',function(p,s){
		var Login = require('ui/common/Login');
			var user = Login.getUser(); 
		var win = require('ui/common/userProfile/UserProfile');
		portal.open(win.init(user.getId(),user.getName(),user.getPhotoBig()));		
	});
	
	return homeMenu;
}
