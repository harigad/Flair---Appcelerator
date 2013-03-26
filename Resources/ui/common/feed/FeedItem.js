var portal = require('ui/common/Portal');
exports.feedItem = function(_data, detailed, _showHR){
	var bgColor;
	if(_showHR % 2){
		bgColor = "#f4f4f4";
	}else{
		bgColor = "#eeeeee";
	}	
	
	
		var _tableRow = Ti.UI.createTableViewRow({height:Ti.UI.SIZE});	
		return addShareView(_data,detailed,_showHR);
	
		return _tableRow;
}

function _createThumb(_data,index){
	
	var inner =  Titanium.UI.createView(
		 {
		 	left:0,top:0,
		  	width: 100,
		  	height: 100,
		  	backgroundImage:'images/flairs/100/' + _data.flair + '.png'  	
		  
		 }
	);	
	
	var container = Titanium.UI.createView(
		 {
		 	top:0,left:0,
		 	width: Ti.UI.SIZE,
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);
	
	container.add(inner);
	
	return container;

}

function addShareView(_data,detailed,_showHR){
	var thumb = _createThumb(_data,_showHR);	
	
	var cRight = Titanium.UI.createView(
		 {
		  	left:10,right:10,
		  	top:5,
            height:Ti.UI.SIZE,
		  	layout: 'vertical',
		 }
	);	
	
	var top_line = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	height:'40',
		  	layout: 'horizontal'
		 }
	);
	
	var user_photo = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:7,
		  	width:'30',height: '30',
		  	backgroundImage:_data.photo,
		  	borderRadius: 2, backgroundColor:'#ccc',_dontUseParentEventListener:true
		 }
	);	
	
	/*var user_photo = Ti.UI.createImageView({
  			image: _data.photo,
  			width: '30',
  			height: '30',
  			left: 0,
  			top:3 			
	});*/
		

	top_line.add(user_photo);	
	
	var name_txt = Ti.UI.createLabel({
		height:40,
		left:8,
		top:3,
		width:'205',
  		text:_data.name,
  		wordWrap:false,
  		color:'#2179ca',
  		font: {
         fontSize: 40
    	},
    	_dontUseParentEventListener:true		
	});
	top_line.add(name_txt);
		
	var flair_details = Titanium.UI.createView(
		 {
		 	layout: 'horizontal',
		 	left:0,
		 	height:Ti.UI.SIZE,
		 	top:5,bottom:0
		 }
	);	

    var text_container = Titanium.UI.createView(
		 {
		 	layout: 'vertical',height:Ti.UI.SIZE,
		 	width:170,left:5
		 }
	);	

 
	var _first_txt = _data.adjective + _data.food + " by " + _data.recipientname;
		var _second_lbl = Ti.UI.createLabel({
        width:170,
		height:Ti.UI.SIZE,
		color:'#333',_color:'#333',
  		text:_first_txt,
  		font: {
         fontSize: 18
    	},
    	_userParentEventListener:true
		});

	flair_details.add(thumb);
	text_container.add(_second_lbl);
	var _recpColor;
	
	if(_data.recipient){
		_recpColor = "#2179ca";
	}else{		
		_recpColor = "#aaa";
	}
	
	
	var _footer = Ti.UI.createLabel({
     	left:0,top:0,width:170,
		height:Ti.UI.SIZE,
		color:'#aaa',
  		text:_data.city,
  		font: {
         fontSize: 11
    	},
    	_userParentEventListener:true
	});
	
	text_container.add(_footer);
	flair_details.add(text_container);
	cRight.add(top_line);
	cRight.add(flair_details);
	
	
	var likeView = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	height:'40'
		 }
	);	
	
	var likeMaker = require('ui/common/feed/Likes');
	likeView.add(likeMaker.init(_data));	
	
	cRight.add(likeView);
	//--------------------------------------------------------------------------------------------------------------------
	
	var cContainer = Titanium.UI.createView(
		 {
		  	left:10,
		  	right:10,top:10,backgroundColor:'#fff',borderRadius:4,borderWidth:0.5,borderColor:'#ddd',
		    height:Ti.UI.SIZE,
		  	layout: 'horizontal',
		  	_data:_data,
		  	_title: 'container',
		  	_name_txt: name_txt,
		  	_flair_details: flair_details
		 }
	);
	
	
	
	if(!detailed){
		cContainer.addEventListener('singletap',function(e){
			
		    if(!e.source._dontUseParentEventListener === true ){
				var win = require('ui/common/userProfile/UserProfile');
				  		  var placeView = require('ui/common/place/Place');
		                  portal.open(placeView.init({vicinity:_data.vicinity,lat:_data.lat,lng:_data.lng,pid:_data.pid,name:_data.placename,launchRecepient:_data.recipient,launchEName:_data.recepientname}));
				}else{
				var win = require('ui/common/userProfile/UserProfile');
			              portal.open(win.init(_data.uid,_data.name,_data.photo_big));	
			}
		});

	}
	
	//cContainer.add(thumb);
	cContainer.add(cRight);
	
	return cContainer;
}

