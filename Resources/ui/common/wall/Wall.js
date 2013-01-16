exports.init = function(_type){
	var name;
	
	if(_type == "friends"){
		name = "friends";
	}else{
		name = "near by";
	}
	
	var main = Titanium.UI.createWindow({
    	title: name,    	
    	barColor:'#333',
    	backgroundColor: '#eee'
	});

	var view = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 320,
  		top:0
	});
	
	main.add(view);
	
	loadData(_type,view);
	
	return main;
}

function print(_feed,view){
	var FeedView = require('ui/common/feed/FeedView');
	var feed = new FeedView(_feed);	
	view.add(feed);
}

function loadData(_type,view){
		var that = this;

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = _type;
		_dataStr.accessToken = Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.debug('loaded data for Wall -> ' + _type);
     	 var _feed = JSON.parse(this.responseText);  
     	 print(_feed,view);   	 
     },
     onerror : function(e) {
     	 Ti.API.error('error loading data for Wall -> ' + _type);
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
}
