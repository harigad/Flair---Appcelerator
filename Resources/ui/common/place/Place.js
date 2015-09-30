var _lat;
var _lng;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var feed = require('ui/common/feed/FeedItem');
var map = require('ti.map');
var view;
var _tabViews;
var scrollView;
var _foodView;
var click_to_refresh;
var loadTimeout;
var _feed;
var _place;
var _newFlairCount = 0;
var _colors = [
"ff004e",
"008aff",
"ff2a00",
"33c500",
"ff5a00",
"ffb400"
];

var user = login.getUser();

var _MapView;
exports.init = function(data){
	
	var main = Titanium.UI.createWindow({
    	backgroundColor: '#fff',
    	navBarHidden:true ,barColor:'#fff',
    	theme : "Theme.AppCompat.Translucent.NoTitleBar"	
	});
	
	Ti.App.addEventListener("close_all",function(){
		portal.close(main);
	});
	
	_MapView = Titanium.UI.createView(
		 {
		 	top:0,width:Ti.UI.FILL,backgroundColor:"#fff",
		 	height:320,opacity:0.5
		 }
	);	
	
	main.add(_MapView);

	scrollView = Titanium.UI.createTableView({top:0,separatorStyle:Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,backgroundColor:'transparent'});	
	
	var rowOne = Ti.UI.createTableViewRow({height:320,selectedBackgroundColor:"transparent"});
	view = Titanium.UI.createView(
		 {
	
		 	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);	
 	rowOne.add(view);
 	
 	var titleV = Titanium.UI.createView(
		 {
		 	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);
 	
 	var _title = Ti.UI.createLabel({
  		bottom:0,top:30,
    	left:5,right:5,
    	textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
  		height:Ti.UI.SIZE,
  		minimumFontSize:16,
  		text: data.placename || data.name,
  			font: {
         		fontSize:24,
    	},
    	color: '#ff004e',
    			shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 10
  		});
   titleV.add(_title);
   var _addr = Ti.UI.createLabel({
  		bottom:30,top:0,
    	left:20,right:20,
  		height:Ti.UI.SIZE,
  		minimumFontSize:16,textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
  		text: data.vicinity.split(",")[0],
  			font: {
         		fontSize:14,
    	},
    	color: '#333'
  		});
  	titleV.add(_addr);
  	
  	titleV.addEventListener("click",function(){
  		goToMap();
  	});
  	
  	var btn = Ti.UI.createView({opacity:0.7,backgroundColor:"#ff004e",bubbleParent:false,borderWidth:5,borderColor:"#fff",borderRadius:50,width:100,height:100,bottom:30});
  	btn.add(Ti.UI.createView({width:75,height:75,backgroundImage:"/images/glasses_100_100_white.png"}));
  	btn.addEventListener("click",function(){
  		launchFlair();
  	});
  		titleV.add(btn);
   view.add(titleV);
   
    var menu = Ti.UI.createView({height:Ti.UI.SIZE});
    var menu_a = Ti.UI.createView({bubbleParent:false,opacity:1,backgroundColor:"#333",left:0,height:50,width:"50%"});
    	menu_a.add( Ti.UI.createView({height:20,width:20,backgroundImage:"/images/glasses_45_white.png"}));
     var menu_b = Ti.UI.createView({opacity:0.7,bubbleParent:false,backgroundColor:"#333",right:0,height:50,width:"50%"});
     	menu_b.add( Ti.UI.createView({height:30,width:30,backgroundImage:"/images/team_45_white.png"}));
    menu.add(menu_a);  menu.add(menu_b); 
    
    menu_a.addEventListener("click",function(){
    	menu_a.setOpacity(1);menu_b.setOpacity(.7);
    	sub_title_icon.setBackgroundImage("/images/glasses_45_white.png");
    	sub_title_text.setText("flairs");
    	printFeed();
    });
    
    menu_b.addEventListener("click",function(){
    	menu_a.setOpacity(.7);menu_b.setOpacity(1);
    	sub_title_icon.setBackgroundImage("/images/team_45_white.png");
    	sub_title_text.setText("teammates");
    	printCast();
    });
    
    
   // titleV.add(menu);
    
    
    var sub_title = Ti.UI.createView({layout:"horizontal",backgroundColor:"#777",height:Ti.UI.SIZE});
    
    var sub_title_icon = Ti.UI.createView({left:20,height:20,width:20,backgroundImage:"/images/glasses_45_white.png"});
    sub_title.add(sub_title_icon);
    
    var sub_title_text = Ti.UI.createLabel({
    	top:10,bottom:10,height:Ti.UI.SIZE,left:10,
    	text:"flairs",font:{
    		fontSize:16
    	},
    	color:"#aaa",
    });
    
    sub_title.add(sub_title_text);
    //view.add(sub_title);
    //view.add(_hr());
    
	scrollView.appendRow(rowOne);
    main.add(scrollView);
    main.add(header(main));
    loadData(data);
    
	return main;
};
var _feedView;

function launchFlair(){
	var win = require('ui/common/flair/Search');
  			win.open(_place,function(flair,hash){
  					loadDataForFlair(_place,flair,hash);
  			});
}

function loadDataForFlair(data,flair,hash){
		var that = this;

		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "add_new_flair";
		_dataStr.pid = data.pid || data.id;
		_dataStr.recipient_uid = flair.uid;
		_dataStr.recipient_name = flair.name;
		_dataStr.hash = hash;
		_newFlairCount = _newFlairCount + 1;
		_dataStr.accessToken = login.getAccessToken();
		
		
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 var flairs  = JSON.parse(this.responseText); 
     	
		 	if(flairs && flairs.length>0){
		 	    var row = feed.feedItem(flairs[0],null,0,"place",data.pid || data.id,function(obj){
	    			Ti.API.error("deleting .." + obj);
	    			scrollView.deleteRow(obj,Titanium.UI.iPhone.RowAnimationStyle);
	    			Ti.API.error("deleted");
	    		},
	    		_colors[Math.abs(6 -_newFlairCount)%6]
	    		);	
	    		row._parentView = scrollView;
	    		row.isFeed = true;	
		 		scrollView.insertRowAfter(0,row);
		 		_newFlairCount = _newFlairCount + 1;
		 }
     },
     onerror : function(e) {
     	 Ti.API.error('error sending flair ' + data.pid);
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
	
	
	
}



function printFeed(){
   if(_place.feed.length === 0){
   		scrollView.appendRow(_noData());
   }else{
    	var FeedView = require('ui/common/feed/FeedView');
    	_feedView = new FeedView(_place.feed,scrollView,{'pid':_place.pid || _place.id},"place",_place.pid || _place.id);
   }
   
   Map(_place);	
}

function printCast(){
	
	var _colors = [
"ff004e",
"008aff",
"ff2a00",
"33c500",
"ff5a00",
"ffb400"
];


	if(_feedView){
		view.remove(_feedView);
	}
   _feedView = Ti.UI.createView({height:Ti.UI.SIZE,layout:"vertical",backgroundColor:"#fff"});	
   if(_place.cast.length === 0){
   		_feedView.add(_noData());
   }
   
   
    for(var i=0;i<_place.cast.length;i++){	
    	_feedView.add(getCastRow(_place,_place.cast[i],_colors[i%6]));
    	_feedView.add(Ti.UI.createView({top:0,bottom:0,backgroundImage: '/images/feed/like_hr.png',
		  	height:2,opacity:0.6}));
  	
  }
  view.add(_feedView);
}
  

function getCastRow(place,data,color){
	var cContainer = Titanium.UI.createView(
		 {
		  	left:20,right:0,
		  	top:25,bottom:25,
		  	height:Ti.UI.SIZE,
		  	layout: 'horizontal'
		 }
	);
	
	cContainer.addEventListener("click",function(){
							var win = require('ui/common/userProfile/UserProfile');
								portal.open(win.init(data.uid,data.name,data.photo_big,data.photo));	
	});
	
	var user_photo = Titanium.UI.createImageView(
		 {
		  	left:0,backgroundColor:'#ccc',
		  	width:'50',height: '50',borderWidth:3,borderColor:"#eee",
		  	image:data.photo || "/images/flairs/100/1.png",
		  	borderRadius: 25,
		 }
	);
	
	cContainer.add(user_photo);	
	
	var v = Ti.UI.createView({left:20,width:220,height:Ti.UI.SIZE,layout:"vertical"});
	
	var name_txt = Ti.UI.createLabel({
		height:Ti.UI.SIZE,
		left:0,width:Ti.UI.SIZE,
  		text:data.name,
  		wordWrap:false,
  		color:'#' + color,
  		font: {
         fontSize: 24
    }
	});v.add(name_txt);
	
	if(data.role_id){
 	var place_txt = Ti.UI.createLabel({
     		left:0,width:Ti.UI.SIZE,
			height:Ti.UI.SIZE,
			color:"#aaa",
			shadowColor: '#fff',
    		shadowOffset: {x:1, y:1},
    		shadowRadius: 3,
  			text:data.role_id,
  			font: {
         		fontSize: 14
    		}
	});v.add(place_txt);
	}
	
	cContainer.add(v);
  		
 return cContainer;
}

function delete_cast(obj,data){
			var dialog = Ti.UI.createAlertDialog({
    			cancel: -1,
    			buttonNames: ['Remove', 'Cancel'],
    			message: 'Remove Permanently?'
   			 });
   			 
   			  dialog.addEventListener('click', function(e){
      			Ti.API.debug('edit share dialog button clicked with index ' + e.index);
    			if (e.index === 0){
    					//delete_flair_from_server(data);
    				    _localView.remove(obj);	
    			}else{
    		 //do nothing
    		// obj.setBackgroundColor("#f1f1f1");
    			}
   			 });
   			// obj.setBackgroundColor("#990000");
   			 dialog.show();
}


function loadData(data,flair,icon){
	_wait();
	if(loadTimeout){
		clearTimeout(loadTimeout);
		loadTimeout = null;
	}
	   loadTimeout = setTimeout(function(){
    		_retry(data);
    	},10000);
    
		var that = this;

		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.pid = data.pid || data.id;
		
		_dataStr.accessToken = login.getAccessToken();
		
		Ti.API.error("--->" + login.getAccessToken());
		Ti.API.error("--->" + data.pid);

 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	
     	if(click_to_refresh){
			view.remove(click_to_refresh);
			click_to_refresh = null;
		}
		if(loadTimeout){
			clearTimeout(loadTimeout);
			loadTimeout = null;
		}
     	
     	
     	Ti.API.debug(this.responseText);
     	 _place = JSON.parse(this.responseText); 
     	 if(loadTimeout){
			clearTimeout(loadTimeout);
			loadTimeout = null;
		 }
		 	
     	 	printFeed(); 
     	 
     },
     onerror : function(e) {
     	 Ti.API.error('error loading data for Place -> ' + data.pid);
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
}

function _wait(){
	if(click_to_refresh){
		view.remove(click_to_refresh);
		click_to_refresh = null;
	}
	
	var retry = Ti.UI.createLabel({text:"please wait..",color:"#cecece",font:{fontSize:18}});
    click_to_refresh = Ti.UI.createView({layout:"vertical",top:80});
    	click_to_refresh.add(retry);
    	view.add(click_to_refresh);
}

function _noData(){
	var row = Ti.UI.createTableViewRow();
	var h = Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE,top:80,layout:"horizontal"});
	
	 h.add(Ti.UI.createLabel({width:Ti.UI.SIZE,height:Ti.UI.SIZE,
			text:'Be the first to',
			color:"#aaa",
  			font: {
         		fontSize: 20
    		}}));
    
    h.add(Ti.UI.createView({left:5,right:5,width:25,height:25,backgroundImage:"/images/glasses_blue_40_40.png"}));
    		
	h.add(Ti.UI.createLabel({width:Ti.UI.SIZE,height:Ti.UI.SIZE,
			text:"Flair",
			color:"#ff004e",
  			font: {
         		fontSize: 20
    		}}));
    		h.addEventListener("click",function(){
    			launchFlair();
    		});
    		
    		row.add(h);
    		
    		return row;
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
    	view.add(click_to_refresh);
    
    click_to_refresh.addEventListener("singletap",function(e){
    	loadData(data);
    	view.remove(click_to_refresh);
    });
}


