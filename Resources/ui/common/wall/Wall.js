var scroll;
var feed;
var pull_to_refresh = require('ui/common/components/PullToRefresh');
var login = require('ui/common/Login');
var portal = require('ui/common/Portal');
var places;
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
    	backgroundColor: '#eee',
    	navBarHidden:false,barColor:'#fff',titleControl:_header
	});

	scroll = Ti.UI.createScrollView({top:0,contentOffset:{X:80,Y:80}});
	
	pull_to_refresh.init(scroll,function(){
		loadData(_type);
	});
	
	Ti.App.addEventListener("userLoggedIn",function(){
		loadData(_type);
	});
	
	
	main.add(scroll);
	
	loadData(_type);
	
			var Places = require('ui/common/flair/Places');
			places = Places.init();


    main.addEventListener("open",function(e){
    	
    	var animation = Titanium.UI.createAnimation();
    	animation.top = 0;
    	duration = 200;
    	_header.animate(animation);
    	
    });	
    
    main.addEventListener("close",function(e){
    	
    	var animation = Titanium.UI.createAnimation();
    	animation.top = -150;
    	duration = 200;
    	_header.animate(animation);
    	
    });	
    
 	
	return main;
}

function print(_feed,_container){
	if(!_container && feed){
		scroll.remove(feed);
	}
	
	if(click_to_refresh){
		scroll.remove(click_to_refresh);
	}

	var FeedView = require('ui/common/feed/FeedView');
	feed = new FeedView(_feed,_container,function(_date){
		loadData('nearby',feed,_date);
	},scroll);	

	var user = login.getUser();
	
	if(login.loggedIn()){	
	var user_photo = Titanium.UI.createView(
		 {
		  	left:10,
		  	top:10,bottom:10,
		  	width:'30',height: '30',
		  	backgroundImage:user.getPhoto(),borderRadius:2,
		  	backgroundColor:'#ccc',_dontUseParentEventListener:true
		 }
	);	
		var myFlairs = Ti.UI.createView({layout:"horizontal",height:Ti.UI.SIZE,backgroundColor:"#fff",borderRadius:4,left:10,right:10,top:10});

		var myFlairs_lbl = Ti.UI.createLabel({height:Ti.UI.SIZE,left:5,text:"My flairs",color:"#2179ca",font:{fontSize:18}});
		myFlairs.add(user_photo);
		myFlairs.add(myFlairs_lbl);
		
			var arrow = Ti.UI.createView({
					left:10,
					backgroundImage:"images/rightarrow.png",
					width:16.6,height:30
				});
				
				myFlairs.add(arrow);

		
		myFlairs.addEventListener("singletap",function(e){
			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(user.getId(),user.getName(),user.getPhotoBig()));	
		});
		scroll.add(myFlairs);
  		feed.setTop(60);
  }else{
  	feed.setTop(10);
  }

		scroll.add(feed);

}

function loadData(_type,_container,_date,_searchType,_searchWord){
	
if(!_container){
	if(feed){
		scroll.remove(feed);
	}
		   var retry = Ti.UI.createLabel({text:"searching...please wait..",color:"#cecece",font:{fontSize:24}});
    var network_error = Ti.UI.createLabel({text:" ",color:"#cecece",font:{fontSize:18}});
    click_to_refresh = Ti.UI.createView({layout:"vertical",top:150});
    	click_to_refresh.add(network_error);
    	click_to_refresh.add(retry);
    scroll.add(click_to_refresh);
    
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

		var url = "http://flair.me/search.php";
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
	var reload_btn = Ti.UI.createView({layout:'horizontal',width:300,borderRadius:4,height:40,top:5});
	
	var search_btn = Ti.UI.createView({opacity:0.5,left:10,height:20,width:20,backgroundImage:"images/search.png"});
	
	reload_btn.add(search_btn);
	
	var label = Ti.UI.createLabel({text:"search",color:"#999",left:15,width:200,height:30});
	reload_btn.add(label);
	var cancel_btn = Ti.UI.createView({visible:false,bubbleParent:false,height:35,width:35,backgroundImage:"images/cancel.png"});
	reload_btn.add(cancel_btn);
	
	cancel_btn.addEventListener("singletap",function(e){
		label.setText("search");
		cancel_btn.setVisible(false);
		Search.reset();
		if(_nearbyFeed){
			print(_nearbyFeed);
		}
	});
	
	reload_btn.addEventListener('singletap',function(e){
				Search.open(function(_data){
					label.setText(_data.title);
					cancel_btn.setVisible(true);
					onSearch(_data);
				});
	});
	return reload_btn;
}

function onSearch(_data){
	loadData("nearby",null,null,_data._type,_data._word);
	
}