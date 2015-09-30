

exports.open = function(data,callBack){
var _colors = [
"ff004e",
"008aff",
"ff2a00",
"33c500",
"ff5a00",
"ffb400"
];

	var win = Ti.UI.createWindow({
		backgroundColor:"#fff",
		theme : "Theme.AppCompat.Translucent.NoTitleBar"
	});
	
	var scroll = Ti.UI.createScrollView({
		top:0
	});
	
	var v = Ti.UI.createView({
		layout:"vertical",
		left:10,top:60,
		right:10,bottom:20,
		height:Ti.UI.SIZE
	});
	
	scroll.add(v);
	
	var title = Ti.UI.createLabel({
		top:0,
		text:"Does this email belong any of the below flairees ?",
		height:Ti.UI.SIZE,
		bottom:20
	});
	v.add(title);
	
	Ti.API.error("#### " + JSON.stringify(data));
	Ti.API.error("##### " + JSON.stringify(data.length));
	
	for(var i=0;i<data.length;i++){
		Ti.API.error("# " + data[i]);
		Ti.API.error("## " + JSON.stringify(data[i]));
		Ti.API.error("### " + JSON.stringify(data));
		
		var c = Ti.UI.createView({
			borderRadius:4,
			backgroundColor:"#" + _colors[i],
			bottom:0.5,
			height:Ti.UI.SIZE,
			uid:data[i].uid
		});
		
		var t = Ti.UI.createLabel({
			text:data[i].name,
			height:Ti.UI.SIZE,
			top:20,color:"#fff",
			bottom:20,
			width:Ti.UI.SIZE
		});	
		c.add(t);
		v.add(c);
		
		c.addEventListener("click",function(e){
			callBack(e.source.uid);
			win.close();
		});
		
	}
	
	var cn = Ti.UI.createView({
			borderRadius:4,
			backgroundColor:"#999",
			bottom:0.5,height:Ti.UI.SIZE
		});
		var tn = Ti.UI.createLabel({
			text:"NONE OF THE ABOVE",
			height:Ti.UI.SIZE,
			top:20,color:"#fff",
			bottom:20,
			width:Ti.UI.SIZE
		});	
		cn.add(tn);
		v.add(cn);
		
		cn.addEventListener("click",function(e){
			callBack();
			win.close();
		});
	
	win.add(scroll);
	win.open();
	
};
