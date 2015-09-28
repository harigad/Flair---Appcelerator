var _main;
var _view;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var _menu = require('ui/common/wall/Menu');
var _closeWinFunc;
var _place;

exports.init = function(place,closeWinFunc){
	_closeWinFunc = closeWinFunc;_place = place;
	_main = Ti.UI.createWindow({
		backgroundColor:"#eee",navBarHidden:true
	});	
		var scroll = Ti.UI.createScrollView({});
	_view = Ti.UI.createView({
		width:250,
		backgroundColor:"#eee",
		right:0,
		height:Ti.UI.FILL,
		layout:"vertical"
	});
	scroll.add(_view);
	
	_view.add(header(_main));
	_main.add(scroll);
	_draw(place);
	return _main;
};


function _draw(place){
	var user = login.getUser();
	var places = user.getPlaces();
	for(var i=0;i< places.length; i++){
		if(places[i].approved){
			_view.add(item({approved:places[i].approved,icon:"/images/menu_invite_icon.png",title:places[i].name,callBack:function(placedata){
				addBusAlert(placedata);
			},data:places[i]}));
		_view.add(_hr());
		}
	}
	
	
		_view.add(item({icon:"/images/menu_invite_icon.png",title:"Invite a Business",callBack:function(){
			searchBus(false);
		},data:places[i]}));
	  
}

function addBusAlert(p){
	
	var dialog = Ti.UI.createAlertDialog({
		title:p.placename || p.name,
    	buttonNames: ['Invite Teammate', 'Invite Customer']
    });
    
     dialog.addEventListener('click', function(e){
     	if(e.index==0){
     		addBus(p,false);
     	}else{
     		addBus(p,true);
     	}
     });
     
     dialog.show();
}

function searchBus(isFriend){
   var Search = require('ui/common/search/Search');
   Search.open(function(_data){
					addBus(_data,isFriend);
   });
}

function addBus(place,isFriend){
	var txt = "";
		if(isFriend){
			txt = "Invite Customer";
		}else{
			txt = "Invite Employee";
		}
	
		var new_bus = require('ui/common/invite/Invite');
		new_bus.init(place,txt,isFriend);
}

function item(data){
	var main = Ti.UI.createView({layout:"horizontal",height:Ti.UI.SIZE,left:10,right:10});

		var icon = Ti.UI.createImageView({
			image:data.icon,width:30,height:30,
			right:0,opacity:0.7,
			top:15,bottom:15
		});
		main.add(icon);
	    
	    var v = Ti.UI.createView({width:200,layout:"vertical",height:Ti.UI.SIZE});
	    
		var title = Ti.UI.createLabel({
			text:data.title,width:Ti.UI.SIZE,left:0,height:16,right:0,
			color:"#aaa",left:15,
				shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 3,
				font:{
				fontSize:14
			}
		});
		v.add(title);
		
		main.add(v);
		
	
    	main.addEventListener("click",function(){
    		if(data.closeMenu){
    			portal.toggleMenu(function(){
    				data.callBack(data.data,title);
    				_closeWinFunc(_main,true);
    			});
    		}else{
    			data.callBack(data.data,title);
    		}
    	});
    return main;
}


function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: '/images/feed/like_hr.png',
		  	height:2,opacity:0.6,
		  	bottom:0,top:0,
		  	width:Ti.UI.FILL
		 }
	);
}




function header(win){
	var h = Ti.UI.createView({top:0,height:60,width:Ti.UI.FILL});
	var left = Ti.UI.createView({top:20,left:10,width:22,height:30,backgroundImage:"/images/left_btn_dark.png"});
	h.add(left);
	
	var title = Ti.UI.createLabel({
		text:"Invite for",
		height:30,left:50,top:20,
			color:"#666",
				shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 3,
				font:{
					fontSize:20
				}
	});
	
	
	h.add(title);
	
	h.addEventListener("click",function(){
		_closeWinFunc(win);
	});

	return h;
}
