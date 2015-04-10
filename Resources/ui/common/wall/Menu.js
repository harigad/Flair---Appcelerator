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
	
	
	Ti.App.addEventListener("userLoggedIn",function(){
		_view.removeAllChildren();
		_draw();
	});
	
	
};

function _draw(){
	var user = login.getUser();
	_view.add(Ti.UI.createView({height:62}));
	_view.add(item({approved:-1,icon:"images/menu_me_icon.png",title:"My flairs",callBack:function(){
		login.init(function(){
			user = login.getUser();
			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(user.getId(),user.getName(),user.getPhotoBig(),user.getPhoto()));
		});
	}}));
	_view.add(_hr());
	var places = user.getPlaces();
	for(var i=0;i< places.length; i++){
		_view.add(item({approved:places[i].approved,icon:"images/menu_place_icon.png",title:places[i].name,callBack:function(placedata){
			var placeView = require('ui/common/place/Place');
		    portal.open(placeView.init(placedata));
		},data:places[i]}));
		_view.add(_hr());
	}
	_view.add(item({approved:-1,icon:"images/menu_place_icon.png",title:"Join a business",callBack:function(){
		searchBus();
	}}));
	//_view.add(_hr());
	//_view.add(item({icon:"images/menu_feedback_icon.png",title:"Help us do a better job!",callBack:function(){
		//feedbck();
	//}}));
}

function feedback(){
	
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
			image:data.icon,width:40,height:40,
			right:10,
			top:10,bottom:10
		});
		main.add(icon);
	//}
	
	    
	    var v = Ti.UI.createView({layout:"vertical",width:Ti.UI.SIZE,height:Ti.UI.SIZE});
	    
		var title = Ti.UI.createLabel({
			text:data.title,height:Ti.UI.SIZE,left:0,
			color:"#fff",font:{
				fontSize:12
			}
		});
		v.add(title);
		
		if(data.approved ==1 || data.approved == "1"){
			approved_txt = "(verified)";
		}else{
			approved_txt = "(verification pending)";
		}		
		
		if(data.approved !== -1){
			var app = Ti.UI.createLabel({
				text:approved_txt,height:Ti.UI.SIZE,left:0,
				color:"#fff",font:{
					fontSize:10
				}
			});
			v.add(app);
		}
		
		main.add(v);
		
	
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
