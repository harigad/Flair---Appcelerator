var portal = require('ui/common/Portal');
var like_pofile = require('ui/common/feed/LikeProfile');

function print_like(_data,c,_flair){
	if(_data.type == 1){
		c.add(print_individual_like(_data,1,_flair));
	}if(_data.type == 2){
		c.add(print_individual_like(_data,2,_flair));
	}else if(_data.type == 3){
		c.add(print_individual_like(_data,3,_flair));
	}else if(_data.type == 4){
		c.add(print_individual_like(_data,1,_flair));
		c.add(print_individual_like(_data,2,_flair));
	}else if(_data.type == 5){
		c.add(print_individual_like(_data,1,_flair));
		c.add(print_individual_like(_data,3,_flair));
	}else if(_data.type == 6){
		c.add(print_individual_like(_data,2,_flair));
		c.add(print_individual_like(_data,3,_flair));
	}else if(_data.type == 7){
		c.add(print_individual_like(_data,1,_flair));
		c.add(print_individual_like(_data,2,_flair));
		c.add(print_individual_like(_data,3,_flair));
	}
	
	return c;
}


function print_individual_like(likeObj,_type,_flair){
   	var photo = likeObj.photo;
				
				var like_container = Titanium.UI.createView({
					width:35,
					height:35,
					backgroundImage:'images/feed/like_thumb_' + _type + '.png',
					top:0,
					bubbleParent: false				
				});			
				
				var like_user = Ti.UI.createImageView({
  					image: photo,
  					width:23,
  					height:23,borderRadius:2,
  					top:6,bottom:6
  				});
  				
  				like_container.add(like_user);
  				
  				like_container.addEventListener('singletap',function(e){
  						var win = require('ui/common/feed/ShowLikes');
			            portal.open(win.init(_flair));	
  				});
  				
   				return like_container;
}

exports.init = function(_data){
	var likeView = Titanium.UI.createView({
		layout:'horizontal',
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		left:0,
		top:0
	});
	
	_render(_data,likeView);
	return likeView;
}


function clearView(thisView){
	var len = thisView.children.length;
	while(thisView.children.length>0){
		thisView.remove(thisView.children[0]);
	}
}

function _render(_data,likeView){	
	clearView(likeView);
	var likeImageStr;
	
	if(_data.isLiked && _data.isLiked !== 0 && _data.isLiked !== "0"){
		likeImageStr = 'images/feed/liked.png';
	}else{
		likeImageStr = 'images/feed/like_blue.png';
	}
	var like_btn = Ti.UI.createImageView({
  			image: likeImageStr,
  			left:0,right:0,top:5,bottom:5,
   			width:35,bubbleParent:false
	});
	like_btn.addEventListener('singletap',function(){
				like_pofile.init(_data,likeView,_render);
	});
	likeView.add(like_btn);	

if(_data.likes){
	if(_data.likes.length>0){
		var like_len = 7;
		if(_data.likes.length<7){
			likes_len = _data.likes.length;
		}
		for(var j=0;j<likes_len;j++){
			var likeObj = _data.likes[j];
			if(likeObj && likeObj.type){
				print_like(likeObj,likeView,_data);	
  			}
		}
	}	
}	
	
return likeView;
	
}