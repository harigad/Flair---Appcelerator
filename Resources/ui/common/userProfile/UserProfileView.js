var view;
var user;
var grayV;
var photoView;
var main;
var placeViewTopLayer;
var upperView;
var click_to_refresh;
var loadTimeout;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var pull_to_refresh = require('ui/common/components/PullToRefresh');
var userClass = "ui/common/data/User";
var _imageHeight = 200;
function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: '/images/feed/like_hr.png',
		  	height:2,
		  	bottom:0,
		  	width:'320'
		 }
	);
}
var _aboutLabel;
exports.init = function(id,name,photo_big,photo,icon,_callBack){

	if(icon && icon !== 0 && icon !== "0"){
		//icon =icon;
	}else{
		icon = "1";
	}


	photo = photo || "/images/flairs/100/" + icon + ".png";
	
	
	main = Titanium.UI.createTableView({top:0,separatorStyle:Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,backgroundColor:'transparent'});	
	main.userId = id;
	main.userName = name;
	
	main.addEventListener("scroll",function(e){
		if(e.contentOffset.y > (_imageHeight - 60)){
		  _callBack(true);	
		}else{
		  _callBack(false);
		}
	});
	
	var upperView = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,layout:"vertical"
		 }
	);
	
	var photoViewOuter = Ti.UI.createView({
		width:60,height:60,top:10,
		backgroundColor:"#fff",
		borderRadius:30
	});
	
	photoView = Ti.UI.createImageView({
			width:50,height:50,borderRadius:25,
			image:photo
	});
	
	photoViewOuter.add(photoView);
	upperView.add(photoViewOuter);
	
	var title = Ti.UI.createLabel({
  		top:5,bottom:0,textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		text: name,
  			font: {
         		fontSize:30,
    	},
    	color: '#fff'
  		});
  	upperView.add(title);
  	
  	
	_aboutLabel = Ti.UI.createLabel({
		height:Ti.UI.SIZE,left:20,right:20,text:"",
		color:"#fff",textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				font:{
				fontSize:14
			}
	});
	upperView.add(_aboutLabel);
	
	
	var rowOne = Ti.UI.createTableViewRow({height:Ti.UI.SIZE});
	var photo_big = Ti.UI.createImageView({opacity:0,image:photo_big,width:Ti.UI.FILL});
	
	
	var adjust_header_color = function(e){
		if(photo_big.rect.height>200){
			_imageHeight = photo_big.rect.height;
			photo_big.removeEventListener("postlayout",adjust_header_color);
		}
	};
	
	photo_big.addEventListener("postlayout",adjust_header_color);
	
	var bottomMenu = Ti.UI.createView({opacity:0.6,backgroundColor:"#fff",bottom:0,height:50});
  	photo_big.add(bottomMenu);
	rowOne.add(photo_big);
	rowOne.add(upperView);

/* 	
	var nameLabel = Ti.UI.createLabel({
  		left:0,top:5,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		color: '#333',
  		text: name,
  			font: {
         		fontSize:18,
         		fontWeight: 'bold'
    		}
  		});
  	
  	
	var se = Ti.UI.createView({height:1,width:Ti.UI.FILL,backgroundColor:"#fff"});

	upperView.add(photoView);
	upperView.add(se);
*/	

 		
	loadUser(id,main);
	
	main.setData([rowOne]);
	return main;
};

