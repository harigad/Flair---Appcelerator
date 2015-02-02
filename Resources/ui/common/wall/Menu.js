var _main;
var _view;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');

exports.init = function(){
	_main = Ti.UI.createWindow({
		backgroundColor:"#40a3ff"
	});	
	_view = Ti.UI.createView({
		width:250,
		backgroundColor:"#40a3ff",
		right:0,
		height:Ti.UI.FILL,
		layout:"vertical"
	});
	
	_main.add(_view);
	_draw();
	_main.open();
};

function _draw(){
	var user = login.getUser();
	_view.add(Ti.UI.createView({height:62}));
	_view.add(item({icon:"images/checkin/white_btn.png",title:"my flairs",callBack:function(){
		login.init(function(){
			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(user.getId(),user.getName(),user.getPhotoBig(),user.getPhoto()));
		});
	}}));
	_view.add(_hr());
	var places = user.getPlaces();
	for(var i=0;i< places.length; i++){
		_view.add(item({icon:"images/checkin/white_btn.png",title:places[i].placename,callBack:function(placedata){
			var placeView = require('ui/common/place/Place');
		    portal.open(placeView.init(placedata));
		},data:places[i]}));
		_view.add(_hr());
	}
	_view.add(item({icon:"images/plus.png",title:"add my Business",callBack:function(){
		searchBus();
	}}));
}

function searchBus(){
   var Search = require('ui/common/search/Search');
   Search.open(function(_data){
					addBus(_data);
   });
}

function addBus(bus){
	var new_bus = require('ui/common/userProfile/AccessCode');
	new_bus.init(bus);
}

function item(data){
	var main = Ti.UI.createView({layout:"horizontal",height:Ti.UI.SIZE,left:10,right:10});
	//if(data.icon){
		var icon = Ti.UI.createImageView({
			image:data.icon,width:50,height:50,
			right:10,borderRadius:25,
			top:10,bottom:10
		});
		main.add(icon);
	//}
	
		var title = Ti.UI.createLabel({
			text:data.title,height:Ti.UI.SIZE,
			color:"#fff"
		});
		main.add(title);
	
    	main.addEventListener("click",function(){
    		portal.toggleMenu(function(){
    			data.callBack(data.data);
    		});
    	});
    return main;
}

exports.open = function(){
	_main.open();
};

exports.refresh = function(){
	
};

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/like_hr.png',
		  	height:2,opacity:0.6,
		  	bottom:0,top:0,
		  	width:Ti.UI.FILL
		 }
	);
}
