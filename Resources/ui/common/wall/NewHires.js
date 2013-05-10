var portal = require('ui/common/Portal');
var scroll;
var pull_to_refresh = require('ui/common/components/PullToRefresh');
var login = require('ui/common/Login');
var container;

exports.init = function(_type){
	var name;
		
	var main = Titanium.UI.createWindow({
    	title: "starring",
    	backgroundColor: '#eee',
    	navBarHidden:false
	});

	scroll = Ti.UI.createScrollView({top:0,left:0,width:Ti.UI.FILL,height:Ti.UI.FILL});
    main.add(scroll);

	pull_to_refresh.init(scroll,function(){
		loadData();
	});
	
	loadData();
	
	return main;
}

function print(cast){
	
	if(container){
		scroll.remove(container);
	}
	
	container = Ti.UI.createView({top:10,left:10,right:10,bottom:10,width:Ti.UI.FILL,height:Ti.UI.SIZE,layout:'vertical'});
	scroll.add(container);
	
	for(var i=0;i<cast.length;i++){
		container.add(print_cast_data(cast[i]));	
	}
			
}	

function print_cast_data(_data){	
		var row = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,width:300,
		  	layout:'vertical',backgroundColor:'#fff',
		  	borderRadius:4,bottom:10,
		  	borderWidth:0.5,borderColor:'#ddd'
		 }
		);
		
		var img = Ti.UI.createImageView({
			width:280,top:10,right:10,left:10,
			backgroundColor:'#f1f1f1',
			borderRadius:4,
			image:_data.photo_big
		});
		
		var name_txt = Ti.UI.createLabel({
		height:Ti.UI.SIZE,
		left:10,
		top:5,
		width:Ti.UI.FILL,
  		text:_data.name,
  		wordWrap:false,
  		color:'#333',
  		font: {
         fontSize: 18,
         fontWeight:'bold'
    	}
		});
		
		var placeName = Ti.UI.createLabel({
  		left:10,right:10,top:0,bottom:10,height:Ti.UI.SIZE,
  		color: '#2179ca',
  		text: "@ " + _data.place + ", " + _data.city,
  			font: {
         		fontSize: 14
    		}
  		});
		
		row.add(img);
		row.add(name_txt);
		row.add(placeName);
		
		row.addEventListener('singletap',function(e){
			  var placeView = require('ui/common/place/Place');
		      portal.open(placeView.init({
		      	vicinity:_data.city,
		      	lat:_data.lat,
		      	lng:_data.lng,
		      	pid:_data.pid,
		      	name:_data.place
		      	}));
		});
		
		return row;
}

function loadData(){
		var that = this;

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "new_hires";
		_dataStr.accessToken = login.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.debug('loaded data for new_hires ' + this.responseText);
     	 var _feed = JSON.parse(this.responseText);  
     	 print(_feed);   	 
     },
     onerror : function(e) {
     	 Ti.API.error('error loading data for new_hires');
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
		 	backgroundImage:_data.photo_big,
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


