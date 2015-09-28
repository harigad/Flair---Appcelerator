var scroll;
var feed;
var pull_to_refresh = require('ui/common/components/PullToRefresh');
var login = require('ui/common/Login');
var portal = require('ui/common/Portal');
var click_to_refresh;
var loadTimeout;
var _nearbyFeed;

var Search = require('ui/common/search/Search');

exports.init = function(_type){
	var name;
	
	Search.init();
	
	name = "flairs";
	
	var _header = header();
	
		
	var main = Titanium.UI.createWindow({
    	title: name,
    	backgroundColor: '#fff',barColor:"#fff",
    	navBarHidden:true
	});
	
	var container = Titanium.UI.createView(
		 {
		 	left:0,
		 	width:Ti.UI.FILL,
		 	height:Ti.UI.SIZE,
		 	top:0,layout:"vertical",
		 	backgroundColor:"#fff"
		 }
	);	
	
	scroll = Ti.UI.createTableView({top:0,backgroundColor:"#fff",separatorStyle:Titanium.UI.iPhone.TableViewSeparatorStyle.NONE});

	container.add(_header);
	
	 var menu = Ti.UI.createView({height:50,backgroundColor:"#40a3ff"});
    var menu_a = Ti.UI.createView({backgroundColor:"#66b5ff",opacity:0.5,left:0,height:50,width:"50%"});
    	menu_a.add( Ti.UI.createLabel({borderRadius:4,height:50,width:100,backgroundImage:"/images/home/home_checkin_btn.png"}));
     var menu_b = Ti.UI.createView({backgroundColor:"#66b5ff",opacity:0.85,right:0,height:50,width:"50%"});
     	menu_b.add( Ti.UI.createView({borderRadius:4,height:50,width:100,backgroundImage:"/images/home/home_checkin_btn.png"}));   
   // menu.add(menu_a);  menu.add(menu_b); 

	//container.add(menu);
	container.add(scroll);
	main.add(container);
	loadData(_type);
	
	Ti.App.addEventListener("notificationRecieved",function(){
		loadNotificationCountFromServer();
	});
	
	return main;
};


function loadNotificationCountFromServer(){
		var url = "http://services.flair.me/search.php";
		var dataStr = {};
		dataStr.type = "notifications";
		dataStr.accessToken = login.getAccessToken();

 	 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 data = JSON.parse(this.responseText);
     	 if(data){
     	 	buildnotification(data.length);
     	 }
     },
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
		});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(dataStr);
}


var notif;

function buildnotification(count){
	var notif_lbl;
	var insidenofif;
	
	if(notif){
		scroll.deleteRow(notif);
		notif = null;	
	}
	
	if(count > 0){
	
	notif = Ti.UI.createTableViewRow({
		height:Ti.UI.SIZE
	});
	
	insidenofif = Ti.UI.createView({
		height:Ti.UI.SIZE,
		backgroundColor:"#ff004e"
	});
	
	notif_lbl = Ti.UI.createLabel({
		text:"you have " + count + " notifications",
		height:Ti.UI.SIZE,color:"#fff",top:10,bottom:10
	});
	
	insidenofif.add(notif_lbl);
	notif.add(insidenofif);
	
	notif.addEventListener("click",function(e){
		var notifWindow = require('ui/common/notifications/notifications');
		notifWindow.init(function(c){
			buildnotification(c);
		});
	});
	
		scroll.insertRowBefore(0,notif);
	}
}

function print(_feed,_container){
	var FeedView = require('ui/common/feed/FeedView');
	feed = new FeedView(_feed.feed,scroll,{});
}

function loadData(_type,_container,_date,_searchType,_searchWord){
if(!_container){
	var retry = Ti.UI.createLabel({text:"searching...please wait..",color:"#cecece",font:{fontSize:24}});
    var network_error = Ti.UI.createLabel({text:" ",color:"#cecece",font:{fontSize:18}});
    click_to_refresh = Ti.UI.createView({layout:"vertical",top:150});
    	click_to_refresh.add(network_error);
    	click_to_refresh.add(retry);
    //scroll.add(click_to_refresh);
    
       loadTimeout = setTimeout(function(){
    		if(click_to_refresh){
    			network_error.setText("network error");
    			retry.setText("RETRY");
    		}
    		loadTimeout = null;
    	},10000);
    
    
    
    click_to_refresh.addEventListener("singletap",function(e){
    	loadData(_type);
    });

}
	
		
	
		var that = this;

		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = _type;
		if(_searchType){
			_dataStr._searchType = _searchType;
			_dataStr._searchWord = _searchWord;
		}
		_dataStr.accessToken = login.getAccessToken();
		if(_date){
			_dataStr.date = _date;
		}

	Ti.API.debug("loading feed = " + _dataStr);
	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.error('loaded data for Wall -> ' + this.responseText);
     	 var _feed = JSON.parse(this.responseText);  
     	 
     	 if(!_searchType && !_container){
     	 	_nearbyFeed = _feed;
     	 }
     	 
     	 if(loadTimeout){
     	 		 clearTimeout(loadTimeout);
     	 		 loadTimeout = null;
     	 }
     
     	 print(_feed,_container); 
     	 	 buildnotification(_feed.notificationsCount);	 
     },
     onerror : function(e) {
     	 Ti.API.error('error loading data for Wall -> ' + _type);
         Ti.API.error(e.error);
     },
     timeout : 6000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
}


function header(){	
	var c = Ti.UI.createView({top:0,left:0,backgroundColor:"#fff",height:Ti.UI.SIZE});
	var reload_btn = Ti.UI.createView({top:25,bottom:10,left:20,right:20,height:40});
	
	var search_btn = Ti.UI.createView({opacity:0.5,left:0,height:20,width:20,backgroundImage:"/images/search.png"});
	
	reload_btn.add(search_btn);
	
	var label = Ti.UI.createLabel({text:"find a business",color:"#999",left:30,width:205,height:30});
	reload_btn.add(label);
	
	var photo = "/images/menu_menu_icon.png";
	
	var cancel_btn;
	
	cancel_btn =  Titanium.UI.createView(
		 {
		 	right:0,
		  	width:'40',height: '40',
		  	backgroundImage:photo,bubbleParent:false
		 }
	);	


	Ti.App.addEventListener("userLoggedIn",function(){
		//cancel_btn.setBackgroundImage(login.getUser().getPhoto());
	});
	
		reload_btn.add(cancel_btn);
		cancel_btn.addEventListener("singletap",function(e){
			portal.toggleMenu();
			/*login.init(function(){
				var user = login.getUser();
				var win = require('ui/common/userProfile/UserProfile');
				portal.open(win.init(user.getId(),user.getName(),user.getPhotoBig(),user.getPhoto()));
			});*/
		});
	
	reload_btn.addEventListener('singletap',function(e){
				Search.open();
	});
	c.add(reload_btn);
	return c;
}

function onSearch(_data){
	loadData("nearby",null,null,_data._type,_data._word);
	
}