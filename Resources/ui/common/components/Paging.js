

exports.init = function(scroll,view,_callBack){
	
	/*var topView = Ti.UI.createView({width:Ti.UI.FILL,height:Ti.UI.SIZE,top:-45,layout:'vertical'});
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
	scroll.add(topView);*/
	
	scroll.addEventListener('scroll',function(e){
		if ((view.getRect().height - e.y) <= (scroll.getRect().height + 50)) {
			Ti.UI.createAlertDialog({ message: 'Danger, Will Robinson!' }).show();
        }
    });
	
}
