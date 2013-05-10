var view;
var user;
var grayV;
var photoView;
var main;
var placeViewTopLayer;
var upperView;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var pull_to_refresh = require('ui/common/components/PullToRefresh');
var userClass = "ui/common/data/User";


function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/like_hr.png',
		  	height:2,
		  	bottom:0,
		  	width:'320'
		 }
	);
}

exports.init = function(id,name,photo){
	var t = {x:0,y:60};
	
	var scroll = Ti.UI.createScrollView({width:Ti.UI.FILL,top:0});
	
	main = Titanium.UI.createView({top:0,width:Ti.UI.FILL,layout:'vertical',height:Ti.UI.SIZE});	
	
	main.userId = id;
	main.userName = name;
	
	pull_to_refresh.init(scroll,function(){
		main.user.setDirty();
		loadUser(id,main);
	});
	
	upperView = Titanium.UI.createView(
		 {
		  	left:10,right:10,
		  	height: Ti.UI.SIZE,
		  	top:10,
		  	layout: 'vertical',
		  	backgroundColor:'#fff',borderRadius:4
		 }
	);
	
	photoView = Ti.UI.createImageView({
			width:280,top:10,right:10,left:10,
			backgroundColor:'#f1f1f1',
			borderRadius:4,
			image:photo
	});

	upperView.add(photoView);
	
	main.add(upperView);
	main.userPhotoView = photoView;
	//clearView();	
	loadUser(id,main);
	scroll.add(main);
	return scroll;
}

function tabbedBar(){
	  
    var bar_container = Titanium.UI.createView(
		 {
		  	height:'40',width:'320',
		  	backgroundColor:'#999'
		  	
		 }
	);
	
	var _tabViews = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	width: Ti.UI.FILL
		 }
	);	
	
    var bar = Titanium.UI.iOS.createTabbedBar({
    labels:[{enabled:true,title:'cast'}, {enabled:true,title:'menu'}],
    backgroundColor:'#999',
    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
    height:30,
    width:280,
    _tabViews:_tabViews,
    index:0
    });
    bar_container.add(bar);
    
    bar.addEventListener('singletap',function(e){
    	if(e.index === 0){
    		this._tabViews._foodView.hide();
    		this._tabViews._castView.show();
     	}else{
    		this._tabViews._castView.hide();
    		this._tabViews._foodView.show();
    	}
    });

   return bar_container;
}


function loadUser(id,main){
	Ti.API.debug('loading user from server ' + id);
	var User = require('ui/common/data/User');

    	main.user = new User(id,function(userObj){
    		Ti.API.info("userProfile.loadUser");
    		user = userObj;
    		printDetails();
    	});
}

function clearView(){
	if(view){
		main.remove(view);
	}
	
	view = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: Ti.UI.SIZE,
		  	top:0,
		  	layout: 'vertical'
		 }
	);
	
	main.add(view);

	if(grayV){
		upperView.remove(grayV);
	}
	
	grayV = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: Ti.UI.SIZE,
		  	top:0,
		  	layout: 'vertical'
		 }
	);
	upperView.add(grayV);
	
}

exports.refresh = function(_user){
	Ti.API.debug("in refresh " + _user.getPlace());
	user = _user;
	printDetails(true);
}

function printDetails(){
	
	clearView();
	
	Ti.API.debug("UserProfile.printDetails");	
	
	var nameLabel = Ti.UI.createLabel({
  		left:10,top:5,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		color: '#333',
  		text: user.getName(),
  			font: {
         		fontSize:18,
         		fontWeight: 'bold'
    		}
  		});
  	
  	var nameView = Ti.UI.createView({height:Ti.UI.SIZE,layout:'horizontal'});
  	nameView.add(nameLabel);
  	
  	if(user.getRole()){
  	var roleLabel = Ti.UI.createLabel({
  		left:0,top:5,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		color: '#999',
  		text: " ",
  			font: {
         		fontSize:18
    		}
  		});   
  	 nameView.add(roleLabel);	
  	}	
  		
	grayV.add(nameView);
		
	if(user.getPlace() || user.isAdmin()){
		grayV.add(printPlace(user));	
	}
	
	if(user.getId()){
		var FeedView = require('ui/common/feed/FeedView');
		var feed = new FeedView(user.feed(),view);		
	}else{
		view.add(userHasNotClaimed());		
	}
	
}

