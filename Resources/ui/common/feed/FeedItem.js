var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
exports.feedItem = function(_data, detailed, _showHR,_profileType,_profileId){
	var bgColor;
	if(_showHR % 2){
		bgColor = "#f4f4f4";
	}else{
		bgColor = "#eeeeee";
	}	
	
	return addShareView(_data,detailed,_showHR,_profileType,_profileId);
}

function _createThumb(_data,index,_profileType,_profileId){
	
	var photo;
	
	var user = login.getUser();
	
	if(_data.recipient_photo && _data.recipient !== user.getId() && !(_profileType == "user" && _profileId == _data.recipient)){
		photo = _data.recipient_photo;
	}else{
		photo = "images/flairs/100/" + _data.flair + ".png";
	}
	
	var inner =  Titanium.UI.createView(
		 {
		 	left:0,
		  	width: 25,borderRadius:12.5,right:5,
		  	height: 25,backgroundColor:"#f1f1f1",
		  	backgroundImage:photo,
		  	_gotoRecipient:true 	
		  
		 }
	);	
	
	return inner;

}

function addShareView(_data,detailed,_showHR,_profileType,_profileId){
	var user = login.getUser();
	
	//var thumb = _createThumb(_data,_showHR,_profileType,_profileId);	
	
	var cRight = Titanium.UI.createView(
		 {
		  	top:5,
            height:Ti.UI.SIZE,
		  	layout: 'vertical',
		 }
	);	
	
	var top_line = Titanium.UI.createView(
		 {
		  	left:10,right:10,
		  	top:0,
		  	height:'40',
		  	layout: 'horizontal'
		 }
	);
	
	var user_photo = Titanium.UI.createView(
		 {
		  	left:0,
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
		left:3,
		width:'205',
  		text:_data.name,
  		wordWrap:false,
  		color:'#ccc',
  		font: {
         fontSize: 40
    	},
    	_dontUseParentEventListener:true		
	});
	
	top_line.add(name_txt);
		
	var flair_details = Titanium.UI.createView(
		 {
		 	layout: 'horizontal',
		 	left:10,right:10,
		 	height:Ti.UI.SIZE,
		 	top:0,bottom:0
		 }
	);	

    var text_container = Titanium.UI.createView(
		 {
		 	layout: 'vertical',height:Ti.UI.SIZE,
		 	width:280,left:0,top:0,
		 }
	);	

 
	var _first_txt = _data.adjective + " " +  _data.food;// + " by " + _data.recipientname;
		var _second_lbl = Ti.UI.createLabel({
        width:280,top:0,
		height:Ti.UI.SIZE,
		color:'#111',_color:'#111',
  		text:_first_txt,
  		font: {
         fontSize: 18
    	},
    	_userParentEventListener:true
		});

	
	text_container.add(_second_lbl);
	var _recpColor;
	
	if(_data.recipient){
		_recpColor = "#2179ca";
	}else{		
		_recpColor = "#aaa";
	}
	
	var _footer = Ti.UI.createLabel({
     	left:0,width:220,
		height:Ti.UI.SIZE,
		color:'#aaa',
  		text:"@ " + _data.placename + ", " + _data.city,
  		font: {
         fontSize: 14
    	},
    	_userParentEventListener:true
	});
	
	var text_container_second_line = Titanium.UI.createView(
		 {
		 	layout: 'horizontal',height:Ti.UI.SIZE,
		 	width:280,left:0,top:0,
		 }
	);	

	//if(thumb){
	//	text_container_second_line.add(thumb);
	//}
	
	text_container_second_line.add(_footer);
	text_container.add(text_container_second_line);
	
	flair_details.add(text_container);
	if(_data.headerLikedName){
		cRight.add(print_liked_header(_data.headerLikedName,_data.headerLikedCount));
	}
	cRight.add(top_line);
	//cRight.add(Ti.UI.createView({top:5,height:1,backgroundColor:"#eee",width:Ti.UI.FILL}));
	cRight.add(flair_details);
	
	var likeView = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	height:'40'
		 }
	);	
	if(!detailed){
	var likeMaker = require('ui/common/feed/Likes');
		likeView.add(likeMaker.init(_data));	
		cRight.add(likeView);
	}
	//--------------------------------------------------------------------------------------------------------------------
	var borderWidth;
	var bgColor;
	if(detailed){
		borderWidth = 0;
		bgColor = "#fff";
	}else{
		borderWidth = 0.5;
		bgColor = "#fff";
	}
	
	var cContainer = Titanium.UI.createView(
		 {
		  	left:10,
		  	right:10,top:10,backgroundColor:bgColor,borderRadius:4,borderWidth:borderWidth,borderColor:'#ddd',
		    height:Ti.UI.SIZE,
		  	layout: 'horizontal',
		  	_data:_data,
		  	_title: 'container',
		  	_name_txt: name_txt,
		  	_flair_details: flair_details
		 }
	);
	
	if(true){
		cContainer.addEventListener('singletap',function(e){
			
			var win;
			
		    if(e.source._dontUseParentEventListener === true ){
		    			  if(_profileType == "user" && _profileId == _data.uid){
								return;
						  }
						  win = require('ui/common/userProfile/UserProfile');
			              portal.open(win.init(_data.uid,_data.name,_data.photo_big));	
			}else if(e.source._gotoRecipient === true){
							if(_profileType == "user" && _profileId == _data.recipient){
								return;
							}
							win = require('ui/common/userProfile/UserProfile');
							var photo_big;
							if(_data.recipient_photo_big){
								photo_big = _data.recipient_photo_big;
							}else{
								photo_big = "images/flairs/300/" + _data.flair + ".png";
							}
							portal.open(win.init(_data.recipient,_data.recipient_name,photo_big));	
			}else{
					    
					    if(_profileType == "place" && _profileId == _data.pid){
								return;
						}
					    
					      win = require('ui/common/userProfile/UserProfile');
				  		  var placeView = require('ui/common/place/Place');
		                  portal.open(placeView.init({vicinity:_data.vicinity,lat:_data.lat,lng:_data.lng,pid:_data.pid,name:_data.placename,launchRecepient:_data.recipient,launchEName:_data.recepientname}));
			}
		});
	}
	
	if(user){
		if(_data.uid === user.getId()){
			cContainer.addEventListener('longpress',function(e){	
		  		deleteFlair(cContainer);
			});
		}
	}
	
	//cContainer.add(thumb);
	cContainer.add(cRight);
	
