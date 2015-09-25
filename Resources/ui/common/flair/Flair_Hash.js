

exports.init = function(callback,name) {	
	_places = [];
	serverSearchTimout = null;
	var main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#fff',barColor:"#fff"
	});
	
	main.add(header(main,callback,name));
	
	main.open();
	setTimeout(function(){
    	_textField.focus();
  },200);
  
  
};

var _textField;
var _textFieldLabl;

function header(main,callback,name){	
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
	
	var sayText = "";
	
	if(name){
	 sayText = "say \nnice\nthings \nabout \n" + name;
	}else{
	 sayText = "say \nnice\nthings";
	}
	
	_textFieldLabl = Ti.UI.createTextArea({
	value:sayText,color:"#cecece",left:0,right:0,height:300,top:0,editable:false,
	height:Ti.UI.SIZE,
	font:{
		fontSize:40
	}
	});
	_textField = Ti.UI.createTextArea({hint:"search",color:"#666",left:0,right:0,height:280,top:0,
	keyboardToolbar: toolbar,maxLength: 140,suppressReturn:false,
	font:{
		fontSize:40
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
