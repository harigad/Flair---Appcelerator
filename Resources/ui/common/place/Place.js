var _lat;
var _lng;
var portal = require('ui/common/Portal');
exports.init = function(_data){
	var main = Ti.UI.createWindow({	
	 	
    	barColor:'#333',
    	backgroundColor: '#eee' 	
	});
	
	loadData(_data);

	return main;
}

function print(_place){
	var view = Titanium.UI.createView(
		 {
		  	height: '500',
		  	layout: 'vertical'
		 }
	);	
	main.add(view);
	
	var addrView = Titanium.UI.createView(
		 {
		  	height: '25',
		  	width:'100%',
		  	left:0,	
		  	top:0,
		  	backgroundColor:'#666'
		 }
	);
	
	var addrLabel = Ti.UI.createLabel({
  		left:10,
  		top:5,
  		bottom:5,
  		width:'auto',
  		height:'auto',
  		color: '#fff',
  		text: _place.city,
  			font: {
         		fontSize: 11
    		}
  		});  
  		
  	addrView.add(addrLabel);  	
	view.add(addrView);  	
	
	_lat = parseFloat(_place.lat);
	_lng = parseFloat(_place.lng);
	if(_lat && _lng){
		//do nothing
	}else{
		_lat = 0.02;
		_lng = 0.08;
	}	
	
	/*mapView = Titanium.Map.createView({
    	mapType: Titanium.Map.STANDARD_TYPE,
    	width:320,
    	height:100,
    	top:0,
    	region:{latitude:_lat, longitude:_lng, latitudeDelta:0.001, longitudeDelta:0.001},
    	animate:true
	});
	//view.add(mapView);*/
	
	if(_place.feed){
		var FeedView = require('ui/common/feed/FeedView');
		var feed = new FeedView(_place.feed);
		view.add(feed);
	}
	
}

function print_cast(_place){
	var view = Titanium.UI.createView(
		 {
		  	height: 'auto',
		  	layout: 'vertical'
		 }
	);	
	main.add(view);
	
	for(var i=0;i<_place.cast.length;i++){	
		var row = Titanium.UI.createView(
		 {
		  	height: 'auto',
		  	width:'100%',
		  	left:0,	
		  	top:0,
		  	layout:'vertical'
		 }
		);
		
		var thumb = Ti.UI.createImageView({
  			image: _place.cast[i].photo_big,
  			width: '100%'		
		});	
		
		var titleView = Titanium.UI.createView(
		 {
		  	height: 'auto',
		  	width:'100%',
		  	left:0,	
		  	top:0,
		  	backgroundColor:'#eee',
		  	layout:'vertical'
		 }
		);
		
		var placeName = Ti.UI.createLabel({
  		left:10,top:10,
  		width:'auto',
  		color: '#999',
  		text: _place.cast[i].name,
  			font: {
         		fontSize: 16
    		}
  		});  
  		var roleName = Ti.UI.createLabel({
  		left:10,bottom:10,
  		width:'auto',
  		color: '#2179ca',
  		shadowColor: '#aaa',
  		shadowOffset: {x:1, y:1},
  		text: _place.cast[i].role_name,
  			font: {
         		fontSize: 25
    		}
  		});
		
		
  		titleView.add(placeName);
  		titleView.add(roleName);
  			  
  	row.add(thumb);	
  	row.add(titleView);  	
  	view.add(row);
  	
	}
}

function loadData(_data){
		var that = this;
		if(_data.lat && _data.lng){
			print(_data,sview);
			return;
		}		

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "search";
		_dataStr.searchMode = "place";
		_dataStr.pid = _data.pid;
		_dataStr.accessToken = Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.debug('loaded data for Place -> ' + _data.pid);
     	 var _feed = JSON.parse(this.responseText);  
     	 print(_feed);
     	 //print_cast(_feed,sview2);   	 
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