/*	if(_data.approved !== "1" && _data.approved !== 1){
		var appr = Ti.UI.createView({
		height:Ti.UI.SIZE,bottom:10,
		backgroundColor:'#ddd',width:Ti.UI.FILL
		});
		
		var appr_lbl = Ti.UI.createLabel({
			text: "waiting for approval",left:10,
			color: "#fff",top:5,bottom:5,height:Ti.UI.SIZE,width:Ti.UI.SIZE,
			font: {
				fontSize:11	
			}
		});
			
		appr.add(appr_lbl);		
		cContainer.add(appr);

	}*/
	return cContainer;
}

function deleteFlair(cContainer){
	
			var dialog = Ti.UI.createAlertDialog({
    			cancel: -1,
    			buttonNames: ['Delete', 'Cancel'],
    			message: 'Delete this Flair?'
   			 });
   			 
   			  dialog.addEventListener('click', function(e){
      			Ti.API.debug('edit share dialog button clicked with index ' + e.index);
    			if (e.index === 0){
    					delete_flair_from_server(cContainer._data.fid);
    				    cContainer._parentView.remove(cContainer);		
    				    portal.setDirty(cContainer._data.uid);
    				    portal.setDirty(cContainer._data.recipient);
    			}else{
    		//do nothing
    		cContainer.setBackgroundColor("#fff");
    			}
   			 });
   			 
   			 cContainer.setBackgroundColor("#990000");
   			 dialog.show();
	
}


function print_liked_header(_name,_data){
	var _bgColorX = "#990000";
	var _bgColorY = "#009900";
	var _bgColorZ = "#000099";
	
	var  container = Ti.UI.createView({
		height:Ti.UI.SIZE,
		width:Ti.UI.FILL,
		layout:'horizontal'
	});
	
	var liked_name = Ti.UI.createLabel({
		height:Ti.UI.SIZE,
		left:0,right:5,
		top:0,
		width:Ti.UI.SIZE,
  		text:_name + " likes this!",
  		color:'#aaa',
  		font: {
         fontSize: 11
    	}	
	});
	container.add(liked_name);
	
	var  c = Ti.UI.createView({
		height:Ti.UI.SIZE,top:6,
		width:'auto',
		layout:'horizontal'
	});
	container.add(c);
	
	var _width = 90;//290 - liked_name.width; 
	
	if(_data == 1){
		c.add(print_individual_like(_bgColorX,_width));
	}if(_data == 2){
		c.add(print_individual_like(_bgColorY,_width));
	}else if(_data == 3){
		c.add(print_individual_like(_bgColorZ,_width));
	}else if(_data == 4){
		c.add(print_individual_like(_bgColorX,(_width/2)));
		c.add(print_individual_like(_bgColorY,(_width/2)));
	}else if(_data == 5){
		c.add(print_individual_like(_bgColorX,(_width/2)));
		c.add(print_individual_like(_bgColorZ,(_width/2)));
	}else if(_data == 6){
		c.add(print_individual_like(_bgColorY,(_width/2)));
		c.add(print_individual_like(_bgColorZ,(_width/2)));
	}else if(_data == 7){
		c.add(print_individual_like(_bgColorX,(_width/3)));
		c.add(print_individual_like(_bgColorY,(_width/3)));
		c.add(print_individual_like(_bgColorZ,(_width/3)));
	}
	
	return container;
}

function print_individual_like(_bgColor,_width){
		return Ti.UI.createView({
			height:2,left:1,top:0,
			width:_width + "%",
			backgroundColor:_bgColor,borderRadius:2
		});
}

function delete_flair_from_server(fid){
var url = "http://flair.me/nominate.php";	
	var _data = {action:"delete",fid:fid,accessToken:login.getAccessToken()};
 	 	
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	Ti.API.info(this.responseText);
 	 	//do nothing
 	 },
 	 onerror: function(e){
 		 	//do nothing
 	 }
 	});
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data);
}	