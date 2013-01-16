
function FeedView(feed_data) {	

	var feed = require('ui/common/feed/FeedItem');
	Ti.API.debug("printing feedView");
	var tableData = [];
	
	var tableView = Titanium.UI.createView(
		 {
		 	layout: 'vertical',
		 	width:'100%',
		 	height: 'auto',
		 	backgroundColor:'#fff',
		 	top:0	 	
		 }
	);

		Ti.API.debug("feed.length " + feed_data.length);
		
	    for (var i=0; i<feed_data.length; i++){
	    	tableView.add(feed.feedItem(feed_data[i],null,i));	
		}	
	
	return tableView;
}

module.exports = FeedView;