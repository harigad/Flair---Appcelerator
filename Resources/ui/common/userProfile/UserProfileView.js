var view;
var user;
var grayV;
var photoView;
var main;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');

exports.init = function(id,name,photo){
	var t = {x:0,y:60};
	
	main = Titanium.UI.createTableView(
				{
		  			width: '320',
		  			backgroundColor:'#eee',separatorStyle:"NONE"
				});	
	
	main.userId = id;
	main.userName = name;
		
	view = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: Ti.UI.SIZE,
		  	top:0,
		  	layout: 'vertical'
		 }
	);
	
	var loading_image = Ti.UI.createImageView({
  		image: 'images/loading_white.gif',
  		width: '50',
  		top: 0
	});
	//scrollView.add(loading_image);
	
	photoView = Ti.UI.createImageView({
  		image: photo,
  		width:320,height:200,
  		top:0,backgroundColor:'#000'
	});
	view.add(photoView);

	var viewRow = Titanium.UI.createTableViewRow({height:Ti.UI.SIZE});
        viewRow.add(view);
	main.appendRow(viewRow);
	
	main.contentScreen = view;
	main.userPhotoView = photoView;
	//clearView();	
	loadUser(id,main);
	return main;
}



function loadUser(id,main){
	Ti.API.debug('loading user from server ' + id);
	var User = require('ui/common/data/User');

	if(id == login.getUser().getId()){
		main.user = login.getUser();
		user = main.user;
    	printDetails();
	}else{
    	main.user = new User(id,function(userObj){
    		Ti.API.info("userProfile.loadUser");
    		user = userObj;
    		printDetails();
    	});
   }
}

function clearView(hideLoading){
	return;
	for(var i=1;i<view.children.length;i++){
		var v = view.children[i];
		view.remove(v);
	}
	
	if(hideLoading!==true){
			var loading = Ti.UI.createImageView({
  			image: 'images/loading_white.gif',
  			width: '150',
  			top: 20	
		});	
	view.add(loading);
	}
}

exports.refresh = function(){
	Ti.API.debug("in refresh");
	printDetails(true);
}

function printDetails(_refresh){
	Ti.API.debug("UserProfile.printDetails");	
	photoView.setImage(user.getPhotoBig());
	
	clearView(true);
		
	if(user.getPlace() || user.isAdmin()){
		grayV = printPlace(user);	
		view.add(grayV);
	}
	
	if(user.getId()){
		var FeedView = require('ui/common/feed/FeedView');
		var feed = new FeedView(user.feed(),main);		
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


function printPlace(user){
	var place = user.getPlace();
	
	var grayView = Titanium.UI.createView(
		{ backgroundColor:'#333',
		  width:'100%',
		  height:Ti.UI.SIZE,
		  layout: 'horizontal'
		}
	);	
	
	var oscar = Ti.UI.createImageView({
  		image: 'images/profile/oscar_48.png',
  		left: 10,
  		right:10,
  		top:10,
  		bottom:10,width:30,height:50  		
	});	
	grayView.add(oscar);	
	
	var fRow_container = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	width:250,
		  	left:0,	
		  	top:10,
		  	bottom:10,
		  	layout:'vertical'
		 }
	);
	if(place && !place.code){
	
	var placeName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#eee',  	
  		text: place.role,
  			font: {
         		fontSize: 16
    		}
  	});  
  	var roleName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#2179ca',
  		shadowColor: '#aaa',
  		shadowOffset: {x:1, y:1},
  		text: place.name,
  			font: {
         		fontSize: 25
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
	
	var settingsImage = Ti.UI.createImageView({
  		image: 'images/profile/settings2.png',
  		left: 0,
  		right:5,
  		height:25
	});
	
	var settingsText = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#2179ca',
  		text: "(edit)",
  			font: {
         		fontSize: 14
    		}
  	}); 
  	
  	settingsView.add(settingsImage);
  	settingsView.add(settingsText);
  	
  	settingsView.addEventListener('click',function(e){
  		var editRole = require('ui/common/userProfile/EditRole');
  		portal.open(editRole.init());
  	});	
  	
  	}
  	
  	placeName.addEventListener('click',function(){
  		var placeView = require('ui/common/place/Place');
		portal.open(placeView.init(place));
  	});
  	roleName.addEventListener('click',function(){
  		var placeView = require('ui/common/place/Place');
		portal.open(placeView.init(place));
  	});
  	   	
  	fRow_container.add(placeName);
  	fRow_container.add(roleName);
  	fRow_container.add(settingsView);
  	
	}else if(place && place.code){
	var addName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#eee',
  		wordWrap: false,
  		text: place.name + " - " + place.vicinity,
  			font: {
         		fontSize: 14
    		}
  	});  
  	var roleName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#2179ca',
  		text: "Activation Code : " + place.code,
  			font: {
         		fontSize: 18
    		}
  	});
  	fRow_container.add(roleName);
	fRow_container.add(addName);
	
	
	var tip_container = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	width:250,
		  	left:0,	
		  	top:0,
		  	layout:'horizontal'
		 }
	);
	fRow_container.add(tip_container);
	
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "Dial ",
  			font: {
         		fontSize: 14
    		}
  	}); 	
  	tip_container.add(tip_text);
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "1-866-291-9993",
  			font: {
         		fontSize: 14,
         		fontWeight: 'bold'
    		}
  	});
  	tip_container.add(tip_text);
  	
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "from the",
  			font: {
         		fontSize: 14
    		}
  	});
  	tip_container.add(tip_text);
  	
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "landline",
  			font: {
         		fontSize: 14,
         		fontWeight: 'bold'
    		}
  	});
  	tip_container.add(tip_text);
  	
  	
  	
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "@ the",
  			font: {
         		fontSize: 14,
    		}
  	});
  	tip_container.add(tip_text);
  	
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: place.name,
  			font: {
         		fontSize: 14,
         		fontWeight: 'bold'
       	}
  	});
  	tip_container.add(tip_text);
  	
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "and enter",
  			font: {
         		fontSize: 14,
    		}
  	});
  	tip_container.add(tip_text);
  	
  	var tip_text = Ti.UI.createLabel({
  		right:5,
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "the above",
  			font: {
         		fontSize: 14,
    		}
  	});
  	tip_container.add(tip_text);
  	
  	var tip_text = Ti.UI.createLabel({
  		top:3,
  		width:'auto',
  		color: '#eee',
  		text: "verification code.",
  			font: {
         		fontSize: 14,
    		}
  	});
  	tip_container.add(tip_text);
  	
		fRow_container.addEventListener("click",function(){
			var searchPlace= require('ui/common/userProfile/SearchPlace');
  			searchPlace.launch();
		});	
		
		
		
	}else if(!place && user.isAdmin()){
	
	var addName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#eee',
  		text: "ADD NEW",
  			font: {
         		fontSize: 16
    		}
  	});  
  	var roleName = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#2179ca',
  		text: "Restaurant/Cafe",
  			font: {
         		fontSize: 25
    		}
  	});    	
  	fRow_container.add(addName);
  	fRow_container.add(roleName);
		
		fRow_container.addEventListener("click",function(){
			var searchPlace= require('ui/common/userProfile/SearchPlace');
  			searchPlace.launch();
		});	
		
	}	
		
	grayView.add(fRow_container);

	return grayView;	
}