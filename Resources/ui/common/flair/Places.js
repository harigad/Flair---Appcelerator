var portal = require('ui/common/Portal');
var _callBack;
var _placesView;

function _reloadPlaces(){
	clear(_placesView);
	_placesView.add(Ti.UI.createImageView({
  			image: 'images/load.gif',
  			width: '50',
  			left: 120, top: 75
		}));
	portal.getPlaces(printPlaces);	
}

exports.init = function(callBack) {
	_callBack = callBack;
	var outer =  Titanium.UI.createView(
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
		  	layout:'horizontal',backgroundColor:'#eee'
		 }
	);	
	
	var reload_btn = Ti.UI.createImageView({
  				image: 'images/reload.png',
  				left:17.5
  	});
	var reload_label = Ti.UI.createLabel({
			height:'60',
			left:5,
  			text:"reload",
  			color:"#999",  			
  			font: {
         		fontSize: 12
    		}  				
	});	
	
	_grayView.add(reload_btn);
	_grayView.add(reload_label);
	
	reload_btn.addEventListener('click',function(e){
		_reloadPlaces();
	});
	reload_label.addEventListener('click',function(e){
		_reloadPlaces();
	});	

    var cancel_btn = Ti.UI.createImageView({
  				image: 'images/cancel.png',
  				left:5
  	});
	var cancel_label = Ti.UI.createLabel({
			height:'60',
		    left:135,
  			text:"cancel",
  			color:"#999",  			
  			font: {
         		fontSize: 12
    		}  				
	});	
	
	_grayView.add(cancel_label);_grayView.add(cancel_btn);
	outer.add(_grayView);
	
	cancel_btn.addEventListener('click',function(e){
		var flairWin = require('ui/common/flair/Flair');
		flairWin.close();
	});
	cancel_label.addEventListener('click',function(e){
		var flairWin = require('ui/common/flair/Flair');
		flairWin.close();
	});
  		
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
  		
	var places = portal.getPlaces();	
	printPlaces(places);
	
	return outer;
}

function printPlaces(places){
	clear(_placesView);
	var len;
	len = 12;
	
	if(places.length<12){
		len = places.length;
	}
	
	var bgColor;
	
	for(var i=0;i<len;i++){
		
		if(i % 2){
		  bgColor = "#dddddd";
	    }else{
		  bgColor = "#eeeeee";
	    }	
	
		_placesView.add(_createFlairThumb(places[i],bgColor));	
	}	
}

function _createFlairThumb(_data,bgColor){
	var thumb = _createThumb(_data,bgColor);
	
	thumb.addEventListener('click',function(){
		var flairWin = require('ui/common/flair/Flair');
		_callBack(_data);
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
  			color:"#999",
  			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  			font: {
         		fontSize: 12
    		}  				
	});	
	
	inner_bg.add(inner);
	outer.add(inner_bg);
	
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

function clear(_view){
	Ti.API.debug("clearing tableView with items = " + _view.children.length);
	for(var i=0;i<_view.children.length;i++){
			var c = _view.children[i];
			_view.remove(c);
	}
	Ti.API.debug("clearing done with items = " + _view.children.length);
}