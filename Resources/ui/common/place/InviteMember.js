var main;
var _tableView;
var _db = require('ui/common/data/DB');
var Portal = require('ui/common/Portal');
var _callBack;
var _textField;
var _places;

var serverSearchTimout;
var pleaseWaitTimeout;

exports.init = function(callBack) {	
	_places = [];
	serverSearchTimout = null;
	main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#eee',barColor:"#fff"
	});
	
	_draw();
	open(callBack);
};

exports.reset = function(){
	_textField.setText("");
};

function open(callBack){
	_callBack = callBack;
	
	Portal.getPlaces(function(places){
		_places = places;
	});
	
	main.open();
	setTimeout(function(){
    	_textField.focus();
    	//_update(_textField);
		//_callBack();
	},200);
	
};

function _draw(){
	var outer =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: '100%',
		  	top:0,
		  	left:0,
		  	layout:'vertical',backgroundColor:'#f1f1f1'
		 }
	);
	
	outer.add(_top());
	
	_helpView = Ti.UI.createView({
			top:50,
  	 	    height:'Ti.UI.SIZE'
	});
	var _helpText = Ti.UI.createLabel({
		width:200,
		height:200,color:"#ccc",
		text:"please enter your teammate's email address!"
	});
	_helpView.add(_helpText);
	outer.add(_helpView);
	main.add(outer);
}


function _top(){	
	var cRight = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	width:Ti.UI.FILL,
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical'
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
	
	_textField.addEventListener("change",function(){
		   //_update();
	});

	flair_details.add(_header);
	cRight.add(flair_details);
	
	//--------------------------------------------------------------------------------------------------------------------
	
	var cContainer = Titanium.UI.createView(
		 {
		  
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


function header(){	
	var reload_btn = Ti.UI.createView({top:10,bottom:15,layout:'horizontal',width:300,borderRadius:4,height:Ti.UI.SIZE,top:15});
	var search_btn = Ti.UI.createView({opacity:0.4,left:0,height:30,width:30,backgroundImage:"images/email_49_49.png"});
	
	reload_btn.add(search_btn);
	
	_textField = Ti.UI.createTextField({
		hint:"search",color:"#000",left:10,width:250,height:30,
  		keyboardToolbar:keyboardToolBar()
		});
	reload_btn.add(_textField);
	return reload_btn;
}

function keyboardToolBar(){
	var send = Titanium.UI.createButton({
    title : 'Send Invite',
    style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});

	var cancel = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});
	cancel.addEventListener('click',function(e){
		  _textField.blur();
	      main.close();
	});
	send.addEventListener('click',function(e){
		  _textField.blur();
	      main.close();
	      _callBack(_textField.getValue());
	});

	var flexSpace = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var keyboardBar = Titanium.UI.iOS.createToolbar({
 		items:[cancel,flexSpace, send],
		animated: false, 
		height: 60,
		width: Ti.UI.FILL
	});
	
	return keyboardBar;
}


