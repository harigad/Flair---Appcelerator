var portal = require('ui/common/Portal');
exports.feedItem = function(_data, detailed, _showHR){
	
		var _tableRow = Ti.UI.createTableViewRow({height:'auto',borderColor:'#990000'});	
		_tableRow.add(addShareView(_data,detailed,_showHR));
	
		return _tableRow;
}

function _createThumb(_data,index){
	var bgColor;
	
	if(index % 2){
		bgColor = "#fff";
	}else{
		bgColor = "#fff";
	}	
	
	var outer =  Titanium.UI.createView(
		 {
		  	width: 100,
		  	height: 100,
		  	top:8,
		  	bottom:0,
		  	left:5,
		  	right:0,		  
		   	backgroundImage:'images/feed/feed_flair_shadow.png',
		   	_data: _data
		   	
		 }
	);
	
	var inner_bg =  Titanium.UI.createView(
		 {
		  	width: '85',
		  	height: '85',
		  	backgroundColor: bgColor,
		  	borderRadius:4
		 }
	);
	
	var inner =  Titanium.UI.createView(
		 {
		  	width: 70,
		  	height: 70,
		  	backgroundImage:'images/flairs/100/' + _data.flair + '.png'  	
		  
		 }
	);	
	
	inner_bg.add(inner);	
	outer.add(inner_bg);	
	
	var container = Titanium.UI.createView(
		 {
		 	top:0,
			width:105,
		  	height:'135',
		  	layout: 'vertical'
		 }
	);
	
	container.add(outer);
	container.add(Ti.UI.createLabel({
     	left:10,
     	width:100,
		height:'auto',
		color:'#aaa',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		text:"near " + _data.city,
  		font: {
         fontSize: 12
    	},
    	_userParentEventListener:true
	}));
	
	return container;

}

function addShareView(_data,detailed,_showHR){
	var thumb = _createThumb(_data,_showHR);
	
	
	var cRight = Titanium.UI.createView(
		 {
		  	left:5,
		  	top:5,
		  	width:210,
		  	height:'auto',
		  	layout: 'vertical'
		 }
	);	
	
	var top_line = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	width:'200',
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
		  	borderRadius: 2, backgroundColor:'#ccc'
		 }
	);	
	
	/*var user_photo = Ti.UI.createImageView({
  			image: _data.photo,
  			width: '30',
  			height: '30',
  			left: 0,
  			top:3 			
	});*/
		
	user_photo.addEventListener('click',function(){		
			var win = require('ui/common/userProfile/UserProfile');
			portal.open(win.init(_data.uid,_data.name,_data.photo_big));		
	});	
	top_line.add(user_photo);	
	
	var name_txt = Ti.UI.createLabel({
		height:42.5,
		left:0,
		top:0,
		width:'165',
  		text:_data.name,
  		wordWrap:false,
  		color:'#ccc',
  		font: {
         fontSize: 42
    	}		
	});
	top_line.add(name_txt);
	
	name_txt.addEventListener('click',function(){		
		var win = require('ui/common/userProfile/UserProfile');
		portal.open(win.init(_data.uid,_data.name,_data.photo_big));
	});
		
	var flair_details = Titanium.UI.createView(
		 {
		 	layout: 'horizontal',
		 	left:0,
		 	width:'200',
		 	height:'80',
		 	top:0
		 }
	);	

	var _first_txt = _data.adjective + _data.food + " by " + _data.recipientname;
		var _second_lbl = Ti.UI.createLabel({
     	left:0,top:0,
		height:Ti.UI.SIZE,width:200,
		color:'#333',_color:'#333',
  		text:_first_txt,
  		font: {
         fontSize: 18
    	},
    	_userParentEventListener:true
		})	
		
	
	var _recpColor;
	
	if(_data.recipient){
		_recpColor = "#2179ca";
	}else{		
		_recpColor = "#aaa";
	}
	
	cRight.add(top_line);
	cRight.add(_second_lbl);
	
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
		  	left:0,
		  	right:0,
		
		  	layout: 'horizontal',
		  	_data:_data,
		  	_title: 'container',
		  	_name_txt: name_txt,
		  	_flair_details: flair_details
		 }
	);
	
	if(!detailed){
		cContainer.addEventListener('click',function(e){
			//this._cancelClick = true;
			//this.setBackgroundColor('#fff');
			if(e.source.toString() == "[object TiUIView]"  || e.source._userParentEventListener === true ){
				var win = require('ui/common/userProfile/UserProfile');
				if(_data.recipient){
					portal.open(win.init(_data.recipient,_data.recipientname,_data.recipientphoto));
				}else{
					portal.open(win.init("pid:" + _data.pid + "|placename:" + _data.placename + "|photo:images/flairs/300/" + _data.flair + ".png",_data.recipientname,"images/flairs/300/" + _data.flair + ".png"));
				}
			}
		});

	}
	
	cContainer.add(thumb);
	cContainer.add(cRight);
	
	//cContainer.add(_hr());
	
	return cContainer;	
}

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/like_hr.png',
		  	backgroundRepeat: true,
		  	height:9,
		  	top:0,bottom:0,
		  	width:'100%'
		 }
	);
}