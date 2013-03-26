var _textField;
var _tableView;

var _adv;
var _adj;
var _food;
var _fid;
var _pid;
var _person;
var _mode;
var _flair;
var _place;
var portal = require('ui/common/Portal');
var places = require('ui/common/flair/Places');
var _search = require('ui/common/flair/Search');
var _db = require('ui/common/data/DB');
var main;
var placesView;


exports.close = function(){
	var slide_it_bottom = Titanium.UI.createAnimation();
    slide_it_bottom.opacity = 0; // to put it back to the left side of the window
    slide_it_bottom.duration = 300;

	main.close(slide_it_bottom);
}

exports.init = function(_data) {	
	_flair = _data;
	
	main = Ti.UI.createWindow({			
    	hideNavBar:true,
    	backgroundColor:'transparent',
        opacity:0
	});
	
	printPlaces();	
}

function printPlaces(){
	placesView = places.init(_startFlair);
	main.add(placesView);
	var slide_it_top = Titanium.UI.createAnimation();
    slide_it_top.opacity = 1; // to put it back to the left side of the window
    slide_it_top.duration = 300;
	main.open(slide_it_top);
}

function _startFlair(_data){
	_place = _data;
	clear(main);
	var outer =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: '100%',
		  	top:0,
		  	left:0,
		  	layout:'vertical',backgroundColor:'#fff'
		 }
	);
	outer.add(_top(_flair));
	
	_tableView = Ti.UI.createTableView({
  	 	    height:120,
  	 		top:0,backgroundColor:'#990000'
	});
	outer.add(_tableView);
	
	main.add(outer);
	
    _textField.focus();
}

function _update(_textField){

	_adv = "";_adj = "";_food = "";_person = "";
	_fid = 0;_pid = 0;
	_mode = "";
	
	var _txt = _textField.getValue();
	
		//trim
		_txt = _txt.replace(/^\s+|\s+$/g,'');	
	
	var words = _txt.split(" ");
	
	Ti.API.debug("words le" + words.length);

	
	if(_adv === ""){
		Ti.API.debug("searching adverbs");
		var results = _search_adv(words[0]);
		if(results.length === 0){
			Ti.API.error("adverbs invalid");
			_print_last_word(words[0],false);
		}else if(results.length > 1){
			if(words.length>1){
			_adv = words[0];
			}
			_print_last_word(words[0],true);
		}else if(results.length === 1){
			_adv = words[0];
			_print_last_word(words[0],true);
		}else{
			_print_last_word(words[0],false);
		}		
	}

	if(_adv !== "" && _adj === "" && words.length > 1){
		Ti.API.debug("searching adjectives ");
		var results = _search_adj(words[1]);
		if(results.length === 0){
			Ti.API.error("adjectives invalid");
			_print_last_word(words[1],false);
		}else if(results.length > 1){
			if(words.length>2){
			_adj = words[words.length-1];
			}
			print_last_word(words[1],true);
		}else if(results.length === 1){
			_adj = words[1];			
			_print_last_word(words[1],true);
		}else{
			_print_last_word(words[1],false);
		}
	}
	
	if(_adv !== "" && _adj !== "" && _food === "" && words.length>2){
			Ti.API.debug("searching food");
			
				var food_start_location = _txt.lastIndexOf(_adj) + _adj.length;
				var food_start_string = _txt.substring(food_start_location);
				var	food_array = food_start_string.split(" by ");
				var food_string = food_array[0]; 				
			
			var results = _search_food(food_string);
			if(results.length>0){
				_print_last_word(food_string,true);
			}else{
				_print_last_word(food_string,false);	
			}
			
			if(food_array.length>1){
				_food = food_string;
			}			
	}

	
	if(_food !== "" && _txt.lastIndexOf(" by ") > _txt.lastIndexOf(_food) && food_array.length>1 ) {
			Ti.API.debug("searching person");
				var person_string = food_array[1];
			var results = _search_person(person_string);
				_print_last_word(" by ", true);
			if(results.length>0){
				_print_last_word(person_string,true);
				_person = person_string;
				send_to_server();
				//_print_place();				
			}else{
				_print_last_word(person_string,true);
				_person = person_string;
			}
	}
	
}

function send_to_server(){
  if(_adj !== "" && _adv !== "" && _food !== "" && _person !==""){  	
  	Ti.API.debug("looks like a good flair");
  	
  		var  url="https://flair.me/nominate.php";
		var _dataStr = {};
		var _placeWindow;
		var placeView = require('ui/common/place/Place');
		var _placeWindow = placeView.init(_place);
		
		portal.open(_placeWindow);		
		main.close();
			
		_dataStr.flair = _flair.id;
		_dataStr.place = _place.pid;
		_dataStr.adjective = _adv + " " + _adj;
		_dataStr.food = _food;		
		_dataStr.recipientName = _person;
		
		_dataStr.accessToken=Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 var _result = JSON.parse(this.responseText);  
     	 if(_result.status){     	 
			     	 	
     	 }
     	 Ti.API.debug('Flair sent to server');
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
  }else{
  	
  	//throw error
  	
  }
}

