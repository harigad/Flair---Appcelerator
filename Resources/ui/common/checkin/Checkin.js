var main;
var _data;
var _place;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');

exports.init = function(place,data,callBack){	
	_place = place;
	_data = data;
	_callBack = callBack;
	main = Ti.UI.createWindow({top:1000});	
	
	var trans = Titanium.UI.createView(
		 {
		 	left:0,right:0,
		 	top:0,bottom:0,
		 	height:'auto',
		 	backgroundColor:"#777",
		 	opacity:0.7
		 }
	);
	
	var view = Titanium.UI.createView(
		 {
		 	height:Ti.UI.SIZE,
		 	backgroundColor:"transparent",
		 	bubbleParent:false
		 }
	);	
	
	trans.addEventListener("click",function(e){
		var slide_it_down = Titanium.UI.createAnimation();
    	slide_it_down.top = 1000; // to put it back to the left side of the window
    	slide_it_down.duration = 300;	
		main.close(slide_it_down);
	});
	
	view.addEventListener("click",function(e){
		var slide_it_down = Titanium.UI.createAnimation();
    	slide_it_down.top = 1000; // to put it back to the left side of the window
    	slide_it_down.duration = 300;	
		main.close(slide_it_down);
	});
	
	main.add(trans);
	main.add(view);
	
	var line = Ti.UI.createView({
		backgroundColor:"#fff",
		height:200,
		width:3,
		top:45
	});
	
	view.add(line);
	
	var black_btn = Ti.UI.createView({
		width:95,height:95,top:0,
		backgroundImage:"images/checkin/black_btn_95_95.png"
	});
	
	var outer = Titanium.UI.createImageView(
		 {
		  	backgroundColor:'#ccc',
		  	width:'50',height: '50',borderWidth:3,borderColor:"#333",
		  	image:_data.photo,
		  	borderRadius:25
		 }
	);
	black_btn.add(outer);
	
	view.add(black_btn);
	
	var white_btn = Ti.UI.createView({
		width:95,height:95,top:220,
		backgroundImage:"images/checkin/white_btn.png",
		bubbleParent:false
	});
	view.add(white_btn);
	
var olt = Titanium.UI.create3DMatrix(), curX, curY;
var delta = 0;
var _state = 0;

white_btn.addEventListener('touchstart', function(e) {
	if(_state === 2)return;
    curX = e.x;
    curY = e.y;
});
white_btn.addEventListener('touchmove', function(e) {
	if(_state === 2)return;
	
    var deltaY = e.y - curY;
    delta = delta + deltaY;
    Ti.API.info(delta);
    
   // if(delta < -220 ){
   // 	delta = -220;
   // 	deltaY = - 220 - deltaY;
   // }
    
    olt = olt.translate(0, deltaY, 0);
    white_btn.animate({
        transform : olt,
        duration : 100
    });
    line.setHeight(200 + delta);
});

white_btn.addEventListener('touchend', function(e) {
	if(_state === 2)return;
	var line_height = 200;
	var anim_time = 500;
	if(delta < - 100){
		delta = 220 + delta;
		line_height = 0;
		anim_time = 300;
		_state = 1;
	}
    olt = olt.translate(0, -delta, 0);
    delta = 0;
    white_btn.animate({
        transform : olt,
        duration : anim_time
    },function(){
    	if(_state === 1){
    		send_to_server();
    		var gifImages = [];
			for(var i=11;i<=23;i++){
				gifImages.push("images/gif/ajax-loader/ajax-loader_00" + (24-i) + "_Layer-" + i + ".png");
			}
			var loading_icon = Ti.UI.createWebView({
						url:"images/gif/index.html",
						width:52,height:52,
						backgroundColor:"#40a3ff"
					});
			white_btn.add(loading_icon);
			
    		  var slide_to_center = Titanium.UI.createAnimation();
    			slide_to_center.top = 200; // to put it back to the left side of the window
    			slide_to_center.duration = 500;	
				view.animate(slide_to_center,function(){
					_state = 2;
					var lbl = Ti.UI.createLabel({
					color:"#fff",
					text:"saving",
					top:100,
					width:Ti.UI.SIZE,
					height:Ti.UI.SIZE
					});
			view.add(lbl);
				});//
    	}
    }); 
    
    var slide_it_top = Titanium.UI.createAnimation();
    slide_it_top.height = line_height; // to put it back to the left side of the window
    slide_it_top.duration = anim_time;	
	line.animate(slide_it_top);//
	 
});
	
	//main.add(view);
	var slide_it_top = Titanium.UI.createAnimation();
    slide_it_top.top = 0; // to put it back to the left side of the window
    slide_it_top.duration = 300;	
	main.open(slide_it_top);//
};

function _details(_data){
	


}

function send_to_server(){
  		var  url="http://services.flair.me/nominate.php";
		var _dataStr = {};
			
		_dataStr.place = _place.id;
		_dataStr.recipient = _data.uid;
		_dataStr.accessToken=login.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	Ti.API.info("------->" + this.responseText);
     	 
     	 if(this.responseText === -1 || this.responseText === "-1"){
     	 		login.logout();
     	 		login.init(function(){
					send_to_server();
				},function(){
					//_flairWin.close();
				});
				return;
     	 }
     	 
     	 var _result = JSON.parse(this.responseText);  
     	 
     	 if(_result.stickers){    
		 	   Ti.API.debug("flair true");
		 	   _callBack(_result);
		 	   _close();
		 	   login.getUser().load(function(){
		 	   	
		 	   });
	 	 }else{
     	 	    Ti.API.error("flair false"); 
     	 }
     	
     },
     onerror : function(e) {
         Ti.API.error("Sending Flair to Server " + e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);
}

function _close(){
		var slide_it_down = Titanium.UI.createAnimation();
    	slide_it_down.top = 1000; // to put it back to the left side of the window
    	slide_it_down.duration = 300;	
		main.close(slide_it_down);
}
