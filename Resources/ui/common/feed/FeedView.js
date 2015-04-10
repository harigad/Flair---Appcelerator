var feed = require('ui/common/feed/FeedItem');
var newCast = require('ui/common/feed/NewCast');
var _grayView;
var _tableView;

exports.clear = function(view){
	
};

function FeedView(feed_data,_tableView,loadMoreCallBack,scroll,disableMoreBtn,_profileType,_profileId) {	
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
	    		});	
	    		_row._parentView = _tableView;
	    		_row.isFeed = true;	
		    	rows.push(_row);
		    	

		}
		_tableView.appendRow(rows);
	 
	return _tableView;
}






module.exports = FeedView;