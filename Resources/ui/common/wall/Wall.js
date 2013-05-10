var scroll;
var feed;
var pull_to_refresh = require('ui/common/components/PullToRefresh');
var login = require('ui/common/Login');
exports.init = function(_type){
	var name;
	
	if(_type == "friends"){
		name = "friends";
	}else{
		name = "friends";
	}
	
	var main = Titanium.UI.createWindow({
    	title: name,
    	backgroundColor: '#eee',
    	navBarHidden:false
	});

	scroll = Ti.UI.createScrollView({contentOffset:{X:80,Y:80}});
	
	pull_to_refresh.init(scroll,function(){
		loadData(_type);
	});
	
	main.add(scroll);
	
	loadData(_type);
	
	return main;
}

function print(_feed){
	if(feed){
		scroll.remove(feed);
	}
		
	var FeedView = require('ui/common/feed/FeedView');
	var feed = new FeedView(_feed);	
	
	scroll.add(feed);

}

function loadData(_type){
		var that = this;

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = _type;
		_dataStr.accessToken = login.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.debug('loaded data for Wall -> ' + _type);
     	 var _feed = JSON.parse(this.responseText);  
     	 print(_feed);   	 
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
