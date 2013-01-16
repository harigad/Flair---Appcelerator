var login = require('ui/common/Login');
var user = login.getUser();
var results_view;
var _txtField;
var _zipField;
var main;
var nav_container;
var nav;
var portal = require('ui/common/Portal');

exports.launch = function(){
	if(main){
		initialize();
	}else{
		init();	
	}
}

exports.close = function(_refresh){
	main.close();
	if(_refresh){
		var profile = require('ui/common/userProfile/UserProfileView');
		profile.refresh();
	}
}


function init(){
	main = Titanium.UI.createWindow({
    	backgroundColor: '#eee',
    	hideNavBar: true 	
	});
	
	var main_view = Titanium.UI.createView(
	{
		  	width: '100%',
		  	height: 'auto',
		  	top:0,
		  	layout: 'vertical'
	});
	main.add(main_view);
		
	main_view.add(_form());	
	
	var scrollView = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 320,
  		top:0
	});
	main_view.add(scrollView);
	
	results_view = Titanium.UI.createView(
	{
		  	width: '100%',
		  	height: 'auto',
		  	top:5,
		  	layout: 'vertical'
	});	
	scrollView.add(results_view);
	
	_show_tip();

	initialize();	
}	


function initialize(){
	if(user.getPlace().code){
		var accessCode = require('ui/common/userProfile/AccessCode');
		accessCode.launch(null,user.getPlace());
 	}else{		
		main.open();	
	}
}




function _show_tip(){
	clear(results_view);	
	
	var tip = Titanium.UI.createView(
	{
		  	width: 302,
		  	height:217,
		  	top:20,
		  	backgroundImage: 'images/profile/whichrest.png'
	});	
	
	results_view.add(tip);	
}



function _form(){
	var _container = Titanium.UI.createView(
	{
		  	width: '100%',
		  	height: 'auto',
		
		  	backgroundColor: '#fff',
		  	layout: 'vertical'
	});	
	
	_txtField = Ti.UI.createTextField({
  		value:'',
  		width:280,
  		top:10,bottom:5,
  		backgroundColor:'#eee',
  		hintText:'restaurant/cafe',
  		returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		font: {
         		fontSize: 16
    		}		
	});	
	_container.add(_txtField);
	
	var _newLine = Titanium.UI.createView(
	{
		  	width: '100%',
		  	height: 'auto',		
		  	layout: 'horizontal',
		  	left:20,right:20
	});	
	_container.add(_newLine);
	
	_zipField = Ti.UI.createTextField({
  		value:'',
  		width:100,
  		top:5,bottom:10,
  		backgroundColor:'#eee',
  		hintText:'zipcode',
  		returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		font: {
         		fontSize: 16
    		}		
	});	
	_newLine.add(_zipField);
	
	
	var _search_btn_label = Ti.UI.createLabel({
		top:5,
		bottom:10,
  		width:82.5,
  		left:10,
  		color: '#fff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		text: "Search",
  		backgroundColor: '#2179ca',
  		borderRadius: 4,
  			font: {
         		fontSize: 18
    		}
  	});
	_newLine.add(_search_btn_label);
	_search_btn_label.addEventListener('click',function(){
		_search();
	});
	
	var _cancel_btn_label = Ti.UI.createLabel({
		top:5,
		bottom:10,
  		width:82.5,
  		left:5,
  		color: '#fff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		text: "Cancel",
  		backgroundColor: '#999',
  		borderRadius: 4,
  			font: {
         		fontSize: 18
    		}
  	});
	_newLine.add(_cancel_btn_label);
	
	_cancel_btn_label.addEventListener('click',function(){
		var searchPlace = require('ui/common/userProfile/SearchPlace');
		searchPlace.close(false);
	});
	
	
	return _container;
}

function _search(){
	Ti.API.debug("SearchPlace.search " + _txtField.value);
	
	var _txt = _txtField.value;
	var _zipcode = _zipField.value;
	
	_txt = _txt.replace(/^\s+|\s+$/g,'');
	_zipcode = _zipcode.replace(/^\s+|\s+$/g,'');
	
	if(_txt === "" || _zipcode === ""){
		_show_tip();
		return;		
	}	
	
	if(_isValidPostalCode(_zipcode,"US") !== true){
		 var dialog = Ti.UI.createAlertDialog({
    				message: "Invalid ZipCode!",
    				ok: 'Okay',
    				title: 'Oops!'
  		});
  		dialog.show();  	
		return;
	}
	
	var that = this;
	
	var url = "http://flair.me/search.php";	
	var _data = {type:"search",searchMode:"place",search:_txt,city:_zipcode,accessToken:Ti.Facebook.getAccessToken()};
		
	Ti.API.debug("User.load sending data " + _data);
	
 	 	clear(results_view);
 	 	
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	
 	 	 var _response = JSON.parse(this.responseText);
         for(var x =0;x<_response.length;x++){
        	
        	var _c = Titanium.UI.createView(
		 {
		  	left:0,
		  	right:0,
		  	top:0,bottom:0,
		  	width:'100%',
		  	height:'auto',
		  	layout: 'vertical',
		  	_data: _response[x]
		 }
	);	
	
  	var _txt = Ti.UI.createLabel({
  		left:20,
     	height:'auto',
     	width: 'auto',
		color:'#2179ca',
  		text:_response[x].name,
  		font: {
         fontSize: 14
    	}
	});
  	_c.add(_txt);
	
	var _vicinity = Ti.UI.createLabel({
  		left:20,
     	height:'auto',
     	width: 'auto',
		color:'#666',
  		text:_response[x].vicinity,
  		font: {
         fontSize: 12
    	}
	});
  	_c.add(_vicinity);
  	
  	if(x < _response.length-1){
  		_c.add(_hr());
  	}
  	
  	_c.addEventListener('click',function(e){
  		var accessCode = require('ui/common/userProfile/AccessCode');
  		accessCode.launch(this._data);
  	});  	
  	results_view.add(_c);   
        	
        		
         }
 	 },
 	 onerror: function(e){
 		 	Ti.API.error("User.load error " + e);
 	 }
 	});
 	
 	
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data); 
	
	
	
	
	
}

function clear(_view){
	Ti.API.debug("clearing tableView with items = " + _view.children.length);
	for(var i=0;i<_view.children.length;i++){
			var c = _view.children[i];
			_view.remove(c);
	}
	Ti.API.debug("clearing done with items = " + _view.children.length);
}

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/hr.png',
		  	backgroundRepeat: true,
		  	height:2,
		  	top:5,bottom:5,
		  	width:'100%'
		 }
	);
}



function _isValidPostalCode(postalCode, countryCode) {
    switch (countryCode) {
        case "US":
            postalCodeRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
            break;
        case "CA":
            postalCodeRegex = /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/;
            break;
        default:
            postalCodeRegex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/;
    }
    return postalCodeRegex.test(postalCode);
}

