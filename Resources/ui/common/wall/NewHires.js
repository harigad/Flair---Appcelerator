var portal = require('ui/common/Portal');
var scroll;
var pull_to_refresh = require('ui/common/components/PullToRefresh');
var login = require('ui/common/Login');
var container;

exports.init = function(_type){
	var name;
		
	var main = Titanium.UI.createWindow({
    	title: "stars",
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

function print(cast,_loadMore){
	if(container && !_loadMore){
		scroll.remove(container);
	}

	if(container){
		if(container._loadMoreBtn){
			container.remove(container._loadMoreBtn);	
		}
		if(container._noItemsBtn){
			container.remove(container._noItemsBtn);
		}
	}
	
	if(!_loadMore){
		container = Ti.UI.createView({top:10,left:10,right:10,bottom:10,width:Ti.UI.FILL,height:Ti.UI.SIZE,layout:'vertical'});
		scroll.add(container);
	}

	var date;
	for(var i=0;i<cast.length;i++){
		container.add(print_cast_data(cast[i]));	
		_date = cast[i].updated;
	}

	if(cast.length === 5){
		_loadMoreBtn(container,function(){
			loadData(true,_date);
		});
	}
	
	_noDataToShow(container,function(){
			loadData(true);
	});
		
	
	
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

function loadData(_loadMore,_date){
		var that = this;

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "new_hires";
		_dataStr.accessToken = login.getAccessToken();
		if(_date){
			_dataStr.date = _date;
		}
		
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	Ti.API.info(this.responseText);
     	 Ti.API.debug('loaded data for new_hires ' + this.responseText);
     	 var _feed = JSON.parse(this.responseText);  
     	 print(_feed,_loadMore);   	 
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


function _noDataToShow(_tableView,loadMoreCallBack){
	
	if(_tableView.children.length < 2) {
			var noItemsBtn = Titanium.UI.createView({
			width:Ti.UI.FILL,
			height:Ti.UI.SIZE,
			left:10,right:10,top:'40%'
			
		});
		
		var noItemsBtn_header = Ti.UI.createLabel({
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			top:10,
  			text:"no stars to show you yet!",
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
}


function _loadMoreBtn(_tableView,loadMoreCallBack){
	var loadMoreBtn = Titanium.UI.createView({
			width:Ti.UI.FILL,
			height:50,
			left:0,right:0,top:0,bottom:10,
			backgroundColor:'#fff',
			borderRadius:4,
			borderWidth:0.5,
			borderColor:'#ddd'
		});
		
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
			loadMoreCallBack();
		});
		
		_tableView._loadMoreBtn = loadMoreBtn;
		_tableView.add(loadMoreBtn);
		
}