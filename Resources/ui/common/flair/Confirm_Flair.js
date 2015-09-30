
exports.init = function(person,placename,callback){
	var _email;
	var _hash;
	var main = Ti.UI.createWindow({
		backgroundColor:"#fff",
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		theme : "Theme.AppCompat.Translucent.NoTitleBar"
	});
	
	var v = Ti.UI.createView({
		height:Ti.UI.SIZE,
		layout:"vertical"
	});
	
	var logo = Ti.UI.createImageView({
		image:"/images/flair_app_icon_with_background_371_371.png",
		height:150,width:150,bottom:10
	});
	v.add(logo);
	
	var n = Ti.UI.createLabel({
		text:"Saving...",bottom:20,textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color:"#ff004e",height:Ti.UI.SIZE,
		font:{
			fontSize:40
		}
	});v.add(n);
	
	var at = Ti.UI.createLabel({
		text:"@",textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color:"#008aff",opacity:0.7,
		font:{
			fontSize:36
		}
	});//v.add(at);
	
	var p = Ti.UI.createLabel({
		text:placename,top:20,textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color:"#ff004e",
		font:{
			fontSize:20
		}
	});//v.add(p);
	
	var btns = Ti.UI.createView({
		height:Ti.UI.SIZE,top:20,
		layout:"vertical",
		opacity:0
	});
	
	v.add(btns);
		
	var b = Ti.UI.createView({
		height:60,
		left:20,right:20,top:10,
		borderRadius:4,
		backgroundColor:"#ff2a00"
	});
	var label = Ti.UI.createLabel({
		text:"add thank you note",
		font:{
			fontSize:12,
			fontWeight:"bold"
		},
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,color:"#fff"
	});
	b.add(label);
	btns.add(b);
	
    b.addEventListener("click",function(){
    	var hash = require('ui/common/flair/Flair_Hash');
    	hash.init(function(h){
    			callback(h);
    			main.close();
    	},person);
    });
		
	var bt = Ti.UI.createView({
		height:60,top:10,
		left:20,right:20,
		borderRadius:4,
		backgroundColor:"#ff004e"
	});
	var bt_inner = Ti.UI.createView({
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		layout:"horizontal"
	});
	var img = Ti.UI.createImageView({
		image:"/images/glasses_45_white.png",
		height:20,right:5
	});
	var labelt = Ti.UI.createLabel({
		text:"send flair",
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,color:"#fff",
		font:{
			fontSize:18,
			fontWeight:"bold"
		}
	});
	bt_inner.add(img);
	bt_inner.add(labelt);
	bt.add(bt_inner);
	btns.add(bt);
	
	bt.addEventListener("click",function(){
    callback(_hash,_email);
    var animation = Titanium.UI.createAnimation();
	animation.opacity = 0;
	animation.duration = 500;		
    	main.close(animation);
    });
	

	main.add(v);
	
	main.open();
	
	setTimeout(function(){
		n.setText("Saved!");
		btns.animate({
			opacity:1,duration:1500
		});
	},2000);
};
