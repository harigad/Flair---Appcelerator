var _lat;
var _lng;
var portal = require('ui/common/Portal');
var view;
exports.init = function(_data){
	var main = Ti.UI.createWindow({	
	   	barColor:'#333',
    	backgroundColor: '#eee' 	
	});
	
	loadData(_data);
	
	var scrollView = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 320,
  		top:0
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
    region:{latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.005, longitudeDelta:0.005},
    animate:true,
    regionFit:true,
    userLocation:true
    
   });
	
   var mapViewCont = Titanium.UI.createView(
		 {
		 	top:'0',
		  	height: '120'
		 }
	);	
	
   var mapDesc = Titanium.UI.createView(
		 {
		 	top:'0',
		  	height: '120',width:'320',bubbleParent:true,
		  	backgroundImage:'images/map_shade.png',layout:'vertical'
		 }
	);	
	var nameLabel = Ti.UI.createLabel({
  		left:10,
        top:'55',
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,shadowColor:'#333333',
  		color: '#fff',
  		text: _data.name,
  			font: {
         		fontSize: 16,fontWeight:'bold'
    		}
  		});  
	mapDesc.add(nameLabel);
	
	var addrLabel = Ti.UI.createLabel({
  		left:10,
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
    view.add(mapViewCont);
    
    var bar = Titanium.UI.createView(
		 {
		  	height:'40',width:'320',
		  	backgroundColor:'#999'
		  	
		 }
	);
    var bb1 = Titanium.UI.iOS.createTabbedBar({
    labels:[{enabled:true,title:'cast'}, {enabled:true,title:'menu'}],
    backgroundColor:'#999',
    top:5,
    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
    height:30,
    width:280,
    _view:view
    });
    bar.add(bb1);

	view.add(bar);
    
    scrollView.add(view);
    main.add(scrollView);
        
	return main;
}

function print_food(_place){
	
	
}

function print_cast(_place){
	var leftView = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);	
	
	view.add(leftView);

    Ti.API.debug("places.cast length " + _place.cast.length);

    for(var i=0;i<_place.cast.length;i++){	
		var row = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	width:'100%',
		  	left:0,	
		  	top:0,
		  	layout:'horizontal'
		 }
		);
		
		var thumb = _createThumb({},"#dedede");
		
		var titleView = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	width:'180',
		  	left:0,	
		  	top:0,
		  	layout:'vertical'
		 }
		);
		
		var placeName = Ti.UI.createLabel({
  		left:0,top:10,
  		width:Ti.UI.FILL,
  		color: '#aaa',
  		text: _place.cast[i].name,
  			font: {
         		fontSize: 42
    		}
  		});  
  		var roleName = Ti.UI.createLabel({
  		left:0,bottom:10,
  		width:Ti.UI.FILL,
  		color: '#2179ca',
  		text: _place.cast[i].role_name,
  			font: {
         		fontSize: 20
    		}
  		});
		
		
  		titleView.add(placeName);
  		titleView.add(roleName);
  			  
  	row.add(thumb);
  	row.add(titleView);  
  		
  	leftView.add(row);
  	leftView.add(_hr());
  	
	}
	
	var remainder = (3 - _place.cast.length);
	for(var i=0;i<remainder;i++){
		var row = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,
		  	width:'100%',
		  	left:0,	
		  	top:0,
		  	layout:'horizontal'
		 }
		);
		
		row.add(_createThumb({},''));
		leftView.add(row);
		leftView.add(_hr());
	}
	
	
}

function loadData(_data){
		var that = this;

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.pid = _data.pid;
		_dataStr.accessToken = Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.debug(JSON.stringify(this.responseText));
     	 var _place = JSON.parse(this.responseText);  
     	 print_food(_place);
     	 print_cast(_place);   	 
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
		  	width: 120,
		  	height: 120,
		   	_data: _data
		   	
		 }
	);
	
	var inner_bg =  Titanium.UI.createView(
		 {
		  	width: '100',
		  	height: '100',
		  	borderRadius:4,backgroundColor:_bgColor
		 }
	);
	
	outer.add(inner_bg);	
	
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

