
function FeedView(feed_data,_tableView,loadMoreCallBack,scroll,disableMoreBtn) {	


	var feed = require('ui/common/feed/FeedItem');
	Ti.API.debug("printing feedView");
	
		if(!_tableView){
			_tableView = Titanium.UI.createView(
				{
		  			width: '320',layout:'vertical',
		  			backgroundColor:'#eee'
				});	
		}
		
		if(_tableView._loadMoreBtn){
			_tableView.remove(_tableView._loadMoreBtn);
		}
		if(_tableView._noItemsBtn){
			_tableView.remove(_tableView._noItemsBtn);
		}
		

		Ti.API.debug("feed.length " + feed_data.length);
		
		var _date = "";
	    for (var i=0; i<feed_data.length; i++){
	    	_date = feed_data[i].updated;
	    	var _row = feed.feedItem(feed_data[i],null,i);	
	    	_row._parentView = _tableView;	
		    _tableView.add(_row);
		}
		
		Ti.API.debug("_tableView.children.length " + _tableView.children.length);
		if(_tableView.children.length < 2 && loadMoreCallBack) {
			var noItemsBtn = Titanium.UI.createView({
			width:Ti.UI.FILL,
			height:Ti.UI.SIZE,
			left:10,right:10,top:'40%'
			
		});
		
		var noItemsBtn_header = Ti.UI.createLabel({
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			top:10,
  			text:"no flairs to show you yet!",
  			color:'#aaa',
  			font: {
         	fontSize: 20
    		}	
		});
		
		var noItemsBtn_txt = Ti.UI.createLabel({
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			top:40,
  			text:"reload",
  			color:'#2179ca',
  			font: {
         	fontSize: 18
    		}	
		});
		
		noItemsBtn.add(noItemsBtn_header);
		noItemsBtn.add(noItemsBtn_txt);
		noItemsBtn._noItemsBtn_txt = noItemsBtn_txt;
		
		noItemsBtn.addEventListener('click',function(e){
			noItemsBtn._noItemsBtn_txt.setColor("#999");
			noItemsBtn_header.hide();
			noItemsBtn._noItemsBtn_txt.setText("loading...");
			loadMoreCallBack();
		});
		
		_tableView.add(noItemsBtn);
		_tableView._noItemsBtn = noItemsBtn;
			
		}
		
		
		if(feed_data.length === 5 && disableMoreBtn !== true){
		
		var loadMoreBtn = Titanium.UI.createView({
			width:Ti.UI.FILL,
			height:50,
			left:10,right:10,top:10,bottom:10,
			backgroundColor:'#fff',
			borderRadius:4,
			borderWidth:0.5,
			borderColor:'#ddd'
		});
		
		loadMoreBtn.date = _date;
		
		var loadMoreBtn_txt = Ti.UI.createLabel({
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			top:20,bottom:20,
  			text:"load more",
  			color:'#2179ca',
  			font: {
         	fontSize: 11
    		}	
		});
		
		loadMoreBtn.add(loadMoreBtn_txt);
		loadMoreBtn._loadMoreBtn_txt = loadMoreBtn_txt;
		
		loadMoreBtn.addEventListener('click',function(e){
			loadMoreBtn._loadMoreBtn_txt.setColor("#999");
			loadMoreBtn._loadMoreBtn_txt.setText("loading...");
			loadMoreCallBack(loadMoreBtn.date);
		});
		
		_tableView.add(loadMoreBtn);
		_tableView._loadMoreBtn = loadMoreBtn;
	 }
	 
	 if(scroll){
	 	scroll.setContentHeight(_tableView.getHeight());
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