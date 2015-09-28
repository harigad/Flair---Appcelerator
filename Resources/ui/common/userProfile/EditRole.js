var login = require('ui/common/Login');
var user = login.getUser();
var _textField;
var main;
var _rid;

var _callBack;

exports.init = function(rid,titleTxt,callBack) {	
	_rid = rid,_callBack = callBack;
	
	main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#eee',barColor:"#fff"
	});
	
	_draw(titleTxt);
	main.open();
	
	setTimeout(function(){
    	_textField.focus();
  	},200);
};

function _top(titleTxt){	
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
		
	var _header = header(titleTxt);
	
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
		text:"Update Title"
	});
	
	submit.add(label);
	cRight.add(submit);
	
	cContainer.add(cRight);	
	
	submit.addEventListener("click",function(){
		var role = _textField.getValue();
		if(role !=="" ){
			 label.setText("saving...");
			 _callBack(role);
			 _updateRole(role);
			 main.close();
		}
	});
	
	return cContainer;	
}


function _updateRole(title){
	var url = "http://services.flair.me/search.php";	
	var _data = {type:"jobtitle",rid:_rid,title:title,accessToken:login.getAccessToken()};

 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	Ti.API.error(this.responseText);
 	 },
 	 onerror: function(e){
 	 
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data);
	
}




function _draw(titleTxt){
	var outer =  Titanium.UI.createView(
		 {
		  	width: Ti.UI.FILL,
		  	height: Ti.UI.FILL,
		  	top:0,
		  	left:0,
		  	layout:'vertical',backgroundColor:'#fff'
		 }
	);
	
	outer.add(_top(titleTxt));
	main.add(outer);
}

function header(titleTxt){	
	var reload_btn = Ti.UI.createView({left:20,right:20,borderRadius:4,height:40,top:15,bottom:10});
	
	var search_btn = Ti.UI.createView({opacity:0.5,left:0,height:14,width:21,backgroundImage:"/images/email_40_30.png"});
	
	reload_btn.add(search_btn);
	_textFieldLabl = Ti.UI.createTextField({value:"enter a job tile",color:"#cecece",left:30,width:200,height:30});
	_textField = Ti.UI.createTextField({value:titleTxt || "",color:"#666",left:30,width:200,height:30});
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