function _print_place(){

}

function _search_person(_word){
	_word = _word.replace(/^\s+|\s+$/g,'');
	var rs = [];
	if(_word === "hari"){
		rs.push({title:_word});
	}
	
	
	_updateTable(rs);
	
	return rs;
}


function _search_adv(_word){
	_word = _word.replace(/^\s+|\s+$/g,'');
	var rs = [];
	var rows = _db.select("select _txt from _adv");
	Ti.API.info('Row count: ' + rows.rowCount);
	
	while (rows.isValidRow()){
		rs.push({"title":rows.fieldByName('_txt')});
		rows.next();
	}
	
	_updateTable(rs);
	return rs;	
}

function _search_adj(_word){
	_word = _word.replace(/^\s+|\s+$/g,'');
	var rs = [];
	if(_word === "delicious"){
		rs.push({title:_word});
	}
	
	_updateTable(rs);
	
	return rs;
}

function _search_food(_word){
	_word = _word.replace(/^\s+|\s+$/g,'');
	
	if(_word.lastIndexOf(" by") === _word.length-3){
				_word = _word.substring(0,_word.length-3);
	}else if(_word.lastIndexOf(" b") === _word.length-2){
				_word = _word.substring(0,_word.length-2);
	}
	
	
	var rs = [];
	if(_word === "chips ahoy"){
		rs.push({title:_word});
	}
	
	
	_updateTable(rs);
	
	return rs;
}

function _print_last_word(_word,_found){

	var _oldColor = _textField.getColor();
	
	if(_found){
		if(_oldColor !== "#333333"){
			_textField.setColor("#333333");	
		}
	}else{
		if(_oldColor !== "#990000"){
			_textField.setColor("#990000");	
		}
	}
	
}

function _updateTable(_dataArr){
	Ti.API.info("--->" + _dataArr.length);
	_tableView.setData(_dataArr);  	
}

function _top(_data){
	var thumb = _createThumb(_data);	
	
	var cRight = Titanium.UI.createView(
		 {
		  	left:5,
		  	top:5,
		  	width:230,
		  	height:'auto',
		  	layout: 'vertical',backgroundColor:'#fff'
		 }
	);	
		
	var flair_details = Titanium.UI.createView(
		 {
		 	left:0,
		 	width:'220',
		 	height:'auto',
		 	top:-5
		 }
	);	
	
	
	
	var cancel_btn = Ti.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.CANCEL});
	
	    cancel_btn.addEventListener('click',function(e){
	    	var flairWin = require('ui/common/flair/Flair');
		    flairWin.close();
	    });
	
	var flexSpace = Titanium.UI.createButton({
    	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var save_btn = Ti.UI.createButton({systemButton:Titanium.UI.iPhone.SystemButton.SAVE});
	save_btn.addEventListener('click',function(){
		send_to_server();
	});
	var keyboardBar = Titanium.UI.createToolbar({
 		items:[cancel_btn,flexSpace, save_btn],
		animated: false,
		backgroundColor: '#999', 
		height: 60,
		width: Ti.UI.FILL
	});

	_textField = Ti.UI.createTextArea({
  		borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		color: '#333',
  		keyboardToolbarColor:'#999',
  		keyboardToolbar:keyboardBar,
  		top: 10, left: 0,
  		width: '100%', height: '70',
  		font: {
         fontSize: 18
    	},
    	hintText: "Start Typing Here"
	});	
	
	_textField.addEventListener("change",function(){
		_update(this);
	});

	flair_details.add(_textField);
	cRight.add(flair_details);
	
	//--------------------------------------------------------------------------------------------------------------------
	
	var cContainer = Titanium.UI.createView(
		 {
		  	backgroundColor: '#fff',
		  	left:0,
		  	right:0,
		  	bottom:0,
		  	height:'85',
		  	layout: 'horizontal',
		  	_data:_data
		 }
	);
	
	cContainer.add(thumb);
	cContainer.add(cRight);	
	
	main.addEventListener('singletap',function(){
		Ti.API.debug("YAHOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
		_textField.focus();	
	});
	

	
	return cContainer;	
}

function _createThumb(_data){
	var outer =  Titanium.UI.createView(
		 {
		  	width: 75,
		  	height: 75,
		  	top:5,
		  	bottom:5,
		  	left:5,
		  	right:0,
		    backgroundColor:'#fff',	  
		   	_data: _data
		 }
	);
	
	var inner =  Titanium.UI.createView(
		 {
		  	width: 55,
		  	height: 55,
		  	backgroundImage:'images/flairs/100/' + _data.id + '.png'
		 }
	);
	
	outer.add(inner);
	return outer;
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
		  	top:0,bottom:0,
		  	width:'100%'
		 }
	);
}

