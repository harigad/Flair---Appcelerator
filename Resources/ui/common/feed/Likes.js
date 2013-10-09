var portal = require('ui/common/Portal');
var like_pofile = require('ui/common/feed/LikeProfile');

function print_like(_data,c,_flair){
Ti.API.error("Like 1");
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
	Ti.API.error("Like 2");
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
		Ti.API.error("like 1");
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
	for(var i=0;i<len;i++){
		thisView.remove(thisView.children[i]);
	}
}

function _render(_data,likeView){	
	clearView(likeView);
	Ti.API.error("like 2");
	var likeImageStr;
	
	if(_data.isLiked){
		likeImageStr = 'images/feed/liked.png';
	}else{
		likeImageStr = 'images/feed/like_blue.png';
	}
	Ti.API.error("like 3");
	var like_btn = Ti.UI.createImageView({
  			image: likeImageStr,
  			left:0,right:0,top:5,bottom:5,
   			width:35,bubbleParent:false
	});
	like_btn.addEventListener('singletap',function(){
				like_pofile.init(_data,likeView,_render);
	});
	likeView.add(like_btn);	
	Ti.API.error("like 4");
if(_data.likes){
	if(_data.likes.length>0){
		var like_len = 7;
		if(_data.likes.length<7){
			likes_len = _data.likes.length;
		}
Ti.API.error("like 5");
		for(var j=0;j<likes_len;j++){
			Ti.API.error("like 6");
			var likeObj = _data.likes[j];
			Ti.API.error("like 61");
			if(likeObj && likeObj.type){
				Ti.API.error("like 62");
				print_like(likeObj,likeView,_data);	
  			}
		}
	}	
}	
	
return likeView;
	
}