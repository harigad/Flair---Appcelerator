



exports.init = function(name,placename){
	
	var main = Ti.UI.createWindow({
		backgroundColor:"#40a3ff",
		width:Ti.UI.FILL,backgroundImage:"images/blue.png",
		height:Ti.UI.FILL
	});
	
	var v = Ti.UI.createView({
		height:Ti.UI.SIZE,
		layout:"vertical"
	});
	
	var n = Ti.UI.createLabel({
		text:name,bottom:20,textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color:"#fff",
		font:{
			fontSize:20
		}
	});v.add(n);
	
	var at = Ti.UI.createLabel({
		text:"@",textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color:"#fff",opacity:0.7,
		font:{
			fontSize:36
		}
	});v.add(at);
	
	var p = Ti.UI.createLabel({
		text:placename,top:20,textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color:"#fff",
		font:{
			fontSize:20
		}
	});v.add(p);
	
	main.add(v);
	
	var animation = Titanium.UI.createAnimation();
	animation.opacity = 1;
	animation.duration = 300;
	animation.addEventListener("complete",function(){
		
		 setTimeout(function(){
			var aanimation = Titanium.UI.createAnimation();
			    aanimation.opacity = 0;
			    aanimation.duration = 1000;
			main.close(aanimation);
		 },1500);
		
	});
	main.open(animation);
	
};
