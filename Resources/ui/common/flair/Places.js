var portal = require('ui/common/Portal');
var _callBack;
var _placesView;
var _scrollableContainer;
var _scrollable;
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
var showingHome;var main;

function _reloadPlaces(){
	var _placesArr = [];
	
	   _scrollable.scrollTo(0,0);
		for(var i=0;i<_placesView.children.length;i++){
			if(!_placesView.children[i]._data.id){
				_placesView.children[i]._label.setText("loading");
			}
		}
		portal.getPlaces(printPlaces,true);	
	
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
	
	var reload_btn = Ti.UI.createView({backgroundColor:"#eee",borderRadius:50,backgroundImage:"images/flairs/100/cancel.png",top:-20,width:100,height:100});
	reload_btn.addEventListener('singletap',function(e){
			main.close();
    });
	
	 main = Ti.UI.createWindow({			
    	backgroundColor:"#eee",
    	navBarHidden:false,
    	barColor: '#fff',
    	titleControl:reload_btn
    });
    
		_scrollable = Ti.UI.createScrollView({top:0,contentOffset:{X:80,Y:80}});
		
		main.add(_scrollable);	
		var pull_to_refresh = require('ui/common/components/PullToRefresh');
		pull_to_refresh.init(_scrollable,function(){
			_reloadPlaces();
		},15);
	
	var _grayView =  Titanium.UI.createView(
		 {
		  	width: '320',top:0,
		  	height: Ti.UI.FILL
		 }
	);
	var _grayViewCont = Ti.UI.createView({top:0,left:0,width:Ti.UI.FILL,height:70,backgroundImage:"images/trans_dark.png"})
	_grayViewCont.add(_grayView);
	//main.add(_grayViewCont);	
	
	var places = portal.initLocation(printPlaces);
	printPlaces([]);
	return main;
};

function printPlaces(places){
	_places = places;
	
	if(_placesView){
		_scrollable.remove(_placesView);
		_placesView = null;
	}
	_placesView =  Titanium.UI.createView(
		 	{
		  		width:290,height:Ti.UI.SIZE,
		  		layout:'horizontal',top:55
		 	}
		);	
		
		_scrollable.add(_placesView);
	
	
	var bgColor;
	
	_placesView.add(_createFlairThumb({id:"_cancel_btn",photo:"images/flairs/100/cancel.png"},"#dedede",0));
	
	
	for(var i=0;i<places.length;i++){
		bgColor = _bgColors[i];
		var place = places[i];
		_placesView.add(_createFlairThumb(place,bgColor,i+1));
	}	
	
	if(places.length<18){
		for(var i=places.length+1;i<18;i++){
			bgColor = _bgColors[i];
			_placesView.add(_createFlairThumb({name:""},bgColor));	
		}
	}
	
	_currentPlaceIndex = _places.length;
	
}

function _process(_data,_addMore){
	Ti.API.debug("5");
	main.close();
	var flairWin = require('ui/common/flair/Flair');
	flairWin.init(_data,function(){
		//Ti.API.debug("6");
		main.close();
	});
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
	rows.close();
	printPlaces(rs);
}

function _loadWords(){
	_currentPlaceIndex = 0;
	_bgColorA = "#f1f1f1";
	_bgColorB = "#fff";
	_color = "#40a3ff";
		
	var rs = [];
	var rows = _db.select("SELECT _txt FROM _adj order BY RANDOM() limit 12");
		
	while (rows.isValidRow()){
		rs.push({"name":"#" + rows.field(0)});
		rows.next();
	}
	rows.close();
	printPlaces(rs);
}

function _createFlairThumb(_data,bgColor,i,_borderColor){
	
	if(_currentWords["index_"+i] && _currentWords["index_"+i]._selected){
		return _currentWords["index_"+i];
	}
	
	var thumb = _createThumb(_data,bgColor,_borderColor);
	thumb._index = i;
	thumb.addEventListener('singletap',function(){
		if(_data.id === "_cancel_btn"){
			main.close();return;
		}
		
		
		Ti.API.debug("1");
		thumb._selected = false;
		if(_data.pid){
			Ti.API.debug("2");
			var flairWin = require('ui/common/flair/Flair');
			Ti.API.debug("3");
			_process(_data);
			Ti.API.debug("4");
		}
	});	
	
	return thumb;
}

function _createThumb(_data,bgColor,_borderColor){
	var outer =  Titanium.UI.createView(
		 {
		  	width: 100,
		  	height: 100,
		  	top:-2.5,
		  	bottom:-2.5,
		  	left:-2.5,
		  	right:-2.5,
		  	borderRadius: 50,
		   	_data: _data	
		 }
	);	
	
	var _photo;
	
	if(_data.photo){
		_photo = _data.photo;
	}
	
	if(_borderColor){
		
	}else{
		_borderColor = "#f1f1f1";
	}
	
	var inner_bg =  Titanium.UI.createView(
		 {
		 	_bgColor:bgColor,
		  	width: '85',
		  	height: '85',
		  	backgroundColor:bgColor,
		  	borderRadius:42.5,borderWidth:2.5,borderColor:_borderColor,
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

function show(_view){
	clear(_scrollableContainer);
	_scrollableContainer.add(_view);
}

function clear(thisView){
	if(thisView){
		var len = thisView.children.length;
			for(var i=0;i<len;i++){
				var v = thisView.children[i];
				thisView.remove(v);
				v = null;
			}
	}
}