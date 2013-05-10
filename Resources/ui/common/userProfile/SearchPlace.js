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

exports.close = function(_refresh,_user){
	main.close();
	if(_refresh){
		var profile = require('ui/common/userProfile/UserProfileView');
		profile.refresh(_user);
	}
}

function init(){
	main = Titanium.UI.createWindow({
    	backgroundColor: '#eee',
    	hideNavBar: true 	
	});
	
	main.addEventListener("focus",function(e){
		Ti.API.debug("main opened");
		_txtField.focus();
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
	
	results_view = Titanium.UI.createTableView(
	{
		  	width: '320',
		  	top:0,backgroundColor:'#eee'
	});	
	scrollView.add(results_view);
	
	_show_tip();

	initialize();	
	
}	

function initialize(){
	if(user.getPlace()){
		var accessCode = require('ui/common/userProfile/AccessCode');
		accessCode.launch(user.getPlace());
 	}else{		
		main.open();	
	}
}

function _show_tip(){
	clear(results_view);
	
	var tip = Titanium.UI.createView(
	{
		  top:10,left:10,right:10,height:Ti.UI.SIZE,
		  backgroundColor:'#cecece',borderRadius:4,
	});	
	
	var _txt = Ti.UI.createLabel({
		left:10,right:10,top:10,bottom:10,height:Ti.UI.SIZE,
		text:"Search for the resturant/cafe that you work for",
  		color:'#fff',
  		font: {
         fontSize: 20
    	},
	});
	
	tip.add(_txt);
	results_view.add(tip);	
}

function _form(){
		var _container = Titanium.UI.createView(
	{
		  	width: '100%',
		  	height: '100',		
		  	backgroundColor: '#fff',
		  	layout: 'vertical'
	});	
	
	var cancel_btn = Ti.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.CANCEL,
		title:"search"
		});
	
	    cancel_btn.addEventListener('click',function(e){
	    	var searchPlace = require('ui/common/userProfile/SearchPlace');
		    searchPlace.close(false);
	    });
	
	var flexSpace = Titanium.UI.createButton({
    	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var save_btn = Ti.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.DONE});
	save_btn.addEventListener('click',function(){
		_search();
	});
	
	var keyboardBar = Titanium.UI.createToolbar({
 		items:[cancel_btn,flexSpace, save_btn],
		animated: false,
		backgroundColor: '#999', 
		height: 60,
		width: Ti.UI.FILL
	});	
	
	_txtField = Ti.UI.createTextField({
		keyboardToolbar:keyboardBar,
  		value:'',
  		width:280,
  		top:0,bottom:0,height:40,
  		backgroundColor:'#fff',
  		hintText:'search restaurant/cafe',
  		returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		font: {
         		fontSize: 16
    		}		
	});	
	_container.add(_txtField);
	_container.add(_hr());
	
	_zipField = Ti.UI.createTextField({
		keyboardToolbar:keyboardBar,
  		value:'',
  		width:280,
  		top:0,bottom:0,height:40,
  		backgroundColor:'#fff',
  		hintText:'city, state',
  		returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		font: {
         		fontSize: 16
    		}		
	});	
	_container.add(_zipField);
	
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
	}
	
	var that = this;
	
	var url = "http://flair.me/search.php";	
	var _data = {type:"search",searchMode:"place",search:_txt,city:_zipcode,accessToken:login.getAccessToken()};
		
	clear(results_view);
 	
 	Ti.API.debug("User.load sending data " + JSON.stringify(_data)); 	
 	 	
 	 var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 Ti.API.debug("places search returned " + this.responseText);
 	 var _response = JSON.parse(this.responseText);
 	 var _tableData = [];
 	 	  
     for(var x =0;x<_response.length;x++){
        	
       var _cRow = Titanium.UI.createTableViewRow();
        	var _c = Titanium.UI.createView(
		 {
		  	left:0,
		  	right:0,
		  	top:0,bottom:0,
		  	width:'100%',
		  	height:Ti.UI.SIZE,
		  	layout:'vertical',
		  	_data: _response[x]
		 }
	);	
	
  	var _txt = Ti.UI.createLabel({
  		left:20,top:5,
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
  		left:20,bottom:5,
     	height:'auto',
     	width: 'auto',
		color:'#666',
  		text:_response[x].vicinity,
  		font: {
         fontSize: 11
    	}
	});
  	_c.add(_vicinity);
  	
  
  	_c.addEventListener('singletap',function(e){
  		_txtField.blur();
  		_zipField.blur();
  		var accessCode = require('ui/common/userProfile/AccessCode');
  		accessCode.launch(this._data,true);
  	});  	
  	
  	_cRow.add(_c);
  	_tableData.push(_cRow);	
         }
         
     results_view.setData(_tableData);   
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

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/hr.png',		  
		  	height:2,
		  	top:5,bottom:5,
		  	width:'100%'
		 }
	);
}


