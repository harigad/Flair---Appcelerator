var portal = require('ui/common/Portal');
var _callBack;
var _placesView;
var outer;
var _places;
var _place;var _food;var _person;
var _word;
var _placeLabel;
var _bgColorA;
var _bgColorB;
var _color;
var _currentWords;
var _currentWordsLen;
var _currentPlaceIndex;

var _db = require('ui/common/data/DB');

function _reloadPlaces(){
	var _placesArr = [];
	
	//if(_place){
//		_loadWords();		
//	}else{
	if(_placesView){
		for(var i=0;i<_placesView.children.length;i++){
			_placesView.children[i]._label.setText("loading");
		}
		
		
		if(_currentPlaceIndex >= _places.length){
			_currentPlaceIndex = 0;
			portal.getPlaces(printPlaces,true);	
		}else{
			printPlaces(_places);
		}
	}	
//	}
}

exports.init = function(callBack) {
	_currentPlaceIndex = 0;
	_currentWords = {};_currentWordsLen=0;
	_bgColorA = "#fff";
	_bgColorB = "#f1f1f1";
	_color = "#333";
	
	_callBack = callBack;
	_place = null;
	_word = null;
	outer =  Titanium.UI.createView(
		 {
		  	width: '320',
		  	height: 'auto',
		  	top:0,
		  	left:0,
		  	layout:'horizontal'
		 }
	);	
	
	
	var header = Titanium.UI.createView({
		width:'100%',height:57,top:0,bottom:0,
		backgroundColor:'#fff',
	});
	
	_placeLabel = Ti.UI.createLabel({
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: "Pick a Place",
			width:Ti.UI.FILL,
			color:'#2179ca'
	});
	
	header.add(_placeLabel);
	
	outer.add(header);
	
	var _grayView =  Titanium.UI.createView(
		 {
		  	width: '290',left:17.5,top:0,
		  	height: Ti.UI.SIZE,
		  	layout:'horizontal',backgroundColor:'#fff'
		 }
	);	
	
	var cancel_btn = _createThumb({"id":"",photo:"images/cancel.png"},_bgColorA);
	_grayView.add(cancel_btn);
	
	var middle_btn = _createThumb({"id":"",photo:""},_bgColorB);
	_grayView.add(middle_btn);
	
	var reload_btn = _createThumb({"id":"",photo:"images/reload.png"},_bgColorA);
	_grayView.add(reload_btn);
	
	outer.add(_grayView);
	
	cancel_btn.addEventListener('singletap',function(e){
		var flairWin = require('ui/common/flair/Flair');
		flairWin.close();
	});
	
	reload_btn.addEventListener('singletap',function(e){
		_reloadPlaces();
	});
	
  	//outer.add(_placesView);	
  		
	var places = portal.getPlaces(printPlaces);

	return outer;
}

function printPlaces(places){
	_places = places;
	if(_placesView){
		outer.remove(_placesView);
	}
	
	_placesView = null;
	
	_placesView =  Titanium.UI.createView(
		 {
		  	width: '290',
		  	height: 'auto',
		  	top:0,
		  	left:17.5,
		  	layout:'horizontal'
		 }
	);	
	outer.add(_placesView);	
	var len;
	len = 9;
	
	if(places.length<9+_currentPlaceIndex){
		len = places.length-_currentPlaceIndex;
	}
	
	var bgColor;
	
	for(var i=_currentPlaceIndex;i<len+_currentPlaceIndex;i++){
		
		if(i % 2){
		  bgColor = _bgColorA;
	    }else{
		  bgColor = _bgColorB;
	    }	
	
		var place = places[i];
		
		//setTimeout(function(){
					_placesView.add(_createFlairThumb(place,bgColor,i));	
		//}, 50*i );
	}	
	
	if(len<9){
		for(var i=len;i<9;i++){
			if(i % 2){
		  		bgColor = _bgColorA;
	    	}else{
		  		bgColor = _bgColorB;
	    	}
			_placesView.add(_createFlairThumb({name:""},bgColor));	
		}
	}
	
	_currentPlaceIndex = _currentPlaceIndex + 9;
	
}

function _process(_data,_addMore){
/*	if(_food){
		_person = _data;
		_callBack(_place.name,_word.name,_food.name,_person.data);
	}if(_word){
		_food = _data;
		_loadPersons();
	}else*/
	if(_place){
		_word = _data;
		_callBack(_place,_word.name);
	}else{
		_callBack(_data,null);return;
		
		_currentWords = {};
		_placeLabel.setText("Pick a #Tag");
		_place = _data;
		_loadWords();
	}
}

