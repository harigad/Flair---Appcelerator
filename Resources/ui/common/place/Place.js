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
var pull_to_refresh = require('ui/common/components/PullToRefresh');


var roles = ["","Founders","Investors","Advisors","Team","Marketing/Web"];

exports.init = function(_data){
	var main = Titanium.UI.createWindow({
    	backgroundColor: '#eee',
    	navBarHidden:false ,barColor:'#fff'	
	});
	
	loadData(_data);
	
	scrollView = Ti.UI.createScrollView({
  		width: 320,
  		top:0
	});
	
	pull_to_refresh.init(scrollView,function(){
		loadData(_data);
	});
	
	view = Titanium.UI.createView(
		 {
		 	top:0,
		 	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);	
		
	var mapView = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region:{latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:false
   });
   
   mapView.addEventListener("complete",function(e){
   	mapView.region = {
   		latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.05, longitudeDelta:0.05
   	}
   });
	
    var mapViewCont_outer = Titanium.UI.createView(
		 {
		 	top:0,
		  	height: 140
		 }
    );
 	
 	var _title = Ti.UI.createLabel({
  		left:10,top:5,bottom:5,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		color: '#999',
  		text: _data.name,
  			font: {
         		fontSize:18,
         		fontWeight: 'bold'
    		}
  		});
    
    var mapDesc = Titanium.UI.createView(
		 {
		 	top:0,bottom:5,
		  	width:Ti.UI.FILL,bubbleParent:true,layout:'vertical',backgroundColor:"#333",height:Ti.UI.SIZE
		 }
	);	
	mapDesc.add(_title);
	
	mapViewCont_outer.add(mapView);
	
	mapView.addEventListener('click',function(){
		var win = require('ui/common/place/Map');
		portal.open(win.init(_data));	
	});
	
    view.add(mapViewCont_outer);
    view.add(mapDesc);
	
    
    var retry = Ti.UI.createLabel({text:"loading...please wait..",color:"#cecece",font:{fontSize:24}});
    var network_error = Ti.UI.createLabel({text:" ",color:"#cecece",font:{fontSize:18}});
     click_to_refresh = Ti.UI.createView({layout:"vertical",top:50});
    	click_to_refresh.add(network_error);
    	click_to_refresh.add(retry);
    view.add(click_to_refresh);
    
        loadTimeout = setTimeout(function(){
    		if(click_to_refresh){
    			network_error.setText("network error");
    			retry.setText("RETRY");
    		}
    		loadTimeout = null;
    	},10000);
    
    click_to_refresh.addEventListener("singletap",function(e){
    	network_error.setText("  ");
    	retry.setText("loading...please wait..");
    	loadData(_data);
    	
    	 loadTimeout = setTimeout(function(){
    		if(click_to_refresh){
    			network_error.setText("network error");
    			retry.setText("RETRY");
    		}
    		loadTimeout = null;
    	},10000);
    	
    });
	
	scrollView.add(view);
    main.add(scrollView);
        
	return main;
}

function separator(str){
	 var lbl = Ti.UI.createLabel({
  		left:10,top:0,botttom:0,
  		height:Ti.UI.SIZE,
  		color: '#bbb',
  		shadowColor: '#fff',
  		shadowOffset: {x:1, y:1},
  		text: str,
  			font: {
         		fontSize: 18
    		}
  		});  
  		
  		return lbl;
}

function print_food(_place){
  var str = "";
  return;
  
  Ti.API.debug("places.food length " + _place.foods.length);
  
  if(_foodView.children.length>0){
  	_foodView.remove(_foodView.children[0]);
  }
  
  var container = Ti.UI.createView({layout:'horizontal',width:Ti.UI.FILL,height:Ti.UI.SIZE});
  
  for(var i=0;i<_place.foods.length;i++){
  	str = str + _place.foods[i].name + ", ";
  }
  
  str = str.substring(0,str.length-2);
  if(_place.foods.length>0){
   var lbl = Ti.UI.createLabel({
  		height:Ti.UI.SIZE,
  		color: '#2179ca',top:0,left:0,
  		text: str,
  			font: {
         		fontSize: 14
    		}
  		});  
  		
  	container.add(lbl);
   }
   
   _foodView.add(container);
   
}


function print_cast(_place){
	//view.add(separator("Starring"));
	
	var _localView;
    Ti.API.debug("places.cast length " + _place.cast.length);


var role_id=0;

    for(var i=0;i<_place.cast.length;i++){	
    	
    	if(role_id != _place.cast[i].role_id){
    		view.add(separator(roles[_place.cast[i].role_id]));
    		role_id = _place.cast[i].role_id;
    		
    		 _localView = Titanium.UI.createView(
		 		{
		  			height: Ti.UI.SIZE,
		  			layout: 'vertical',top:5,bottom:5,
		  			left:10,right:10,borderRadius:4,borderColor:'#ddd',
		  			borderWidth:0.5,backgroundColor:'#fafafa'
		 	});
		 	
		 	view.add(_localView);
			
    	}
    	
		var row = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	layout:'horizontal',
		  	_data: _place.cast[i]
		 }
		);
		
		var thumb = _createThumb(_place.cast[i],"#dedede");
		
		var titleView = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	left:0,	
		  	width:170,
		  	layout:'vertical'
		 }
		);
		
		var placeName = Ti.UI.createLabel({
  		left:0,top:0,
  		width:Ti.UI.FILL,
  		color: '#333',
  		text: _place.cast[i].name,
  			font: {
         		fontSize: 24
    		}
  		});  
  		
		titleView.add(placeName);
  		//titleView.add(roleName);
  			  
  	row.add(thumb);
  	row.add(titleView);  
  		
  		row.addEventListener("singletap",function(e){
  			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(this._data.uid,this._data.name,this._data.photo_big));	
  		});
  		
  		_localView.add(row);
  	
  		if(i<_place.cast.length-1 && _place.cast[i+1].role_id == role_id){
  			_localView.add(_hr());
  		}
  	
	}
	
	view.add(separator("Flairs"));
	
    var FeedView = require('ui/common/feed/FeedView');
	var feed = new FeedView(_place.feed,view,null,null,true,"place",_place.pid);
}


function loadData(_data){
		var that = this;

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.pid = _data.pid;
		_dataStr.accessToken = login.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	
     	view.remove(click_to_refresh);
     	
     	Ti.API.debug(this.responseText);
     	 var _place = JSON.parse(this.responseText);  
     	 print_cast(_place);
     	 print_food(_place); 
     },
     onerror : function(e) {
     	 Ti.API.error('error loading data for Place -> ' + _data.pid);
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
}

function _createThumb(_data,_bgColor){
		
	var outer =  Titanium.UI.createView(
		 {
		 	backgroundImage:_data.photo,
		  	left:10,right:10,top:10,bottom:10,
		  	borderRadius:2,
		  	height:30,width:30 
		 }
	);
		//outer.add(inner);
		
	return outer;

}

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/like_hr.png',
		  	height:2,opacity:0.6,
		  	bottom:0,
		  	width:'320'
		 }
	);
}

