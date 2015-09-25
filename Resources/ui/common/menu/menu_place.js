var _main;
var _view;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var _menu = require('ui/common/wall/Menu');
var _pid;
var _closeWinFunc;
exports.init = function(placeObj,closeWinFunc){
	_closeWinFunc = closeWinFunc;
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
	_view.add(header(_main,placeObj));
	_main.add(scroll);
	loadData(placeObj.pid);
	_pid = placeObj.pid;
	return _main;
};

function _refresh(){
	loadData(_pid);
}

var _menusView;
function _draw(place){
	
	
	_menusView.add(item({approved:-1,icon:"images/menu_place_icon.png",title:"View Profile",callBack:function(){
			portal.toggleMenu(function(){
			 var placeView = require('ui/common/place/Place');
		      portal.open(placeView.init({vicinity:place.city,lat:place.lat,lng:place.lng,pid:place.id,name:place.name}));
		     _closeWinFunc(_main);
		  });
		}}));
	
	_menusView.add(_hr());
	_menusView.add(item({icon:"images/menu_invite_icon.png",title:"Invite Customers",callBack:function(c){
		addBus(place);
	}}));
	
	for(var i=0;i< place.cast.length; i++){
		_menusView.add(_hr());
		_menusView.add(item({approved:place.cast[i].approved,icon:place.cast[i].photo,title:place.cast[i].name,callBack:function(castData){
			
			 	if(castData.approved){
					var win = require('ui/common/menu/menu_teammate');
					_menu.openSub(win.init(castData,place,function(w,closeAll){
					_closeWinFunc(w);
						if(closeAll){
							_closeWinFunc(_main);
						}
					},_refresh));
			   }else if(place.admin){
			   		var win = require('ui/common/menu/approveTeammate');
			   			win.init(castData,place,function(s){
							_refresh();	
						});
			   }
		},data:place.cast[i]}));
		
	}
 
}

function addBus(place){
	var txt = "";
	txt = "Invite Customer";
		
		var new_bus = require('ui/common/invite/Invite');
		new_bus.init(place,txt,true);
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
		  	backgroundImage: 'images/feed/like_hr.png',
		  	height:2,opacity:0.6,
		  	bottom:0,top:0,
		  	width:Ti.UI.FILL
		 }
	);
}

var _loadingPlace;
function loadData(pid){
		if(_menusView){
			_view.remove(_menusView);
		}
		_menusView = Ti.UI.createView({
			height:Ti.UI.SIZE,layout:"vertical"
		});
		
		_loadingPlace = Ti.UI.createLabel({text:"please wait..",height:Ti.UI.SIZE,left:30,
			color:"#aaa",top:20,
				shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 3,
				font:{
				fontSize:14
				}
		});
		_menusView.add(_loadingPlace);
		
		_view.add(_menusView);
	
	 	var that = this;

		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.pid = pid;
		_dataStr.accessToken = login.getAccessToken();

 	 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	if(_loadingPlace){
			_menusView.remove(_loadingPlace);
		}
     	
    	Ti.API.debug(this.responseText);
     	 var place = JSON.parse(this.responseText); 
     	 _draw(place);
     },
     onerror : function(e) {
     	if(_loadingPlace){
			_loadingPlace.setText("Network Error!");
		}
     	
     	
     	 Ti.API.error('error loading data for Place -> ' + pid);
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
}


function header(win,place){
	var h = Ti.UI.createView({top:10,height:60,width:Ti.UI.FILL});
	var left = Ti.UI.createView({top:20,left:10,width:22,height:30,backgroundImage:"images/left_btn_dark.png"});
	h.add(left);
	
	var title = Ti.UI.createLabel({
		text:place.name,
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
