
function FeedView(feed_data,_tableView) {	

	var feed = require('ui/common/feed/FeedItem');
	Ti.API.debug("printing feedView");
	
		if(!_tableView){
			_tableView = Titanium.UI.createTableView(
				{
		  			width: '320',
		  			top:0,backgroundColor:'#eee'
				});	
		}

		Ti.API.debug("feed.length " + feed_data.length);
		
	    for (var i=0; i<feed_data.length; i++){
	    	var _row = feed.feedItem(feed_data[i],null,i);		
	    	_tableView.appendRow(_row);
		}
	
	return _tableView;
}

module.exports = FeedView;