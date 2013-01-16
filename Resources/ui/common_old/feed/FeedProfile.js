var loading;
var view;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');	
var user = login.getUser();
			
exports.init = function(_data) {
	Ti.API.debug("printing feedProfile");

	var main = Ti.UI.createWindow({	
		backgroundColor: '#fff',
    	title: "details",    	
    	barColor:'#aaa',
    	barImage: 'images/headerBg.jpg'
	});

	var scrollView = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 320,
  		top:0
	});
	
	var view_container = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 'auto',
		  	layout: 'vertical'
		 }
	);
	
	view = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 'auto',
		  	top:2,
		  	layout: 'vertical'
		 }
	);	
	
	var feed = require('ui/common/feed/FeedItem');	
	view_container.add(feed.feedItem(_data,true));
	view_container.add(_commentsField(_data.fid));
	view_container.add(view);
	
	scrollView.add(view_container);
	
	main.add(scrollView);
	
	portal.open(main);
	
	loadAndPrint(_data.fid);
	
}

function _del(_object){
	var dialog = Ti.UI.createAlertDialog({
    	cancel: -1,
    	buttonNames: ['Delete', 'Cancel'],
    	message: 'Delete Comment?'
    });
    
    dialog.addEventListener('click', function(e){
      	Ti.API.debug('edit share dialog button clicked with index ' + e.index);
    	if (e.index === 0){
    		process(_object._data,"delete");
      		view.remove(_object);      		
    	}else{
    		//do nothing
    	}
    	
    });
    
    dialog.show();
}


function _commentsField(fid){
	var cView = Titanium.UI.createView(
		 {
		  	height: 'auto',
		  	backgroundColor: '#eee',
		  	width:300,
		  	borderRadius:4,
		  	top:5,bottom:5
		 }
	);	
	
/*	
	var send = Titanium.UI.createButton({
    title : 'Send',
    style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});

	var cancel = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});

	var flexSpace = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	keyboardToolbar : [cancel, flexSpace, camera, flexSpace, send],
    keyboardToolbarColor : '#999',
    keyboardToolbarHeight : 40,
*/
	
	var comments_txt = Ti.UI.createTextField({
		value:'',
		height:40,
		left:10,
		right:10,
  		hintText:'add comment',
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		_fid:fid  		
	});
	
	comments_txt.addEventListener('return',function(e){
		Ti.API.debug('return clicked ' + this.value);
		if(this.value !== ""){
			
		    var _new = {};
		    	_new.uid = user.getId();
		    	_new.name = user.getName();
		    	_new.photo = user.getPhoto();
		    	_new.coid = "";
		    	_new.data = this.value;
		    	_new.likes = 0;
		    	_new.fid = this._fid;
		    var newC = _create(_new,true);
			view.add(newC);
			process(_new,'add',newC);

		}
	});
	
	cView.add(comments_txt);
	return cView;
}

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/hr.png',
		  	backgroundRepeat: true,
		  	height:2,
		  	width:'100%'
		 }
	);
}

