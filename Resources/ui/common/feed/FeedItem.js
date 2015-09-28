var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var likes = require('ui/common/feed/Likes');

var _profileType,_profileId;
var _deleteFunc;
exports.feedItem = function(_data, detailed, _showHR,profileType,profileId,deleteFunc,_color){
	_profileType = profileType;
	_profileId = profileId;
	_deleteFunc = deleteFunc;
	var bgColor;
	if(_showHR % 2){
		bgColor = "#fff";
	}else{
		bgColor = "#fff";
	}	
	
	return addShareView(_data,detailed,_showHR,_profileType,_profileId,_color);
};

function _createThumb(_data,index,_profileType,_profileId){
	
	var photo;
	
	var user = login.getUser();
	
	if(_data.recipient_photo && _data.recipient !== user.getId() && !(_profileType == "user" && _profileId == _data.recipient)){
		photo = _data.recipient_photo;
	}else{
		photo = "/images/flairs/100/" + _data.flair + ".png";
	}
	
	var inner =  Titanium.UI.createView(
		 {
		 	left:0,
		  	width: 25,borderRadius:12.5,right:5,
		  	height: 25,backgroundColor:"#fff",
		  	backgroundImage:photo,
		  	_gotoRecipient:true 	
		  
		 }
	);	
	
	return inner;

}


function topRow(_data,_profileType,_profileId,_color){
	var top_line = Titanium.UI.createView(
		 {
		  	left:20,right:0,
		  	top:25,bottom:25,
		  	height:Ti.UI.SIZE,
		  	layout: 'horizontal'
		 }
	);
	
	var leftView = Ti.UI.createView({
		layout:"vertical",
		height:Ti.UI.SIZE,top:0,
		width:Ti.UI.SIZE
	});
	
	
	var user_photo = Titanium.UI.createImageView(
		 {
		  	left:0,backgroundColor:'#ccc',
		  	width:'50',height: '50',borderWidth:3,borderColor:"#eee",
		  	image:_data.photo,top:0,
		  	borderRadius: 25,_gotoUser:true
		 }
	);
	
	var share = Ti.UI.createImageView({
		width:50,height:Ti.UI.SIZE,
		photo:"/images/share_50.png"
			});
	
	leftView.add(user_photo);
	leftView.add(share);
	
	top_line.add(leftView);	

	//###############################
	
	var name_view = Ti.UI.createView({
		width:240,top:0,left:10,
		layout:"vertical",
		height:Ti.UI.SIZE
	});	top_line.add(name_view);
	
	
	//###############################
	
	var d;
	if(_data.days == 0){
		d = "earlier today";
	}else if(_data.days == 1){
		d = "yesterday";
	}else{
		d = _data.days + " days ago";
	}
	
	
	
	var name_txt = Ti.UI.createLabel({
		height:Ti.UI.SIZE,
		left:0,right:0,width:Ti.UI.SIZE,
  		text:_data.name.split(" ")[0] + " flaired " + d,
  		wordWrap:false,
  		color:'#aaa',
  		font: {
         fontSize: 14
    }
	});
	name_view.add(name_txt);
	//###############################
	
	var recp_layer = Ti.UI.createView({
		layout:"horizontal",left:0,
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE
	});
	
	if(_data.recipient_photo){
		var recp_photo = Titanium.UI.createImageView(
		 {
		  	left:0,backgroundColor:'#ccc',right:3,top:0,
		  	width:'40',height: '40',borderWidth:3,borderColor:"#eee",
		  	image:_data.recipient_photo,
		  	borderRadius: 20,_gotoRecipient:true
		 }
		);
		recp_layer.add(recp_photo);
	}
	var recp_name = Ti.UI.createLabel({
     		left:0,width:Ti.UI.SIZE,
			height:Ti.UI.SIZE,
			color:"#" + _color,
			_gotoRecipient:true,
  			text:_data.recipientname,
  			font: {
         		fontSize: 32
    		}
	});
	recp_layer.add(recp_name);
	name_view.add(recp_layer);
	//####################################
	
	var city = Ti.UI.createLabel({
     			left:0,right:5,
				height:Ti.UI.SIZE,
				color:"#" + _color,
  				text:"@ " + _data.placename + ", " + _data.city,
  				font: {
         			fontSize: 14
    			}
	});
	name_view.add(city);
	
	//####################################
	
	if(_data.hash){
			var hash = Ti.UI.createLabel({
     			left:0,right:5,
				height:Ti.UI.SIZE,
				color:"#333",
  				text:'"' + _data.hash + '"',
  				font: {
         			fontSize: 14
    			}
			});
			name_view.add(hash);
	}
	
	//####################################
	if(_data.approved){
	var likeView = Ti.UI.createView({left:0,width:Ti.UI.SIZE,height:Ti.UI.SIZE,layout:"horizontal"});
	var likebtn = Ti.UI.createLabel({
		text:"like",
		font:{
			fontSize:14
		},
		height:Ti.UI.SIZE,width:Ti.UI.SIZE,
		left:0,right:20,
		color:"#" + _color
	});
	var commentbtn = Ti.UI.createLabel({
		text:"comment",
		font:{
			fontSize:11
		},
		height:Ti.UI.SIZE,width:Ti.UI.SIZE,
		left:0,right:20,
		color:"#" + _color
	});
	
	likeView.add(likebtn);
	likeView.add(commentbtn);
	
	var likesV = likes.init(_data,"#" + _color); 
	name_view.add(likesV);
	}
	//####################################
	
	if(!_data.approved){
		var pending = Ti.UI.createLabel({
			text:"Flair sent..waiting for approval",
			color:"#990000",
			left:0,top:3,
			font:{
				fontSize:11
			}
		});
		name_view.add(pending);
	}
	
	return top_line;
}


