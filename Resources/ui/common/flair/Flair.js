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
var _search_class = require('ui/common/flair/Search');
var _db = require('ui/common/data/DB');
var login = require('ui/common/Login');

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
  	 		top:0,backgroundColor:'#eee'
	});
	outer.add(_tableView);
	
	_tableView.addEventListener("click",function(e){
		var _txt = _textField.getValue();
		var lower_txt = _txt.toLowerCase();
		var _word = e.rowData._word;
		var lastIndex = lower_txt.lastIndexOf(_word.toLowerCase());
		if(lastIndex>-1){
			var new_txt = _txt.substr(0,lastIndex);
			_textField.setValue(new_txt + e.rowData.title + " ");
			if(e.rowData._type === "person"){
				send_to_server();
			}
		}
	});
	
	main.add(outer);
	
    _textField.focus();
}

function _update(_textField){

	_adv = "";_adj = "";_food = "";_person = "";
	_fid = 0;_pid = 0;
	_mode = "";
	
	var _txt = _textField.getValue();
		//trim
	
	var words = _txt.split(" ");
	
	Ti.API.debug("words le" + words.length);

	
	if(_adj === ""){
		Ti.API.debug("searching adverbs");
		var results = _search_adj(words[0]);
		if(results.length === 0){
			Ti.API.error("adverbs invalid");
			_print_last_word(words[0],false);
		}else if(results.length > 1){
			if(words.length>1){
			_adj = words[0];
			}
			_print_last_word(words[0],true);
		}else if(results.length === 1){
			_adj = words[0];
			_print_last_word(words[0],true);
		}else{
			_print_last_word(words[0],false);
		}		
	}

	/*if(_adv !== "" && _adj === "" && words.length > 1){
		Ti.API.debug("searching adjectives ");
		var results = _search_adj(words[1]);
		if(results.length === 0){
			Ti.API.error("adjectives invalid");
			_print_last_word(words[1],false);
		}else if(results.length > 1){
			if(words.length>2){
			_adj = words[words.length-1];
			}
			_print_last_word(words[1],true);
		}else if(results.length === 1){
			_adj = words[1];			
			_print_last_word(words[1],true);
		}else{
			_print_last_word(words[1],false);
		}
	}*/
	
	if(_adj !== "" && _food === "" && words.length>1){
			Ti.API.debug("searching food");
			
				var food_start_location = _txt.lastIndexOf(_adj) + _adj.length;
				var food_start_string = _txt.substring(food_start_location);
				var	food_array = food_start_string.split(" by ");
				var food_string = food_array[0]; 				
			
			var results = _search_food(food_string);
			if(results.length>0){
				if(!_isForbidden(food_string)){
					_print_last_word(food_string,true);
				}else{
					_print_last_word(food_string,false);
					_updateTable([]);
				}
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
				//send_to_server();
				//_print_place();				
			}else{
				_print_last_word(person_string,false);
			}
	}
	
}

function send_to_server(){
  if(_adj !== "" && _food !== "" && _person !==""){  	
  	
  		var  url="https://flair.me/nominate.php";
		var _dataStr = {};
		var _placeWindow;
		var placeView = require('ui/common/place/Place');
		var _placeWindow = placeView.init(_place,de);
		
		portal.open(_placeWindow);		
		main.close();
			
		_dataStr.flair = _flair.id;
		_dataStr.place = _place.pid;
		_dataStr.adjective = _adj;
		_dataStr.food = _food;		
		_dataStr.recipientName = _person;
		
		_dataStr.accessToken=Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	Ti.API.info(this.responseText);
     	 var _result = JSON.parse(this.responseText);  
     	 Ti.API.info(this.responseText);
     	 if(_result.stickers){     	 
			   Ti.API.debug("flair true"); 
			   login.setFeed(_result.stickers); 	 	
     	 }else{
     	 	    Ti.API.error("flair false"); 
     	 }
     	
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
	
	Ti.API.info("searching persons");
	Ti.API.info("--->" + _place.cast.length);
	
	for(var i=0;i<_place.cast.length;i++){
		var name = _place.cast[i].name;
		name = name.toLowerCase();
		_word = _word.toLowerCase();
		if(name.search(_word) > -1){
		  rs.push({"_word":_word,"title":_place.cast[i].name});	
		}
	}
	
	if(rs.length === 0  && _word.length>0){
		if(_word.split(" ").length === 1){
			if(!_isForbidden(_word)){
				rs.push({"_type":"person","_word":_word,"title": _word.charAt(0).toUpperCase() + _word.slice(1).toLowerCase()});
			}
		}
	}
	
	_updateTable(rs);
	
	return rs;
}

function _search(_table,_word){
	var rs = [];
	var rows = _db.select("SELECT _txt FROM " + _table + " where _txt like '" + _word + "%'");
		
	while (rows.isValidRow()){
		rs.push({"_word":_word,"title":rows.field(0)});
		rows.next();
	}
	
	if(_table === "_food"){
			if(rs.length === 0  && _word.length>0){
					rs.push({"_word":_word,"title": _word});
			}
	}
	
	_updateTable(rs);
	return rs;
}

function _isForbidden(_line){
	var str = _line;//_line.replace(/[^a-zA-Z ]/g, "");
	str = str.replace(/\s/g, "");
	str = str.toLowerCase();
	
	str = str.replace(/[^a-zA-Z ]/g,"");	
	
	var rows = _db.select("SELECT _txt FROM _forbidden");

		
		Ti.API.info("-------------" + str);
		
	while (rows.isValidRow()){
		var thisWord = rows.field(0).toLowerCase();
		if(str.search(thisWord) > -1){
			return true;
		}	
		rows.next();
	}
	
	return false;
}

function _search_adv(_word){
	_word = _word.replace(/^\s+|\s+$/g,'');
	return _search("_adv",_word);	
}

function _search_adj(_word){
	_word = _word.replace(/^\s+|\s+$/g,'');
	return _search("_adj",_word);	
}

function _search_food(_word){
	_word = _word.replace(/^\s+|\s+$/g,'');
	return _search("_food",_word);
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

function show_error(str){
	var row = Ti.UI.createTableViewRow({
    	selectedBackgroundColor:'#eee',
    	height:Ti.UI.SIZE
  	});
  	
	var error_view = Ti.UI.createView({
		left:10,right:10,top:10,bottom:15
	});
	
	var _lbl = Ti.UI.createLabel({
       height:Ti.UI.SIZE,
		color:'#999',
  		text:str,
  		font: {
         fontSize: 30
    	}
		});
	
	error_view.add(_lbl);
	
	row.add(error_view);
	var arr = [];
	arr.push(row);
	_updateTable(arr);
}

function _updateTable(_dataArr){
	Ti.API.info("Search Results Found " + _dataArr.length);
	if(_dataArr.length>0){
		_tableView.setData(_dataArr);
	}else{
		show_error("not a valid word");
	}  	
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
	for(var i=0;i<_view.children.length;i++){
			var c = _view.children[i];
			_view.remove(c);
	}
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

