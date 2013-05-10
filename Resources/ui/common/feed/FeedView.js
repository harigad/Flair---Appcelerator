
function FeedView(feed_data,_tableView) {	

	var feed = require('ui/common/feed/FeedItem');
	Ti.API.debug("printing feedView");
	
		if(!_tableView){
			_tableView = Titanium.UI.createView(
				{
		  			width: '320',layout:'vertical',
		  			backgroundColor:'#eee'
				});	
		}

		Ti.API.debug("feed.length " + feed_data.length);
		
	    for (var i=0; i<feed_data.length; i++){
	    	var _row = feed.feedItem(feed_data[i],null,i);	
	    	_row._parentView = _tableView;	
		    _tableView.add(_row);
		}
	
	return _tableView;
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


module.exports = FeedView;