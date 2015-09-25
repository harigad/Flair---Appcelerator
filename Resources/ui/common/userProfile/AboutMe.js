var login = require('ui/common/Login');
var user = login.getUser();
var _textField;
var main;

exports.init = function(aboutme,callback) {	
	main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#eee',barColor:"#fff"
	});
	
	_draw(aboutme,callback);
	main.open();
	
	setTimeout(function(){
    	_textField.focus();
  	},200);
};

function _top(aboutme,callback){	
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
		
	var _header = header(aboutme,callback);
	
	_textField.addEventListener("change",function(e){
		if(e.value !==""){
			_textFieldLabl.hide();
		}else{
			_textFieldLabl.show();
		}
	});
	
	if(_textField.value !==""){
			_textFieldLabl.hide();
		}else{
			_textFieldLabl.show();
		}

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
	
	cContainer.add(cRight);	
	
	return cContainer;	
}


function _update(aboutme){
	var url = "http://services.flair.me/search.php";	
	var _data = {type:"aboutme",text:aboutme || '',accessToken:login.getAccessToken()};
	login.getUser().setAbout(aboutme);
	
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 
 	 },
 	 onerror: function(e){
 	 	
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 
 		main.close();	
	
}




function _draw(aboutme,callback){
	var outer =  Titanium.UI.createView(
		 {
		  	width: Ti.UI.FILL,
		  	height: Ti.UI.FILL,
		  	top:0,
		  	left:0,
		  	layout:'vertical',backgroundColor:'#fff'
		 }
	);
	
	outer.add(_top(aboutme,callback));
	main.add(outer);
}

function header(about,callback){	
	var reload_btn = Ti.UI.createView({left:20,right:20,height:Ti.UI.SIZE,top:25});
	
	
var send = Titanium.UI.createButton({
    title: 'Send',
    style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
});

var cancel = Titanium.UI.createButton({
    systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
});

flexSpace = Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

send.addEventListener("click",function(){
	callback(_textField.getValue());
	main.close();
	_update(_textField.getValue());
});

cancel.addEventListener("click",function(){
	callback();
	main.close();
});	


var toolbar = Titanium.UI.iOS.createToolbar({
    items:[cancel, flexSpace, send],
    bottom:0,
    borderTop:true,
    borderBottom:false
});

	
	//reload_btn.add(search_btn);
	_textFieldLabl = Ti.UI.createTextArea({
	value:"say \nsometghing \nabout \nyourself",color:"#cecece",left:0,right:0,height:300,top:0,editable:false,
	height:Ti.UI.SIZE,
	font:{
		fontSize:22
	}
	});
	_textField = Ti.UI.createTextArea({value:about || '',color:"#666",left:0,right:0,height:280,top:0,
	keyboardToolbar: toolbar,maxLength: 140,suppressReturn:false,
	font:{
		fontSize:22
	}});

	reload_btn.add(_textField);
	reload_btn.add(_textFieldLabl);
	var cancel_btn = Ti.UI.createView({right:0,visible:true,bubbleParent:false,height:30,width:50});
	var cancel_lbl = Ti.UI.createLabel({text:"cancel",color:"#aaa",font: {
         fontSize: 14
    	},});
	//cancel_btn.add(cancel_lbl);
	//reload_btn.add(cancel_btn);
	
	cancel_btn.addEventListener("singletap",function(e){
		callback(false);
		main.close();
	});
	
	_textField.addEventListener("change",function(e){

		if(e.value !==""){
			_textFieldLabl.hide();
		}else{
			_textFieldLabl.show();
		}
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
