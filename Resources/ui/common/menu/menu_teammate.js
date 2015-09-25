var _main;
var _view;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var _closeWinFunc;
var _place;
var _placeRefresh;

exports.init = function(data,place,closeWinFunc,placeRefresh){
	_closeWinFunc = closeWinFunc;_place = place;_placeRefresh = placeRefresh;
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
	_view.add(header(_main,data));
	_main.add(_view);
	_draw(data);
	return _main;
};


function _draw(data){

	_view.add(item({closeMenu:true,approved:-1,icon:data.photo,title:"View Profile",callBack:function(){
				var win = require('ui/common/userProfile/UserProfile');
				portal.open(win.init(data.uid,data.name,data.photo_big,data.photo));	
		}}));
	_view.add(_hr());
	
	_view.add(item({closeMenu:false,approved:-1,icon:"images/menu_job_title_icon.png",title:(data.role_id? data.role_id + " (edit)" : "Add a Job Title"),callBack:function(dataObj,label){
				if(_place.admin > 0){
					var win = require('ui/common/userProfile/EditRole');
						win.init(data.rid,data.role_id,function(title){
						label.setText(title);
						data.role_id = title;
					});
				}else{
						var win = require('ui/common/errors/restricted');
						win.init(_place);
				}
		}}));
	_view.add(_hr());
	
	_view.add(item({approved:-1,icon:"images/menu_delete_icon.png",title:"Remove Teammate",callBack:function(){
		if(_place.admin > 0){
			var rem = require('ui/common/place/deleteTeammate');
			rem.init(data,_place,function(){
				_closeWinFunc(_main);
				_placeRefresh();
			});
		}else{
			var win = require('ui/common/errors/restricted');
			win.init(_place);
		}	
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
			right:0,opacity:1,borderRadius:2,
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
		
		if(false){
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
		  	backgroundImage: 'images/feed/like_hr.png',
		  	height:2,opacity:0.6,
		  	bottom:0,top:0,
		  	width:Ti.UI.FILL
		 }
	);
}




function header(win,data){
	var h = Ti.UI.createView({top:0,height:60,width:Ti.UI.FILL});
	var left = Ti.UI.createView({top:20,left:10,width:22,height:30,backgroundImage:"images/left_btn_dark.png"});
	h.add(left);
	
	var title = Ti.UI.createLabel({
		text:data.name,
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
