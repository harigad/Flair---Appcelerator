var portal = require('ui/common/Portal');
var _callBack;
var _placesView;
var outer;
var _place;var _food;var _person;
var _word;

var _bgColorA;
var _bgColorB;
var _color;

var _db = require('ui/common/data/DB');

function _reloadPlaces(){
	var _placesArr = [];
	/*if(_food){
	    _loadPersons();   
	}else if(_word){
		_loadFoods();
	}else */if(_place){
		_loadWords();		
	}else{
		for(var i=0;i<_placesView.children.length;i++){
			_placesView.children[i]._label.setText("loading");
		}
		portal.getPlaces(printPlaces);	
	}
}

exports.init = function(callBack) {
	
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
	
	var _grayView =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: '50',
		  	layout:'horizontal',backgroundColor:'#fff'
		 }
	);	
	
	var reload_btn = Ti.UI.createImageView({
  				image: 'images/cancel.png',
  				left:17.5
  	});
	var reload_label = Ti.UI.createLabel({
			height:'60',
			left:5,
  			text:"cancel",
  			color:"#999",  			
  			font: {
         		fontSize: 12
    		}  				
	});	
	
	_grayView.add(reload_btn);
	_grayView.add(reload_label);
	
	var cancel_btn = Ti.UI.createImageView({
  				image: 'images/reload.png',
  				left:3
  	});
	var cancel_label = Ti.UI.createLabel({
			height:'60',
		    left:140,
  			text:"reload",
  			color:"#999",  			
  			font: {
         		fontSize: 12
    		}  				
	});	
	
	_grayView.add(cancel_label);_grayView.add(cancel_btn);
	outer.add(_grayView);
	
	reload_btn.addEventListener('singletap',function(e){
		var flairWin = require('ui/common/flair/Flair');
		flairWin.close();
	});
	reload_label.addEventListener('singletap',function(e){
		var flairWin = require('ui/common/flair/Flair');
		flairWin.close();
	});
	
	cancel_btn.addEventListener('singletap',function(e){
		_reloadPlaces();
	});
	cancel_label.addEventListener('singletap',function(e){
		_reloadPlaces();
	});	
  		
  	
  	//outer.add(_placesView);	
  		
	var places = portal.getPlaces();
	printPlaces(places);

	return outer;
}

function printPlaces(places){
	if(_placesView){
		outer.remove(_placesView);
	}
	
	_placesView = null;
	
	_placesView =  Titanium.UI.createView(
		 {
		  	width: '290',
		  	height: 'auto',
		  	top:8,
		  	left:17.5,
		  	layout:'horizontal'
		 }
	);	
	outer.add(_placesView);	
	var len;
	len = 12;
	
	if(places.length<12){
		len = places.length;
	}
	
	var bgColor;
	
	for(var i=0;i<len;i++){
		
		if(i % 2){
		  bgColor = _bgColorA;
	    }else{
		  bgColor = _bgColorB;
	    }	
	
		var place = places[i];
		
		//setTimeout(function(){
					_placesView.add(_createFlairThumb(place,bgColor));	
		//}, 50*i );
	}	
	
	if(places.length<12){
		for(var i=places.length;i<12;i++){
			if(i % 2){
		  		bgColor = _bgColorA;
	    	}else{
		  		bgColor = _bgColorB;
	    	}
			_placesView.add(_createFlairThumb({name:""},bgColor));	
		}
	}
}

function _process(_data){
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

function _createFlairThumb(_data,bgColor){
	var thumb = _createThumb(_data,bgColor);
	
	thumb.addEventListener('singletap',function(){
		var flairWin = require('ui/common/flair/Flair');
		_process(_data);
	});	
	
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
	
	var inner_bg =  Titanium.UI.createView(
		 {
		  	width: '85',
		  	height: '85',
		  	backgroundColor:bgColor,
		  	borderRadius:4
		 }
	);
	
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
	
	inner_bg.add(inner);
	outer.add(inner_bg);
	outer._label = inner;
	
	   outer.addEventListener('touchstart',function(e){
			this._cancelClick = false;
			this.setOpacity(0.3);						
		});
		
		outer.addEventListener('touchend',function(e){
				this.setOpacity(1);
		});
		
		outer.addEventListener('touchmove',function(e){
			this._cancelClick = true;
			this.setOpacity(1);
		});
		
	
	return outer;
}

function clear(thisView){
	var len = thisView.children.length;
		for(var i=0;i<len;i++){
			thisView.remove(thisView.children[i]);
		}
}