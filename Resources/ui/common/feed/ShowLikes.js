
var portal = require('ui/common/Portal');

exports.init = function(_data){
	
	var main = Titanium.UI.createWindow({
    	title: "Likes",
    	backgroundColor: '#eee',
    	navBarHidden:false,barColor:'#cecece'
	});

	var scroll = Ti.UI.createScrollView({contentOffset:{X:80,Y:80}});
	var container = Ti.UI.createView({top:0,layout:"vertical",height:Ti.UI.SIZE});
	scroll.add(container);
	
	main.add(scroll);
	printFlair(container,_data);
	printLikes(container,_data);
	
	return main;
	
}


function printFlair(container,_data){
	
	var feed = require("ui/common/feed/FeedItem");
	var flair = feed.feedItem(_data,true,false);
	
	var cont = Ti.UI.createView({width:Ti.UI.FILL,height:Ti.UI.SIZE});
		
	cont.add(flair);	
	container.add(cont);
}


function printLikes(container,_data){
	
	var cont = Ti.UI.createView({top:10,layout:"vertical",backgroundColor:"#eee",height:Ti.UI.SIZE});
	
	for(var i=0;i<_data.likes.length;i++){
		var likeObj = _data.likes[i];
		cont.add(print_cast_data(likeObj));
	}
	
	container.add(cont);
}




function print_cast_data(_data){	
		var row = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,width:300,
		  	layout:'vertical',
		  	bottom:10,
		  	backgroundColor:'#fff',
		  	borderRadius:4,bottom:10,
		  	borderWidth:0.5,borderColor:'#ddd'
		 }
		);
		
		var img = Ti.UI.createImageView({
			width:280,top:10,
			backgroundColor:'#f1f1f1',
			borderRadius:4,
			image:_data.photo_big
		});
		row.add(img);
		
		var name_cont = Ti.UI.createView({top:0,height:Ti.UI.SIZE,layout:"horizontal"});
		
		var name_txt = Ti.UI.createLabel({
		height:Ti.UI.SIZE,
		left:10,
		width:Ti.UI.SIZE,
  		text:_data.name,
  		wordWrap:false,
  		color:'#333',
  		font: {
         fontSize: 28,
         fontWeight:'bold'
    	}
		});
		name_cont.add(name_txt);
		
		name_cont.add(add_likes(_data));
		
		
		row.add(name_cont);
		
		row.addEventListener('singletap',function(e){
			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(_data.uid,_data.name,_data.photo_big));	
		});
		
		return row;
}

function add_likes(_data){
	
	var c = Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE,layout:"horizontal"});
	
	if(_data.type == 1){
		c.add(print_individual_like(_data,1));
	}if(_data.type == 2){
		c.add(print_individual_like(_data,2));
	}else if(_data.type == 3){
		c.add(print_individual_like(_data,3));
	}else if(_data.type == 4){
		c.add(print_individual_like(_data,1));
		c.add(print_individual_like(_data,2));
	}else if(_data.type == 5){
		c.add(print_individual_like(_data,1));
		c.add(print_individual_like(_data,3));
	}else if(_data.type == 6){
		c.add(print_individual_like(_data,2));
		c.add(print_individual_like(_data,3));
	}else if(_data.type == 7){
		c.add(print_individual_like(_data,1));
		c.add(print_individual_like(_data,2));
		c.add(print_individual_like(_data,3));
	}
	
	return c;
	
}

function print_individual_like(data,_type){
	return Titanium.UI.createView({
					width:27,left:10,
					height:27,
					backgroundImage:'images/feed/like_' + _type + '_100.png'
				});
}