function loadUser(id){
	Ti.API.debug("User.load " + id);
	/*if(loadTimeout){
		clearTimeout(loadTimeout);
		loadTimeout = null;
	}
	loadTimeout = setTimeout(function(){
    		_retry(id);
    },3000);*/
	
	var that = this;
		
	var url = "http://services.flair.me/search.php";	
	var _data = {type:"user",id:id,accessToken:login.getAccessToken()};
		
	Ti.API.debug("User.load sending data -> " + this.id);
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	Ti.API.debug("User.load recieved data " + this.responseText);
 	 	 var response = JSON.parse(this.responseText);
         if(response){
         	if(click_to_refresh){
				main.remove(click_to_refresh);
				click_to_refresh = null;
			}
			if(loadTimeout){
				clearTimeout(loadTimeout);
				loadTimeout = null;
			}
         	
         	var User = require('ui/common/data/User');
         	user = new User(id,function(){
         		//do nothing
         	},response);
         	main.user = user;
         	printDetails(response);
 	 	 }	
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

function clearView(){
	
}

exports.refresh = function(_user){
	Ti.API.debug("in refresh " + _user.getPlace());
	user = _user;
	printDetails();
};

function printDetails(userData){
	//return;
	//clearView();
	//view.remove(click_to_refresh);

var aboutRow = Ti.UI.createTableViewRow({selectedBackgroundColor:"#333",height:Ti.UI.SIZE});
var aboutRowInner = Ti.UI.createView({layout:"vertical",height:Ti.UI.SIZE});
aboutRow.add(aboutRowInner);

var about = userData.about;
if(about){
_aboutLabel.setText(about);
}

var places = userData.places || [];

for(var i=0;i<places.length;i++){
	if(places[i].approved){
	var placesView = Ti.UI.createView({place:places[i],backgroundColor:"#333",top:0.5,layout:"horizontal",height:Ti.UI.SIZE,left:0,right:0});
	var leftLabel = Ti.UI.createLabel({place:places[i],
		text: places[i].role || "Teammate",top:10,bottom:10,left:20,right:5,
		height:20,color:"#fff",
		width:Ti.UI.SIZE,font:{
			fontSize:14
		}
	});
	var rightLabel = Ti.UI.createLabel({place:places[i],
		text:"@" + places[i].name,top:10,bottom:10,left:0,
		height:20,color:"#ff004e",
		width:Ti.UI.SIZE,font:{
			fontSize:14
		}
	});
	placesView.add(leftLabel);placesView.add(rightLabel);
	
	placesView.addEventListener("click",function(e){
		   var placeView = require('ui/common/place/Place');
		   portal.open(placeView.init(e.source.place));
	});
	
	aboutRowInner.add(placesView);
	}
}



if(places.length > 0){
	main.appendRow(aboutRow);
}
	
	Ti.API.debug("UserProfile.printDetails");	
	var FeedView = require('ui/common/feed/FeedView');
	var feed = new FeedView(user.feed(),main,{'uid':userData.id},"user",user.getId());

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


function _noData(){
	var h = Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE,top:80,layout:"horizontal"});
	
	 h.add(Ti.UI.createLabel({width:Ti.UI.SIZE,height:Ti.UI.SIZE,
			text:' not',
			color:"#aaa",
			shadowColor: '#fff',
    		shadowOffset: {x:1, y:1},
    		shadowRadius: 3,
  			font: {
         		fontSize: 20
    		}}));
    
    h.add(Ti.UI.createView({left:-5,right:5,width:25,height:25,backgroundImage:"/images/glasses_blue_40_40.png"}));
    		
	h.add(Ti.UI.createLabel({width:Ti.UI.SIZE,height:Ti.UI.SIZE,
			text:"Flairs to show",
			color:"#aaa",
			shadowColor: '#fff',
    		shadowOffset: {x:1, y:1},
    		shadowRadius: 3,
  			font: {
         		fontSize: 20
    		}}));
    		
    		
    		h.addEventListener("click",function(){
    			launchFlair();
    		});
    		return h;
}

function _retry(data){
	if(click_to_refresh){
		view.remove(click_to_refresh);
		click_to_refresh = null;
	}
	var retry = Ti.UI.createLabel({text:"searching...please wait..",color:"#cecece",font:{fontSize:24}});
    var network_error = Ti.UI.createLabel({text:" ",color:"#cecece",font:{fontSize:18}});
    click_to_refresh = Ti.UI.createView({layout:"vertical",top:80});
    	click_to_refresh.add(network_error);
    	click_to_refresh.add(retry);
    	network_error.setText("network error");
    	retry.setText("RETRY");
    	main.add(click_to_refresh);
    
    click_to_refresh.addEventListener("singletap",function(e){
    	loadUser(data);
    	main.remove(click_to_refresh);
    });
}