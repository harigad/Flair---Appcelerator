var _lat;
var _lng;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var view;
var _tabViews;
var scrollView;
var _foodView;
var click_to_refresh;
var loadTimeout;
var _feed;
var _place;

var user = login.getUser();
exports.init = function(data){
	var main = Titanium.UI.createWindow({
    	backgroundColor: '#40a3ff',
    	navBarHidden:true ,barColor:'#40a3ff'	
	});
	
	Ti.App.addEventListener("close_all",function(){
		portal.close(main);
	});
	
	
	main.add(header(main));
	scrollView = Ti.UI.createScrollView({
  		width: Ti.UI.FILL,
  		top:55,backgroundColor:"#f1f1f1"
	});

	view = Titanium.UI.createView(
		 {
		 	top:0,
		 	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);	
 	
 	var titleV = Titanium.UI.createView(
		 {
		 	top:0,backgroundColor:"#40a3ff",
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
    	color: '#fff'
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
    	color: '#fff'
  		});
  	titleV.add(_addr);
  	
  	_title.addEventListener("click",function(){
  		goToMap();
  	});
  	
  	_addr.addEventListener("click",function(){
  		goToMap();
  	});
  	
  	var btn = Ti.UI.createView({borderWidth:5,borderColor:"#5bb0ff",borderRadius:50,width:100,height:100,bottom:30});
  	btn.add(Ti.UI.createView({width:75,height:75,backgroundImage:"images/glasses_100_100_white.png"}));
  	btn.addEventListener("click",function(){
  		launchFlair();
  	});
  		titleV.add(btn);
   view.add(titleV);
   
    var menu = Ti.UI.createView({height:Ti.UI.SIZE});
    var menu_a = Ti.UI.createView({backgroundColor:"#66b5ff",opacity:0.5,left:0,height:50,width:"50%"});
    	menu_a.add( Ti.UI.createLabel({borderRadius:4,height:50,width:100,backgroundImage:"images/home/home_checkin_btn.png"}));
     var menu_b = Ti.UI.createView({backgroundColor:"#66b5ff",opacity:0.85,right:0,height:50,width:"50%"});
     	menu_b.add( Ti.UI.createView({borderRadius:4,height:50,width:100,backgroundImage:"images/home/home_checkin_btn.png"}));   
    menu.add(menu_a);  menu.add(menu_b); 
    
    menu_a.addEventListener("click",function(){
    	menu_a.setOpacity(0.5);menu_b.setOpacity(0.85);
    	printFeed();
    });
    
    menu_b.addEventListener("click",function(){
    	menu_a.setOpacity(0.85);menu_b.setOpacity(0.5);
    	printCast();
    });
    
    
    titleV.add(menu);
    
    view.add(_hr());
	scrollView.add(view);
    main.add(scrollView);
    
    loadData(data);
    
	return main;
};
var _feedView;

function launchFlair(){
	var win = require('ui/common/flair/Search');
  			win.open(_place,function(flair){
  					if(_feedView){
						view.remove(_feedView);
					}
  					loadData(_place,flair);
  			});
}

function printFeed(){
	if(_feedView){
		view.remove(_feedView);
	}
	if(_place.feed.length === 0){
   		_feedView = _noData();
   }else{
    	var FeedView = require('ui/common/feed/FeedView');
    	_feedView = new FeedView(_place.feed,null,null,null,true,"place",_place.pid || _place.id);
   }
    view.add(_feedView);
}

function printCast(){
	if(_feedView){
		view.remove(_feedView);
	}
   _feedView = Ti.UI.createView({height:Ti.UI.SIZE,layout:"vertical"});	
   if(_place.cast.length === 0){
   		_feedView.add(_noData());
   }
   
   
    for(var i=0;i<_place.cast.length;i++){	
    	_feedView.add(getCastRow(_place,_place.cast[i]));
    	_feedView.add(Ti.UI.createView({top:0,bottom:0,backgroundImage: 'images/feed/like_hr.png',
		  	height:2,opacity:0.6}));
  	
  }
  view.add(_feedView);
}
  

function getCastRow(place,data){
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
		  	image:data.photo,
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
  		color:'#40a3ff',
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


function loadData(data,flair){

	_wait();
	if(loadTimeout){
		clearTimeout(loadTimeout);
		loadTimeout = null;
	}
	   loadTimeout = setTimeout(function(){
    		_retry(data);
    	},3000);
    
		var that = this;

		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.pid = data.pid || data.id;
		
		if(flair){
			_dataStr.recipient_uid = flair.uid;
			_dataStr.recipient_name = flair.name;
		}
		
		_dataStr.accessToken = login.getAccessToken();

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
	var h = Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE,top:80,layout:"horizontal"});
	
	 h.add(Ti.UI.createLabel({width:Ti.UI.SIZE,height:Ti.UI.SIZE,
			text:'Be the first to',
			color:"#aaa",
			shadowColor: '#fff',
    		shadowOffset: {x:1, y:1},
    		shadowRadius: 3,
  			font: {
         		fontSize: 20
    		}}));
    
    h.add(Ti.UI.createView({left:-5,right:5,width:25,height:25,backgroundImage:"images/glasses_blue_40_40.png"}));
    		
	h.add(Ti.UI.createLabel({width:Ti.UI.SIZE,height:Ti.UI.SIZE,
			text:"Flair",
			color:"#40a3ff",
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
    	view.add(click_to_refresh);
    
    click_to_refresh.addEventListener("singletap",function(e){
    	loadData(data);
    	view.remove(click_to_refresh);
    });
}


function _hr(){
	return  Ti.UI.createView({top:0,bottom:0,backgroundImage: 'images/feed/like_hr.png',
		  	height:2,opacity:0.6});
}

function header(win){
	var h = Ti.UI.createView({top:15,height:40,width:Ti.UI.FILL});
	var left = Ti.UI.createView({left:20,width:22,height:30,backgroundImage:"images/left_btn.png"});
	h.add(left);
	
	
	left.addEventListener("click",function(){
		portal.close(win);
	});
	
	
	
	var home = Ti.UI.createView({right:20,width:36,height:30,backgroundImage:"images/home_icon.png"});
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

