var portal = require('ui/common/Portal');
var _callBack;
var _placesView;
var _scrollable;
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
var wall = require('ui/common/wall/Wall');
var newHires = require('ui/common/wall/NewHires');
var _db = require('ui/common/data/DB');
var _bgColors;


function _reloadPlaces(){
	var _placesArr = [];
	
	_scrollable.scrollTo(0,0);
	
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
	
	_bgColors = [];
	
	_bgColors[0] = "#87c600";
	_bgColors[1] = "#579aff";
	_bgColors[2] = "#ff9638";
	
	_bgColors[3] = "#0067be";
	_bgColors[4] = "#be4c00";
	_bgColors[5] = "#169e00";
	
	_bgColors[6] = "#ff4f2c";
	_bgColors[7] = "#98bb46";
	_bgColors[8] = "#57aeff";
	
	
	
	
	_bgColors[9] = "#87c600";
	_bgColors[10] = "#579aff";
	_bgColors[11] = "#ff9638";
	
	_bgColors[12] = "#0067be";
	_bgColors[13] = "#be4c00";
	_bgColors[14] = "#169e00";
	
	_bgColors[15] = "#ff4f2c";
	_bgColors[16] = "#98bb46";
	_bgColors[17] = "#57aeff";
	
	
	_bgColors[18] = "#87c600";
	_bgColors[19] = "#579aff";
	_bgColors[20] = "#ff9638";
	
	_bgColors[21] = "#0067be";
	_bgColors[22] = "#be4c00";
	_bgColors[23] = "#169e00";
	
	_bgColors[24] = "#ff4f2c";
	_bgColors[25] = "#98bb46";
	_bgColors[26] = "#57aeff";
	
	_callBack = callBack;
	_place = null;
	_word = null;
	outer =  Titanium.UI.createView(
		 {
		  	width: '320',
		  	height: 'auto',
		  	top:20,
		  	left:0,
		  	layout:'horizontal',backgroundColor:'#fff'
		 }
	);	
	
	var _grayView =  Titanium.UI.createView(
		 {
		  	width: '290',left:17.5,top:0,
		  	height: Ti.UI.SIZE,
		  	layout:'horizontal',backgroundColor:'#fff'
		 }
	);
	
	
	var nearbyWin;
  	var friendsWin;

  	// = wall.init("nearby"); 
  	//var profileWin = 
  	
	var nearby = _createThumb({"id":"nearby","photo":"images/flairs/100/nearby.png"},'#f1f1f1');
		nearby.addEventListener('singletap',function(e){
			if(!nearbyWin){
				nearbyWin = newHires.init(); 
			}
			portal.open(nearbyWin);
		});
		
	var friends = _createThumb({"id":"friends","photo":"images/flairs/100/friends.png"},'#eee');
		friends.addEventListener('singletap',function(e){
			if(!friendsWin){
				friendsWin = wall.init("nearby"); 
			}
			portal.open(friendsWin);
	});
	
	
		
	
	var cancel_btn = _createThumb({"id":"",photo:"images/cancel.png"},_bgColorA);
	_grayView.add(nearby);
	
	var middle_btn = _createThumb({"id":"",photo:""},_bgColorB);
	_grayView.add(friends);
	
	var reload_btn = _createThumb({"id":"",photo:"images/reload.png"},"#f1f1f1");
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
  		
	var places = portal.initLocation(printPlaces);

	var header = Titanium.UI.createView({
		width:182,height:32,top:13,bottom:13,left:54,right:54,
		backgroundImage:'images/home/header.png'
	});

	var main = Ti.UI.createWindow({			
    	hideNavBar:false,
    	backgroundColor:'#fff',
    	titleControl:header,barColor:'#eee'
	});

	var ht = Titanium.Platform.displayCaps.platformHeight - 180;
	
	Ti.API.error("window ht =" + ht);

	_scrollable = Ti.UI.createScrollView({
			width: '290',
		  	height: ht,
		  	top:0,
		  	left:17.5,
	});
	outer.add(_scrollable);

	main.add(outer);
	printPlaces([]);
	return main;
}

function printPlaces(places){
	_places = places;
	
	if(_placesView){
		_scrollable.remove(_placesView);
	}
	
	_placesView = null;
	
	_placesView =  Titanium.UI.createView(
		 {
		  	width:Ti.UI.FILL,height:Ti.UI.SIZE,
		  	layout:'horizontal',top:0
		 }
	);	
	
	_scrollable.add(_placesView);	
	
	
	var bgColor;
	
	for(var i=0;i<places.length;i++){
		bgColor = _bgColors[i];
		var place = places[i];
		_placesView.add(_createFlairThumb(place,bgColor,i));
	}	
	
	if(places.length<12){
		for(var i=places.length;i<12;i++){
			bgColor = _bgColors[i];
			_placesView.add(_createFlairThumb({name:""},bgColor));	
		}
	}
	
	_currentPlaceIndex = _places.length;
	
}

function _process(_data,_addMore){
	var flairWin = require('ui/common/flair/Flair');
	flairWin.init(_data);
	return;
	
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
		thumb._selected = false;
		if(_data.pid){
			var flairWin = require('ui/common/flair/Flair');
			_process(_data);
		}
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
		  	borderRadius: 50,
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
		  	borderRadius:42.5,
		  	backgroundImage: _photo
		 }
	);
	
	outer._inner = inner_bg;
	
	var inner = Ti.UI.createLabel({
			height:'auto',
			width: 80,
  			text:_data.name,
  			color:"#fff",
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
			this._inner.setBackgroundColor('#fff');
		  	this._innerLabel.setColor(this._inner._bgColor);					
		});
		
		outer.addEventListener('touchend',function(e){
			 if(this._selected !== true){
			 	 	this._inner.setBackgroundColor(this._inner._bgColor);
		  			this._innerLabel.setColor("#fff");
			 }
		});
		
		outer.addEventListener('touchmove',function(e){
			this._cancelClick = true;
			if(this._selected !== true){
			 	 	this._inner.setBackgroundColor(this._inner._bgColor);
		  			this._innerLabel.setColor("#fff");
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