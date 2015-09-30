
var login = require('ui/common/Login');

exports.init = function(place){
	var _main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#fff',barColor:"#fff",
    	theme : "Theme.AppCompat.Translucent.NoTitleBar"
	});
	
	_draw(place,_main);
	_main.open();
	
};

function _draw(_place,_main){
	var user = login.getUser();
	var cContainer = Titanium.UI.createView(
		 {
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);
	
	
	var rest = Ti.UI.createImageView({
		image:"/images/restricted.jpg",
		bottom:10
	});
	
	cContainer.add(rest);
	
	
	
	var submit = Ti.UI.createView({
		top:20,
		left:20,right:20,
		borderRadius:4,height:Ti.UI.SIZE,
		backgroundColor:"#ff004e"
	});
	var label = Ti.UI.createLabel({
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		top:15,bottom:15,color:"#fff",
		text:"Apply for Mangement Access"
	});
	
	submit.add(label);
	cContainer.add(submit);	
	
	submit.addEventListener("click",function(){
		var pid = _place.pid || _place.id;
		Titanium.Platform.openURL('http://access.flair.me?pid=' + pid + "&uid=" + user.getId());
	});
	
	
	var cancel = Ti.UI.createView({
		top:20,
		left:20,right:20,
		borderRadius:4,height:Ti.UI.SIZE,
		backgroundColor:"#999"
	});
	var label = Ti.UI.createLabel({
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		top:15,bottom:15,color:"#fff",
		text:"cancel"
	});
	
	cancel.add(label);
	cContainer.add(cancel);
	
	cancel.addEventListener("click",function(){
		_main.close();
	});
	
	_main.add(cContainer);	
	
	
	
	
	
}
