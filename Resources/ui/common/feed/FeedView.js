var feed = require('ui/common/feed/FeedItem');
var login = require('ui/common/Login');
var _tableView;
var _colors = [
"ff004e",
"008aff",
"ff2a00",
"33c500",
"ff5a00",
"ffb400"
];

exports.clear = function(view){
	
};

function FeedView(feed_data,_tableView,ajaxData,_profileType,_profileId) {	
	Ti.API.debug("printing feedView");
	
		if(!_tableView){
			_tableView = Titanium.UI.createTableView(
				{
		  			backgroundColor:'#fff',
		  			top:0,height:Ti.UI.SIZE,scrollable:false,
		  			separatorStyle:Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
		  			
				});	
		}
		
		Ti.API.debug("feed.length " + feed_data.length);
		
		var _date = "";var rows = [];
	    for (var i=0; i<feed_data.length; i++){
	    		_date = feed_data[i].updated;
	    		var _row = feed.feedItem(feed_data[i],null,i,_profileType,_profileId,function(obj){
	    			Ti.API.error("deleting .." + obj);
	    			_tableView.deleteRow(obj,Titanium.UI.iPhone.RowAnimationStyle);
	    			Ti.API.error("deleted");
	    		},
	    		_colors[i%6]
	    		
	    		);	
	    		_row._parentView = _tableView;
	    		_row.isFeed = true;	
		    	rows.push(_row);
		    	

		}
		_tableView.appendRow(rows);
		
		if(feed_data.length % 5 == 0){
		var lastFid;
		if(feed_data.length > 0){
			ajaxData.lastFid = feed_data[feed_data.length-1].fid;
		}
		
		var loadMoreRow = Ti.UI.createTableViewRow({height:Ti.UI.SIZE,selectedBackgroundColor:"#fff"});
		var loadMore = Ti.UI.createLabel({
			height:Ti.UI.SIZE,top:20,bottom:20,
			width:Ti.UI.SIZE,
			text:"load more",
			color:"#999",
			font:{
				fontSize:18
			}
		});
		
		loadMore.addEventListener("click",function(e){
			e.source.setText("loading...");
			loadModeFlairs(loadMoreRow,_tableView,ajaxData,_profileType,_profileId);
		});
		
		loadMoreRow.add(loadMore);
		_tableView.loadMore = loadMoreRow;
		_tableView.appendRow(loadMoreRow);
	 }
	return _tableView;
}

function loadModeFlairs(loadMoreRow,_tableView,ajaxData,_profileType,_profileId){
		var url = "http://services.flair.me/search.php";
		ajaxData.type = "loadmore";
		ajaxData.accessToken = login.getAccessToken();


		Ti.API.error(JSON.stringify(ajaxData));

 	 	var client = Ti.Network.createHTTPClient({
     	onload : function(e) {
     		Ti.API.debug(this.responseText);
     	 	var feed_data = JSON.parse(this.responseText); 
     	 	
     	 	_tableView.deleteRow(loadMoreRow);
     	 	
			FeedView(feed_data,_tableView,ajaxData,_profileType,_profileId);	
     },
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(ajaxData);	
}




module.exports = FeedView;