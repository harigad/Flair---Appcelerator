
var portal = require('ui/common/Portal');

exports.init = function(_data){
	
	var main = Titanium.UI.createWindow({
    	title: "Likes",
    	backgroundColor: '#fff',
    	navBarHidden:false,barColor:'#fff',
    	theme : "Theme.AppCompat.Translucent.NoTitleBar"
	});

	var scroll = Ti.UI.createScrollView({contentOffset:{X:80,Y:80}});
	var container = Ti.UI.createView({top:0,layout:"vertical",height:Ti.UI.SIZE});
	scroll.add(container);
	
	main.add(scroll);
	printFlair(container,_data);
	printLikes(container,_data);
	
	return main;
	
};


function printFlair(container,_data){
	
	var feed = require("ui/common/feed/FeedItem");
	var flair = feed.feedItem(_data,true,false);
	
	var cont = Ti.UI.createView({width:Ti.UI.FILL,height:Ti.UI.SIZE});
		
	cont.add(flair);	
	container.add(cont);
}


function printLikes(container,_data){
	
	var cont = Ti.UI.createView({top:10,layout:"vertical",backgroundColor:"#fff",height:Ti.UI.SIZE});
	
	for(var i=0;i<_data.likes.length;i++){
		var likeObj = _data.likes[i];
		cont.add(print_cast_data(likeObj,_data));
	}
	
	container.add(cont);
}

function print_cast_data(_data,_flair){	
		var row = Titanium.UI.createView(
		 {
		  	height: Ti.UI.SIZE,width:300,
		  	layout:'vertical',
		  	bottom:10
		 }
		);
		
		var img = Ti.UI.createImageView({
			width:280,top:5,
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
  		color:'#40a3ff',
  		font: {
         fontSize: 28,
         fontWeight:'bold'
    	}
		});
		name_cont.add(name_txt);
		
		name_cont.add(add_likes(_data,_flair));
		
		
		row.add(name_cont);
		
		row.addEventListener('singletap',function(e){
			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(_data.uid,_data.name,_data.photo_big));	
		});
		
		return row;
}

function add_likes(_data,_flair){
	
	var c = Ti.UI.createLabel({color:"#999",font:{fontSize:10},height:Ti.UI.SIZE,width:Ti.UI.SIZE,layout:"horizontal"});
	var text;
	
	
	if(_data.type == 1){
		text = _flair.recipientname;
	}if(_data.type == 2){
		text = _flair.placename;
	}else if(_data.type == 3){
		text = _flair.food;
	}else if(_data.type == 4){
		text = _flair.recipientname + " & " + _flair.placename;
	}else if(_data.type == 5){
		text = _flair.recipientname + " & " + _flair.food;
	}else if(_data.type == 6){
		text = _flair.food + " & " + _flair.placename;
	}else if(_data.type == 7){
		text = _flair.food + ", " + _flair.food + " & " + _flair.recipientname;
	}
	
	c.setText(text);
	return c;
	
}

function print_individual_like(data,_type){

}

