var main;
var amtField,ccField,expField;

exports.init = function(_callBack,_data){
 main = Ti.UI.createWindow({
		backgroundImage:'images/signup/bg.png'
	});

 var logo = Ti.UI.createImageView({
  image:'images/48/' + _data.logo
 });
 
 var modelName = Ti.UI.createLabel({
  		width:'auto',
  		height:'auto',
  		color: '#fff',
  		bottom: 10,
  		text: _data.model,
  			font: {
         		fontSize: 40
    		}
  }); 	

 amtField = Ti.UI.createTextField({
 	value:'',
 	left:10,
 	right:10,
 	height: 40,
  	hintText: '$0.00',
  	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
 });

 ccField = Ti.UI.createTextField({
 	value:'',
 	left:10,
 	right:10,
 	height: 40,
  	hintText: 'credit card number',
  	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
 });

 expField = Ti.UI.createTextField({
 	value:'',
 	left:10,
 	right:10,
  	height: 40,
  	hintText: 'MMYY',
  	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  	returnKeyType:Titanium.UI.RETURNKEY_DONE
 });

 var btn = Titanium.UI.createButton({
	title: 'Verify My Ownership',
    top: 10,
    width: 280,
    height: 40
 });

 btn.addEventListener('singletap', function(){
	process(_callBack);
 });


 amtField.addEventListener('return', function(event) {
    //passwordField.focus();
 });
 ccField.addEventListener('return', function(event) {
  // submit your form here
 }); 
 expField.addEventListener('return', function(event) {
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
		view.add(modelName);
		
		var fieldView = Titanium.UI.createView(
		 	{
		 		width: '280',
		 		height:'auto',
		 		layout: 'vertical',
		 		backgroundColor: '#ffffff',
		 		borderRadius: 4
		 	}
		);
		
			fieldView.add(amtField);
				var line1 = Titanium.UI.createView({width: 300, height:1, backgroundColor: '#cecece' });
				fieldView.add(line1);
			fieldView.add(ccField);
				var line2 = Titanium.UI.createView({width: 300, height:1, top:1, backgroundColor: '#cecece' });
				fieldView.add(line2);
			fieldView.add(expField);
			
		view.add(fieldView);
		view.add(btn);
 
 main.add(view);
 main.open();
}

function process(_callBack){
	var url = "http://services.flair.me/carkey/secure.php?page=ccprocess";	
	var _data = "amt=" + amtField.value + "&ccField=" + ccField + "&expField=" + expField;
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
         		main.close();
         		_callBack();
         }
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 
}
