var portal = require('ui/common/Portal');
var like_pofile = require('ui/common/feed/LikeProfile');

exports.init = function(_data){
	var likeView = Titanium.UI.createView({
		layout:'horizontal',
		width:'120',
		height:'50',
		left:0,
		top:0,
		bottom:5
	});
	
	
	var likeImageStr;
    Ti.API.debug(_data.liked);
	if(_data.liked){
		likeImageStr = 'images/feed/liked.png';
	}else{
		likeImageStr = 'images/feed/like_blue.png';
	}
	
	var like_btn = Ti.UI.createImageView({
  			image: likeImageStr,
  			left:0,
   			width:35,bubbleParent:false
	});
	like_btn.addEventListener('singletap',function(){
		if(!_data.liked){
			//processLike("add",_data);
			//this.setImage('images/feed/liked.png');
			//_data.liked = true;
			like_pofile.init(_data);
		}else{
			processLike("delete",_data);
			this.setImage('images/feed/like_blue.png');
			_data.liked = false;	
		}
	});
	likeView.add(like_btn);	
if(_data.likes){
	if(_data.likes.length>0){
		var like_len = 7;
		if(_data.likes.length<7){
			likes_len = _data.likes.length;
		}

		for(var j=0;j<likes_len;j++){
			var likeObj = _data.likes[0];
			if(likeObj){
				var photo = likeObj.photo;
				
				var like_container = Titanium.UI.createView({
					width:'auto',
					height:'auto',
					backgroundImage:'images/feed/like_thumb_1.png',
					top:0					
				});			
				
				var like_user = Ti.UI.createImageView({
  					image: photo,
  					width:23,
  					height:23,
  					left:6,top:6,right:6,bottom:6
  				});
  				
  				like_container.add(like_user);
  				
  				like_container.addEventListener('singletap',function(){
  					var win = require('ui/common/userProfile/UserProfile');
					portal.open(win.init(_data.uid,_data.name,_data.photo));
  				});
  				
  				likeView.add(like_container);	
  			}
		}
	}	
}	
	
return likeView;
	
}