

exports.init = function(scroll,_callBack,_top){
	if(_top){
		
	}else{
		_top = -45;
	}
	var topView = Ti.UI.createView({width:Ti.UI.FILL,height:Ti.UI.SIZE,top:_top,layout:'vertical'});
	var _footer = Ti.UI.createLabel({
		top:15,bottom:15,
		height:Ti.UI.SIZE,
		color:'#aaa',
  		text:"pull to refresh",
  		_status: false,
  		font: {
         fontSize: 16
    	}
	});
	topView.add(_footer);
	scroll.add(topView);
	
	scroll.addEventListener('scroll',function(e){
	if(e.dragging){
		if (e.y <= -80 && _footer._status === false) {
				_footer.setColor("#666");
          		_footer.setText("release to refresh");
          		_footer._status = true;
    	}else if (e.y > -80 && _footer._status === true) {
    			_footer.setColor("#aaa");
          		_footer.setText("pull to refresh");
          		_footer._status = false;	
        }
     }   	
         
	});
	
	scroll.addEventListener('dragend',function(e){
		if(_footer._status === true){
			_callBack();
		}
				_footer.setColor("#aaa");
          		_footer.setText("pull to refresh");
          		_footer._status = false;	
	});
	
}
