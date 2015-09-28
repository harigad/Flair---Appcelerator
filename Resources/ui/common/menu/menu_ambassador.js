var _main;
var _view;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var _closeWinFunc;

exports.init = function(closeWinFunc){
	_closeWinFunc = closeWinFunc;
	_main = Ti.UI.createWindow({
		backgroundColor:"#eee",navBarHidden:true
	});	
	
	_view = Ti.UI.createView({
		width:250,
		backgroundColor:"#eee",
		right:0,
		height:Ti.UI.FILL,
		layout:"vertical"
	});
	_view.add(header(_main));
	_main.add(_view);
	_draw();
	return _main;
};


function _draw(){

	_view.add(item({approved:-1,icon:"/images/menu_place_icon.png",title:"Invite a Business",callBack:function(){
			searchBus();
		}}));
	_view.add(_hr());
	
	
	_view.add(item({approved:-1,icon:"/images/menu_place_icon.png",title:"Invite a Friend",callBack:function(){
			addBus({},true);
	}}));
	  
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
			txt = "Invite a Friend";
		}else{
			txt = "Invite a Teammate";
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
	    
	    var v = Ti.UI.createView({layout:"vertical",width:Ti.UI.SIZE,height:Ti.UI.SIZE});
	    
		var title = Ti.UI.createLabel({
			text:data.title,height:Ti.UI.SIZE,left:0,
			color:"#aaa",left:15,
				shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 3,
				font:{
				fontSize:14
			}
		});
		v.add(title);
		
		if(data.approved ==1 || data.approved == "1"){
			approved_txt = "(approved)";
		}else{
			approved_txt = "(approval pending)";
		}		
		
		if(data.approved !== -1){
			var app = Ti.UI.createLabel({
				text:approved_txt,height:Ti.UI.SIZE,left:0,
				color:"#fff",
				color:"#aaa",left:15,
				shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 3,font:{
					fontSize:12
				}
			});
			v.add(app);
		}
		
		main.add(v);
		
	
    	main.addEventListener("click",function(){
    		if(data.closeMenu){
    			portal.toggleMenu(function(){
    				data.callBack(data.data);
    				_closeWinFunc(_main);
    			});
    		}else{
    			data.callBack(data.data);
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
	var left = Ti.UI.createView({top:20,left:20,width:22,height:30,backgroundImage:"/images/left_btn_dark.png"});
	h.add(left);
	
	var title = Ti.UI.createLabel({
		text:"V.I.P Program",
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
