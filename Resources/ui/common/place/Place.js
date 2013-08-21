var _lat;
var _lng;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var view;
var _tabViews;
var scrollView;
var _foodView;
var pull_to_refresh = require('ui/common/components/PullToRefresh');

exports.init = function(_data){
	var main = Ti.UI.createWindow({	
	   	backgroundColor: '#eee',
	   	navBarHidden:false
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
		 	top:'0',
		 	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);	
		
	var mapView = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region:{latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.01, longitudeDelta:0.01},
    animate:true,
    regionFit:true,
    userLocation:true
    
   });
	
  var mapViewCont_outer = Titanium.UI.createView(
		 {
		 	top:'0',left:10,right:10,top:10,
		  	height: Ti.UI.SIZE,borderRadius:4,backgroundColor:'#fff',borderWidth:0.5,
		  	borderColor:'#ccc',layout:'vertical'
		 }
   );
	
   var mapViewCont = Titanium.UI.createView(
		 {
		 	top:'0',left:0,right:0,top:0,bottom:0,
		  	height: '140'
		 }
	);	
	
   var mapDesc = Titanium.UI.createView(
		 {
		 	top:'0',
		  	height: '140',width:'300',bubbleParent:true,
		  	backgroundImage:'images/map_shade.png',layout:'vertical'
		 }
	);	
	
	var addrLabel = Ti.UI.createLabel({
  		left:10,top:100,
    	width:'150',
  		height:Ti.UI.SIZE,
  		color: '#fff',
  		text: _data.vicinity,
  			font: {
         		fontSize: 14
    		}
  		});
	mapDesc.add(addrLabel);
	
	mapViewCont.add(mapView);
	mapView.add(mapDesc);
	mapViewCont_outer.add(mapViewCont);
	
	mapViewCont.addEventListener('click',function(){
		var win = require('ui/common/place/Map');
		portal.open(win.init(_data));	
	});
	
	
	var _title = Ti.UI.createLabel({
  		left:10,top:10,bottom:0,right:10,
  		height:Ti.UI.SIZE,
  		color: '#333',
  		text: _data.name,
  			font: {
         		fontSize: 18
    		}
  		});
	mapViewCont_outer.add(_title);
	
	_foodView = Ti.UI.createView({height:Ti.UI.SIZE,left:10,right:10,bottom:10});
	mapViewCont_outer.add(_foodView);
	
    view.add(mapViewCont_outer);
    
    scrollView.add(view);
    main.add(scrollView);
        
	return main;
}

function separator(str){
	 var lbl = Ti.UI.createLabel({
  		left:10,top:10,botttom:10,
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
	view.add(separator("Starring"));
	
	var _localView = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	layout: 'vertical',
		  	left:10,right:10,borderRadius:4,borderColor:'#ddd',
		  	borderWidth:0.5,backgroundColor:'#fafafa',
		  	top:10,
		 }
	);	
	
	view.add(_localView);

    Ti.API.debug("places.cast length " + _place.cast.length);

    for(var i=0;i<_place.cast.length;i++){	
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
  		color: '#2179ca',
  		text: _place.cast[i].name,
  			font: {
         		fontSize: 36
    		}
  		});  
  		var roleName = Ti.UI.createLabel({
  		left:0,bottom:10,
  		width:Ti.UI.FILL,
  		color: '#999',
  		text: _place.cast[i].role,
  			font: {
         		fontSize: 18
    		}
  		});
		
		titleView.add(placeName);
  		titleView.add(roleName);
  			  
  	row.add(thumb);
  	row.add(titleView);  
  		
  		row.addEventListener("singletap",function(e){
  			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(this._data.uid,this._data.name,this._data.photo_big));	
  		});
  		
  		_localView.add(row);
  	
  		if(i<_place.cast.length-1){
  			_localView.add(_hr());
  		}
  	
	}
	
	view.add(separator("Flairs"));
	
    var FeedView = require('ui/common/feed/FeedView');
	var feed = new FeedView(_place.feed,view,null,null,true);
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
		  	borderRadius:4,
		  	height:75,width:75  
		 }
	);
		
		var inner =  Titanium.UI.createView(
		 {
		 	backgroundImage:_data.photo,
		  	left:12.5,right:12.5,top:12.5,bottom:12.5,
		  	borderRadius:4,
		  	height:50,width:50 
		 }
	);
		
		//outer.add(inner);
		
	return outer;

}

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/like_hr.png',
		  	height:2,
		  	bottom:0,
		  	width:'320'
		 }
	);
}

