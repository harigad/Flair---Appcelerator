var login = require('ui/common/Login');
var user = login.getUser();
var _textField;
var main;
var _bus;
var _btnText;
var _isFriend;
exports.init = function(bus,btnText,isFriend) {	
	_unRegCast = [];
	_bus = bus;_btnText = btnText;_isFriend = isFriend;
	
	if(!_isFriend){
		loadCast();
	}
	
	main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#eee',barColor:"#fff"
	});
	
	_draw();
	main.open();
	
	setTimeout(function(){
    	_textField.focus();
  	},200);
};

var _unRegCast = [];
function loadCast(){
	var url = "http://services.flair.me/search.php";	
	var _data = {type:"search",pid:_bus.pid || _bus.id,accessToken:login.getAccessToken()};

 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	  	 var response = JSON.parse(this.responseText);
 	  	 for(var i=0;i<response.cast.length;i++){
 	  	 	if(!!response.cast[i].photo == false){
 	  	 		_unRegCast.push(response.cast[i]);
 	  	 	}
 	  	 }
 	 },
 	 onerror: function(e){
 	 	
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 	
	
}

function _top(){	
	var cRight = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	width:Ti.UI.FILL,
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical',backgroundColor:'#fff'
		 }
	);	
		
	var flair_details = Titanium.UI.createView(
		 {
		 	left:0,
		 	width:Ti.UI.FILL,
		 	height:Ti.UI.SIZE,
		 	top:10
		 }
	);	
		
	var _header = header();
	
	_textField.addEventListener("change",function(e){
		if(e.value !==""){
			_textFieldLabl.hide();
		}else{
			_textFieldLabl.show();
		}
	});

	flair_details.add(_header);
	cRight.add(flair_details);
	
	//--------------------------------------------------------------------------------------------------------------------
	
	var cContainer = Titanium.UI.createView(
		 {
		  	backgroundColor: '#fff',
		  	left:0,
		  	right:0,
		  	bottom:0,
		  	height:Ti.UI.SIZE,
		  	layout: 'horizontal'
		 }
	);
	
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
		text:_btnText || "Invite"
	});
	
	submit.add(label);
	cRight.add(submit);
	
	cContainer.add(cRight);	
	
	submit.addEventListener("click",function(){
		var email = _textField.getValue();
		if(validateEmail(email)){
			 label.setText("sending invite...");
			 _loadCode(email);
			 main.close();
			
		}else{
			alert('not a valid email!');
		}
	});
	
	return cContainer;	
}


function _loadCode(email,mapId){
	var url = "http://services.flair.me/search.php";	
	var _data = {type:"_invite",pid:_bus.pid || _bus.id,mode:"add",email:email,accessToken:login.getAccessToken()};

	if(_isFriend){
		_data.mode="add_customer";
	}
	
	if(mapId){
		_data.mapId = mapId;
	}
	

    Ti.API.error(_data);

 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	  	 	 login.refresh();
 	  	 	   main.close();
 	 },
 	 onerror: function(e){
 	 	Ti.API.info("4");
 	 	 //searchPlaceNav.close(true,user);
		     main.close();
 		 	Ti.API.error("User.load error " + e);
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 	
	
}




function _draw(){
	var outer =  Titanium.UI.createView(
		 {
		  	width: Ti.UI.FILL,
		  	height: Ti.UI.FILL,
		  	top:0,
		  	left:0,
		  	layout:'vertical',backgroundColor:'#fff'
		 }
	);
	
	outer.add(_top());
	main.add(outer);
}

function header(){	
	var reload_btn = Ti.UI.createView({left:20,right:20,borderRadius:4,height:40,top:15,bottom:10});
	
	var search_btn = Ti.UI.createView({opacity:0.5,left:0,height:14,width:21,backgroundImage:"images/email_40_30.png"});
	
	reload_btn.add(search_btn);
	_textFieldLabl = Ti.UI.createTextField({value:"enter the email address",color:"#cecece",left:30,width:200,height:30});
	_textField = Ti.UI.createTextField({hint:"search",color:"#666",left:30,width:200,height:30});
	reload_btn.add(_textFieldLabl);
	reload_btn.add(_textField);
	var cancel_btn = Ti.UI.createView({right:0,visible:true,bubbleParent:false,height:30,width:50});
	var cancel_lbl = Ti.UI.createLabel({text:"cancel",color:"#aaa",font: {
         fontSize: 14
    	},});
	cancel_btn.add(cancel_lbl);
	reload_btn.add(cancel_btn);
	
	cancel_btn.addEventListener("singletap",function(e){
		main.close();
	});
	
	return reload_btn;
}

function clear(_view){
	for(var i=0;i<_view.children.length;i++){
			var c = _view.children[i];
			_view.remove(c);
	}
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
