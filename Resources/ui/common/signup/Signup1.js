var plateField;
var passwordField;
var main;
exports.init = function(_callBack){
	main = Ti.UI.createWindow({
		backgroundImage:'images/signup/bg.png'
	});
	
	var logo = Ti.UI.createImageView({
  		image:'images/logo.png',
  		bottom:20
	});

 	plateField = Ti.UI.createTextField({
  		value:'',
  		left:10,
  		right:10,
  		height:40,
  		hintText:'Car Licence Plate #',
  		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_ALL,
  		returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE  		
	});

	var zipField = Ti.UI.createTextField({
  		value:'',
  		height:40,
  		hintText:'Zipcode',
  		left:10,
  		right:10,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		returnKeyType:Titanium.UI.RETURNKEY_DONE  		
	});

	var btn = Titanium.UI.createButton({
   		title:'Create My Car Key',
 	  	top: 10,
 		width: 280,
   		height: 40
	});
	

	btn.addEventListener('singletap', function(){
		process(_callBack);
	});
	plateField.addEventListener('return', function(event) {
  		passwordField.focus();
	});
	zipField.addEventListener('return', function(event) {
  		// submit your form here
	});

	var view = Titanium.UI.createView(
		 {
		 	width: 'auto',
		 	height:'auto',
		 	layout: 'vertical',
		 	top:50
		 }
	);	
		view.add(logo);
		
		var fieldView = Titanium.UI.createView(
		 	{
		 		width: '280',
		 		height:'auto',
		 		layout: 'vertical',
		 		backgroundColor: '#ffffff',
		 		borderRadius: 4
		 	}
		);			
		
			fieldView.add(plateField);
			fieldView.add(Titanium.UI.createView({width: '100%',	height:'1',	backgroundColor: '#cecece'	}));			
			fieldView.add(zipField);
			
		view.add(fieldView);
		view.add(btn);	
		
	main.add(view);
	
	var activityIndicator = Ti.UI.createActivityIndicator({
  		color: 'green',
  		font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
  		message: 'Loading...',
 		// style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
  		top:'30%',
  		left:'50%',
  		height:'auto',
  		width:'auto'
	});
	//activityIndicator.show();	
	//main.add(activityIndicator);
	
	main.open();
}

function process(_callBack){
	var url = "http://services.flair.me/carkey/secure.php?page=signup2";	
	var _data = "plate=" + plateField.value + "&state=TX";
		_data = _data + "&accessToken=" + Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         var response = JSON.parse(this.responseText);
         if(!response.status){
				 var dialog = Ti.UI.createAlertDialog({
    				message: response.error,
    				ok: 'Okay',
    				title: 'Oops!'
  					}).show();        	
         }else{
         		var signup2 = require('ui/common/signup/Signup2');
				signup2.init(_callBack,response);
				main.close();
         }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert('error');
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 
}