function _hr(){
	return  Ti.UI.createView({top:0,bottom:0,backgroundImage: '/images/feed/like_hr.png',
		  	height:2,opacity:0.6});
}

function header(win){
	var h = Ti.UI.createView({top:0,height:60,width:Ti.UI.FILL});
	var left = Ti.UI.createView({top:20,left:20,width:22,height:30,backgroundImage:"/images/left_btn_dark.png"});
	h.add(left);
	
	
	left.addEventListener("click",function(){
		portal.close(win);
	});
	
	
	
	var home = Ti.UI.createView({top:20,right:20,width:36,height:30,backgroundImage:"/images/home_icon_dark.png"});
	home.addEventListener("click",function(){
		Ti.App.fireEvent("close_all");
	});
	h.add(home);
	return h;
}

function goToMap(){
	var win = require('ui/common/place/Map');
	portal.open(win.init(_place));
}

function Map(_data){
	
	var mapView = map.createView({
    mapType: map.NORMAL_TYPE,
    region:{latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.02, longitudeDelta:0.02},
    animate:true,
    regionFit:true,
    userLocation:false
   });
	
   mapView.addEventListener("complete",function(e){
   		mapView.region = {
   			latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.02, longitudeDelta:0.02
   		};
   	});

 	
   var mapViewCont = Titanium.UI.createView(
		 {
		 	top:0,left:0,right:0,bottom:0
		 }
	);	
	
	mapViewCont.add(mapView);
    _MapView.add(mapViewCont);
}