function _create(_data,_showHR){
	Ti.API.debug("creating comment");		
	var thumb = Ti.UI.createImageView({
  			image: _data.photo,
  			width: '50',
  			height: '50',
  			left: 10,
  			top:8,
  			bottom:5	
	});		
	
	var cRight = Titanium.UI.createView(
		 {
		  	left:5,
		  	top:8,
		  	width:220,
		  	height:'auto',
		  	layout: 'vertical'
		 }
	);

	var name_txt = Ti.UI.createLabel({
		height:'auto',
		left:0,
		width:'auto',
  		text:_data.name,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		color:'#2179ca',
  		font: {
         fontSize: 14
    	}		
	});
	var comments_txt = Ti.UI.createLabel({
		height:'auto',
		left:0,
		width:'auto',
  		text:_data.data,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		font: {
         fontSize: 14
    	},
    	color:'#666' 		
	});
	cRight.add(name_txt);
	cRight.add(comments_txt);	
	
	var likeView = Titanium.UI.createView(
		 {
		  	left:0,
		  	bottom:5,
		  	top:0,
		    height:'auto',
		  	layout: 'horizontal'
		 }
	);	
	
	var like_btn = Ti.UI.createImageView({
  			image: 'images/feed/like_blue.png',
  			left:0,right:10,
  			top:0,
  			height:15,
  			_title: "_like"
	});
	
	like_btn.addEventListener('click',function(){
		if(!_data.liked){
			this.setImage('images/feed/liked.png');
			_data.liked = true;
		}else{
			this.setImage('images/feed/like_blue.png');
			_data.liked = false;	
		}
	});
	
	var likeMaker = require('ui/common/feed/Likes');
	cRight.add(likeMaker.init(_data));
	cRight.add(likeView);
	
	var cContainer = Titanium.UI.createView(
		 {
		  	backgroundColor: '#fff',
		  	left:10,
		  	right:10,
		  	height:'auto',
		  	borderRadius:4,
		  	bottom:2,
		  	layout: 'horizontal',
		  	coid: _data.coid,
		  	_data:_data,
		  	_name_txt: name_txt,
		  	_comments_txt: comments_txt
		 }
	);	
	
	if(_showHR == true){
		cContainer.add(_hr());
	}
	
	cContainer.add(thumb);
	cContainer.add(cRight);
	
	if(_data.uid !== user.getId()) {
		//create one event to delete the comment
		cContainer.addEventListener('click',function(){
			_del(this);
		});
	}else{
		
		cContainer.addEventListener('click',function(e){
			if(e.source._title != "like"){
				this._cancelClick = true;			
				this.setBackgroundColor('#fff');
				this._name_txt.setColor("#2179ca");
				this._comments_txt.setColor("#666");
				var win = require('ui/common/userProfile/UserProfile');
				portal.open(win.init(this._data.uid,this._data.name,this._data.photo));
			}	
		});
		
		cContainer.addEventListener('touchstart',function(e){
			this._cancelClick = false;
			var that = this;
			if(e.source._title != "like"){
				setTimeout(function(){
					if(that._cancelClick !== true){
						that.setBackgroundColor('#2179ca');
						that._name_txt.setColor("#fff");
						that._comments_txt.setColor("#fff");
					}
				}, 300 );
			}
		});
		
		cContainer.addEventListener('touchend',function(e){
			this.setBackgroundColor('#fff');
			this._name_txt.setColor("#2179ca");
			this._comments_txt.setColor("#666");
		});
		
		cContainer.addEventListener('touchmove',function(e){
			this._cancelClick = true;
			this.setBackgroundColor('#fff');
			this._name_txt.setColor("#2179ca");
			this._comments_txt.setColor("#666");
		});
		
	}
	
	return cContainer;
}


function process(data,action,_view){
	var that = this;

		var url = "http://flair.me/search.php";
		var _data = "&type=comments&action=" + action;
		_data = _data + "&coid=" + data.coid + "&data=" + data.data + "&fid=" + data.fid;
		_data = _data + "&accessToken=" + Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
     	 Ti.API.debug('loaded data from addComment ');
         if(this.responseText &&  _view){
         	 Ti.API.debug('loaded data for addComment status=true');
         	 _view.coid = this.responseText;    	
         }else{
         	  Ti.API.debug('loaded data for editShare status=false');
         	
         }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data);
		
	}
	

function loadAndPrint(fid) {
	var that = this;

		_clearView();
		var loading = Ti.UI.createImageView({
  			image: 'images/loading_white.gif',
  			width: '150',
  			top: 0	
		});	
		view.add(loading);

		var url = "http://flair.me/search.php";
		var _data = "&type=comments&action=get";
		_data = _data + "&fid=" + fid;
		_data = _data + "&accessToken=" + Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
     	_clearView();
     	 Ti.API.debug('loaded data from addComment ');
     	 var coms = JSON.parse(this.responseText);
         if(coms){         	
         	for (var i=0; i<coms.length; i++){
         		if(i == 0){
         			view.add(_create(coms[i],false));
         		}else{
         			view.add(_create(coms[i],true));	
         		}
			}	         	     	
         }else{
         	  Ti.API.error('cannot load comments ' + this.responseText);         	
         }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data);
		
}

function _clearView(){
	for(var i=0;i<view.children.length;i++){
		Ti.API.debug("_clearView: deleting children " + i);
		var v = view.children[i];
		view.remove(v);
	}
}