function userHasNotClaimed(){
  	var container = Titanium.UI.createView(
		{ 
		  layout: 'horizontal',
		  left: 10,
		  right:10,
		  top:10
		  
		}
	);
	
  	return container;
}


function activation_code(user){

	var place = user.getPlace();
		
	var fRow_container = Ti.UI.createView({
		height:Ti.UI.SIZE,left:0,top:0,bottom:10,
		layout:'vertical'
	});
	
	var placeName = Ti.UI.createLabel({
  		left:10,right:10,top:0,width:280,
  		color: '#2179ca',
  		text: place.name,
  			font: {
         		fontSize: 14
    		}
  	});
  	
  	fRow_container.add(placeName);
	
	var roleName = Ti.UI.createLabel({
  		left:10,right:10,top:0,
  		color: '#333',
  		text: "Verification Code : " + place.code,
  			font: {
         		fontSize: 14
    		}
  	});
  	
  	fRow_container.add(roleName);
	
	var tip_container = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	left:0,	
		  	top:0,
		  	layout:'horizontal'
		 }
	);
	fRow_container.add(tip_container);
	
  	var tip_text = Ti.UI.createLabel({
  		left:10,right:10,
  		color: '#666',
  		text: "Please call 1-866-291-9993 from " + place.name + " and enter your verification code.",
  			font: {
         		fontSize: 14
    		}
  	}); 	
  	tip_container.add(tip_text);
  	
  		fRow_container.addEventListener('singletap',function(){
			var searchPlace= require('ui/common/userProfile/SearchPlace');
  			searchPlace.launch();
		});	
		
		return fRow_container;
		
}

function printPlace(user){
	var place = user.getPlace();
	
	var grayView = Titanium.UI.createView(
		{
		  left:0,right:0,top:-10,
		  height:Ti.UI.SIZE,
		  layout: 'horizontal',
		}
	);	
	
	var oscar = Ti.UI.createImageView({
  		image: 'images/profile/oscar_48.png',
  		left: 10,
  		right:10,
  		top:10,
  		bottom:10,width:30,height:50  		
	});	
	//grayView.add(oscar);	
	
	var fRow_container = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	left:10,right:10,	
		  	top:10,
		  	bottom:10,
		  	layout:'vertical'
		 }
	);
	if(place && !place.code){
	
	var placeName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#2179ca',  	
  		text: "@ " + place.name + ", " + place.city,
  			font: {
         		fontSize: 14
    		}
  	});  
  	var roleName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#eee',
  		text: "",
  			font: {
         		fontSize: 14
    		}
  	}); 
  	
  	var settingsView = Titanium.UI.createView(
		{ 
		  width:'auto',
		  height:Ti.UI.SIZE,
		  layout: 'horizontal',
		  left:0
		}
	);	
	
	if(user.getId() == login.getUser().getId()){
	var settingsText = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#2179ca',
  		text: "(change)",
  			font: {
         		fontSize: 14
    		}
  	}); 
 	settingsView.add(settingsText);
  	
  	settingsView.addEventListener('singletap',function(e){
  		var searchPlace= require('ui/common/userProfile/SearchPlace');
  		searchPlace.launch();
  	});	
  	
  	}
  	
  	placeName.addEventListener('singletap',function(){
  		var placeView = require('ui/common/place/Place');
		portal.open(placeView.init(place));
  	});
  	roleName.addEventListener('singletap',function(){
  		var placeView = require('ui/common/place/Place');
		portal.open(placeView.init(place));
  	});
  	   	
  	fRow_container.add(placeName);
  	//fRow_container.add(roleName);
  	fRow_container.add(settingsView);
  	
	}else if(place && place.code && user.isAdmin()){
		
	  return activation_code(user);
		
	}else if(!place && user.isAdmin()){
	
	var addName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#aaa',
  		text: "(add new)",
  			font: {
         		fontSize: 14
    		}
  	});  
  	var roleName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#2179ca',
  		text: "My Restaurant/Cafe",
  			font: {
         		fontSize: 14
    		}
  	});    	
  	
  	fRow_container.add(roleName);fRow_container.add(addName);
		
		fRow_container.addEventListener('singletap',function(){
			var searchPlace= require('ui/common/userProfile/SearchPlace');
  			searchPlace.launch();
		});	
		
	}	
		
	grayView.add(fRow_container);

	return grayView;	
}