function _loadFoods(){
	var rs = [];
	var rows = _db.select("SELECT _txt FROM _food order BY RANDOM() limit 12");
		
	while (rows.isValidRow()){
		rs.push({"name":rows.field(0)});
		rows.next();
	}
	
	printPlaces(rs);
}

function _loadWords(){
	_currentPlaceIndex = 0;
	_bgColorA = "#f1f1f1";
	_bgColorB = "#fff";
	_color = "#2179ca";
		
	var rs = [];
	var rows = _db.select("SELECT _txt FROM _adj order BY RANDOM() limit 12");
		
	while (rows.isValidRow()){
		rs.push({"name":"#" + rows.field(0)});
		rows.next();
	}
	
	printPlaces(rs);
}

function _createFlairThumb(_data,bgColor,i){
	
	if(_currentWords["index_"+i] && _currentWords["index_"+i]._selected){
		return _currentWords["index_"+i];
	}
	
	
	var thumb = _createThumb(_data,bgColor);
	thumb._index = i;
	thumb.addEventListener('singletap',function(){
		thumb._selected = true;
		var flairWin = require('ui/common/flair/Flair');
		_process(_data);
	});	
	
	/*thumb.addEventListener('longpress',function(){
		if(_place){
		  if(thumb._selected){
		  	thumb._inner.setBackgroundColor(thumb._inner._bgColor);
		  	thumb._innerLabel.setColor("#2179ca");
		  	thumb._selected = false;
		  	thumb.setOpacity(1);
		  	_currentWords["index_" + thumb._index] = thumb;
		  	_currentWordsLen = _currentWordsLen -1;
		  }else{
		  	thumb._inner.setBackgroundColor("#2179ca");
		  	thumb._innerLabel.setColor("#fff");
		  	thumb._selected = true;
		  	thumb.setOpacity(1);
		  	_currentWords["index_" + thumb._index] = thumb;
		  	_currentWordsLen = _currentWordsLen + 1;
		  	if(_currentWordsLen === 2){
		  			var flairWin = require('ui/common/flair/Flair');
					_process(_data);
			}
		  }
		}
	});*/
	
	
	return thumb;
}

function _createThumb(_data,bgColor){
	var outer =  Titanium.UI.createView(
		 {
		  	width: 100,
		  	height: 100,
		  	top:-2.5,
		  	bottom:-2.5,
		  	left:-2.5,
		  	right:-2.5,
		  	backgroundImage:'images/feed/feed_flair_shadow.png',	
		  	borderRadius: 4,
		   	_data: _data	
		 }
	);	
	
	var _photo;
	
	if(_data.photo){
		_photo = _data.photo;
	}
	
	var inner_bg =  Titanium.UI.createView(
		 {
		 	_bgColor:bgColor,
		  	width: '85',
		  	height: '85',
		  	backgroundColor:bgColor,
		  	borderRadius:4,
		  	backgroundImage: _photo
		 }
	);
	
	outer._inner = inner_bg;
	
	var inner = Ti.UI.createLabel({
			height:'auto',
			width: 80,
  			text:_data.name,
  			color:_color,
  			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  			font: {
         		fontSize: 13
    		}  				
	});	
	
		outer._innerLabel = inner;
	
	
	inner_bg.add(inner);
	outer.add(inner_bg);
	outer._label = inner;
	
	   outer.addEventListener('touchstart',function(e){
			this._cancelClick = false;
			this._inner.setBackgroundColor('#2179ca');
		  	this._innerLabel.setColor('#fff');					
		});
		
		outer.addEventListener('touchend',function(e){
			 if(this._selected !== true){
			 	 	this._inner.setBackgroundColor(this._inner._bgColor);
		  			this._innerLabel.setColor(_color);
			 }
		});
		
		outer.addEventListener('touchmove',function(e){
			this._cancelClick = true;
			if(this._selected !== true){
			 	 	this._inner.setBackgroundColor(this._inner._bgColor);
		  			this._innerLabel.setColor(_color);
			 }
		});
	
	return outer;
}

function clear(thisView){
	var len = thisView.children.length;
		for(var i=0;i<len;i++){
			thisView.remove(thisView.children[i]);
		}
}