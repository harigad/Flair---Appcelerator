var _callBack;
var _container;
var login = require('ui/common/Login');

exports.init = function(_data,_cont,_call) {
	Ti.API.debug("printing feedProfile");

    _callBack = _call;
    _container = _cont;

	var main = Ti.UI.createWindow({			
    	hideNavBar:true,modal:true,
    	backgroundColor:'#fff',
    	theme : "Theme.AppCompat.Translucent.NoTitleBar"
	});

	var outer =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 'auto',
		  	top:0,
		  	left:0,
		  	layout:'vertical'
		 }
	);
	
	
	outer._food_btn = _create(main,_data,3,_data.food,'#99452b','#c26447',false,_data.isLiked);	
	outer._place_btn = _create(main,_data,2,_data.placename,'#54733e','#84ab68',true,_data.isLiked);
	//outer._recp_btn = _create(main,_data,1,_data.recipientname,'#40a3ff','#40a3ff',true,_data.isLiked);	
	var cancel_btn = Titanium.UI.createView(
		 {
		  	width: Ti.UI.FILL,
		  	height: 100,
		  	backgroundColor:'#eee'
		 }
	);
	
	var label = Ti.UI.createLabel({
		width:Ti.UI.SIZE,
  		text:"I'm done",
  		wordWrap:false,
  		color:'#999',
  		font: {
         fontSize: 20
    	}		
	});
	
	main.addEventListener("close",function(e){
				login.init(function(){
					processLike(_data,main);
				});
	});
	
	
	cancel_btn.addEventListener("singletap",function(e){
		main.close();	
	});
	
	cancel_btn.add(label);
	outer._cancel_btn = cancel_btn;
	outer.add(outer._cancel_btn);
	outer.add(outer._food_btn);
	outer.add(outer._place_btn);
	//outer.add(outer._recp_btn);
	
	
	main._outer = outer;
	main.add(outer);

	main.open({modal:true,modalTransitionStyle:Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL});
	
}


function _create(main,_data,_type,_name,_bgColor,_color,_showHr,_isLiked){
	var outer =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 160,
		  	left:0,
		  	layout: 'horizontal'
		 }
	);
	
	outer._type = _type;
	
	var likedImage;
	
	var thisIsLiked = getIsLiked(_type,_isLiked);

	if(_type && thisIsLiked){
		outer._isLiked = true;
		likedImage = '/images/feed/like_' + _type + '_100.png';
	}else if(_type){
		outer._isLiked = false;
		likedImage = '/images/feed/like_gray_100.png';
	}else{
		outer._isLiked = false;
	    likedImage = "/images/feed/like_cancel_100.png";	
	}	
		
	var inner =  Titanium.UI.createView(
		 {
		  	width: 50,
		  	height: 50,
		  	borderRadius:4,
		  	left:20,
		  	top:16,
		  	backgroundImage:likedImage
		 }
	);
	
	outer._image = inner;
	
	var name_txt = Ti.UI.createLabel({
		height:'40',
		left:20,
		width:'230',
  		text:_name,
  		wordWrap:false,
  		color:_bgColor,
  		top:25,
  		font: {
         fontSize: 30,
         fontWeight: 'bold'
    	}		
	});
	
	if(_showHr){
		outer.add(_hr());
	}
	
	outer.add(inner);
	outer.add(name_txt);
	
	outer.addEventListener('singletap', function(e){
		likeClicked(outer);
	});
	
	return outer;
	
}


function getIsLiked(_type,isLiked){
	if(_type == isLiked || isLiked == 7){
		return true;
	}else if(_type == 1 && (isLiked == 4 || isLiked == 5)){
		return true;
	}else if(_type == 2 && (isLiked == 4 || isLiked == 6)){
		return true;
	}else if(_type == 3 && (isLiked == 5 || isLiked == 6)){
		return true;	
	}else{
		return false;
	}
	
}


function getLikeNumber(place,food,recp){
	if(recp && place && food){
		return 7;
	}else if(place && food){
		return 6;
	}else if(recp && food){
		return 5;
	}else if(recp && place){
		return 4;
	}else if(food){
		return 3;
	}else if(place){
		return 2;
	}else if(recp){
		return 1;
	}else{
		return 0;
	}
}

function likeClicked(_likeObj){
  if(_likeObj._type){
	if(_likeObj._isLiked){
		_likeObj._isLiked = false;
		_likeObj._image.setBackgroundImage("/images/feed/like_gray_100.png");
	}else{
		_likeObj._isLiked = true;
		_likeObj._image.setBackgroundImage("/images/feed/like_" + _likeObj._type + "_100.png");
	}
  }
}

function processLike(_data,main){
	   _data.isLiked = getLikeNumber(main._outer._place_btn._isLiked,main._outer._food_btn._isLiked);
	
		var that = this;

		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		
		_dataStr.type = "like";
		_dataStr.likeType = _data.isLiked;
		
		_dataStr.action = "add";
		
		if(_data.fid){
		  _dataStr.fid = _data.fid;
		}
		
		_dataStr.accessToken=login.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.debug('loaded data from processLike ' + _data.isLiked);
     	 Ti.API.debug('loaded new likes ' + this.responseText);
     	  var response = JSON.parse(this.responseText);
     	  _data.likes = response;
     	 
     	 _callBack(_data,_container);
     },
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);
		


}




function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: '/images/feed/like_hr.png',
		  	height:2,
		  	bottom:0,
		  	width:'320'
		 }
	);
}