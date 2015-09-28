var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var win = require('ui/common/userProfile/UserProfile');

exports.init = function(data,color){
	return draw(data,color);
};

function draw(data,color,v){
	data.likes = data.likes || [];
	if(v){
		v.removeAllChildren();
		
	}else{
	 v = Ti.UI.createView({
		layout:'horizontal',
		height:Ti.UI.SIZE
	});
		
	}
	
	var like_photo = Titanium.UI.createImageView(
		 {
		  	width:'25',height: '25',backgroundColor:(data.isLiked ? color : "#999"),
		  	image:"/images/like_gray.png",right:5,opacity:0.3,bubbleParent:false
		 }
	);
	like_photo.addEventListener("click",function(){
		login.init(function(){
			toggle(data,color,v);
		});
	});
	
	v.add(like_photo);

	for(var i=0;i<data.likes.length;i++){
		var p = Ti.UI.createImageView({
			width:25,height:25,borderRadius:12.5,right:5,borderWidth:3,borderColor:"#eee",
			image:data.likes[i].photo,
			user:data.likes[i],
			bubbleParent:false
		});	
		
		p.addEventListener("click",function(e){
			portal.open(win.init(e.source.user.uid,e.source.user.name,e.source.user.photo_big,e.source.user.photo));	
		});
		v.add(p);
	}
	
	return v;
};


function toggle(data,color,v){
	var user = login.getUser();
	if(data.isLiked){
		data.isLiked = false;
		
		for(var i=0;i<data.likes.length;i++){
			if(data.likes[i].uid === user.getId()){
				data.likes.splice(i, 1);
			}
		}
		
		
		update(data);	
	}else{
		data.isLiked = true;
		
		data.likes.unshift({
			uid:user.getId(),
			name: user.getName(),
			fid:data.fid,
			photo:user.getPhoto(),
			photo_big:user.getPhotoBig()
		});
		
		update(data);
	}
	
	draw(data,color,v);
	
}


function update(data){
var url = "http://services.flair.me/search.php";	
	var _data = {type:"like_a_flair",fid:data.fid,accessToken:login.getAccessToken()};
 	 	
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	Ti.API.info(this.responseText);
 	 	//do nothing
 	 },
 	 onerror: function(e){
 		 	//do nothing
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data);
}	