function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundColor:"#fff",
		  	height:0.5,
		  	top:15,bottom:10,
		  	width:'320'
		 }
	);
}

function addShareView(_data,detailed,_showHR,_profileType,_profileId,_color){
	var user = login.getUser();
	var row = Ti.UI.createTableViewRow({backgroundColor:'#fff',selectedBackgroundColor:"#fff"});
	var cContainer = Titanium.UI.createView(
		 {
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical',
		  	_data:_data,
		  	_title: 'container'
	});
	
    cContainer.add(topRow(_data,_profileType,_profileId,_color));

	
	if(true){
		cContainer.addEventListener('singletap',function(e){
			var win;
		    if(e.source._gotoUser === true && !(_profileType =="user" && _profileId == _data.uid)){ 
		    				win = require('ui/common/userProfile/UserProfile');
							var photo_big;
								if(_data.photo_big){
									photo_big = _data.photo_big;
								}else{
									photo_big = "/images/flairs/100/" + _data.icon + ".png";
								}
							portal.open(win.init(_data.uid,_data.name,_data.photo_big,_data.photo));	
			}else if(e.source._gotoRecipient === true && !(_profileType =="user" && _profileId == _data.recipient)){
						  win = require('ui/common/userProfile/UserProfile');
							portal.open(win.init(_data.recipient,_data.recipientname,_data.recipient_photo_big,_data.recipient_photo,_data.icon));	
			
			}else if(_profileType !=="place" && _profileId !== _data.pid){
					        var placeView = require('ui/common/place/Place');
		                  portal.open(placeView.init({vicinity:_data.vicinity,lat:_data.lat,lng:_data.lng,pid:_data.pid,name:_data.placename,launchRecepient:_data.recipient,launchEName:_data.recepientname}));
						
						   
			}
		});
	}
	
	if(user){
		
		
			cContainer.addEventListener('longpress',function(e){
				Ti.API.error("-" + _profileId + ":" + user.getId());
				if(_data.uid === user.getId() && _profileId){	
		  			deleteFlair(row,_data);
		  		}
			});
		
	}
	
	//cContainer.add(thumb);
	//cContainer.add(cRight);
	
	cContainer.add(Ti.UI.createView({top:0,bottom:0,backgroundImage: '/images/feed/like_hr.png',
		  	height:2,opacity:0.6}));
	row.add(cContainer);
	
	return row;
}

function deleteFlair(row,data){
	
			var dialog = Ti.UI.createAlertDialog({
    			cancel: -1,
    			buttonNames: ['Delete', 'Cancel'],
    			message: 'Delete this Flair?'
   			 });
   			 
   			  dialog.addEventListener('click', function(e){
      			Ti.API.debug('edit share dialog button clicked with index ' + e.index);
    			if (e.index === 0){
    					delete_flair_from_server(data.fid);
    				    portal.setDirty(data.uid);
    				    portal.setDirty(data.recipient);
    				    Ti.API.error("calling delete");
    				    _deleteFunc(row);
    			}else{
    		//do nothing
    		row.setBackgroundColor("#fff");
    			}
   			 });
   			 
   			 row.setBackgroundColor("#990000");
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
var url = "http://services.flair.me/nominate.php";	
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