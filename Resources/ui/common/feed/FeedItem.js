var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var _profileType,_profileId;
var _deleteFunc;
exports.feedItem = function(_data, detailed, _showHR,profileType,profileId,deleteFunc){
	_profileType = profileType;
	_profileId = profileId;
	_deleteFunc = deleteFunc;
	var bgColor;
	if(_showHR % 2){
		bgColor = "#f4f4f4";
	}else{
		bgColor = "#eeeeee";
	}	
	
	return addShareView(_data,detailed,_showHR,_profileType,_profileId);
};

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


function topRow(_data,_profileType,_profileId){
	var top_line = Titanium.UI.createView(
		 {
		  	left:20,right:0,
		  	top:25,bottom:25,
		  	height:Ti.UI.SIZE,
		  	layout: 'horizontal'
		 }
	);
	
	var user_photo = Titanium.UI.createImageView(
		 {
		  	left:0,backgroundColor:'#ccc',
		  	width:'50',height: '50',borderWidth:3,borderColor:"#eee",
		  	image:_data.photo,
		  	borderRadius: 25,_gotoRecipient:true
		 }
	);
	
	top_line.add(user_photo);	
	
	var h = Ti.UI.createView({left:0,width:Ti.UI.SIZE,height:Ti.UI.SIZE,layout:"horizontal"});
	
	var name_txt = Ti.UI.createLabel({
		height:Ti.UI.SIZE,
		left:0,right:3,width:Ti.UI.SIZE,
  		text:_data.name.split(" ")[0],
  		wordWrap:false,
  		color:'#40a3ff',
  		font: {
         fontSize: 14
    },
    _gotoRecipient:true
	});
	
	var d;
	if(_data.days == 0){
		d = "today";
	}else if(_data.days == 1){
		d = "yesterday";
	}else{
		d = _data.days + " days ago";
	}
	
	
 	var place_txt = Ti.UI.createLabel({
     		left:0,width:Ti.UI.SIZE,
			height:Ti.UI.SIZE,
			color:"#aaa",
			shadowColor: '#fff',
    		shadowOffset: {x:1, y:1},
    		shadowRadius: 3,
  			text:"flaired " + d,
  			font: {
         		fontSize: 11
    		}
	});
	h.add(name_txt);h.add(place_txt);
	
	
	var recp_layer = Ti.UI.createView({
		layout:"horizontal",left:0,
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE
	});
	if(_data.icon && _data.icon !== 0 && _data.icon !== "0"){
		var flair_icon =  Titanium.UI.createView(
		 	{
		 		left:0,
		  		width: 25,borderRadius:12.5,right:5,
		  		height: 25,backgroundColor:"#f1f1f1",
		  		backgroundImage:"images/flairs/100/" + _data.icon + ".png"
			 }
		);	
		recp_layer.add(flair_icon);
	}
	
	var recp_name = Ti.UI.createLabel({
     		left:0,width:Ti.UI.SIZE,
			height:Ti.UI.SIZE,
			color:"#aaa",
			shadowColor: '#fff',
    		shadowOffset: {x:1, y:1},
    		shadowRadius: 3,
  			text:_data.recipientname,
  			font: {
         		fontSize: 24
    		}
	});
recp_layer.add(recp_name);
	
	var desc_txt = Ti.UI.createLabel({
		height:20,width:Ti.UI.SIZE,
		left:0,
  		text:"@ " + _data.placename + ", " + _data.city,
  		wordWrap:false,
  		color:'#40a3ff',
  		font: {
         fontSize: 11
        }
    });
    
    var city_txt = Ti.UI.createLabel({
     		left:0,width:Ti.UI.SIZE,
			height:Ti.UI.SIZE,
			color:"#aaa",
			shadowColor: '#fff',
    		shadowOffset: {x:1, y:1},
    		shadowRadius: 3,
  			text:"in " + _data.city +", a month ago",
  			font: {
         		fontSize: 11
    		}
	});
    
	var name_view = Ti.UI.createView({
		width:240,top:0,left:10,
		layout:"vertical",
		height:Ti.UI.SIZE
	});
	
	
	name_view.add(h);
	//name_view.add(place_txt);
	name_view.add(recp_layer);
	name_view.add(desc_txt);
	//name_view.add(city_txt);
	
	
	if(_data.approved == "0" || _data.approved == 0){
		var approved = Ti.UI.createLabel({
			left:3,
			height:Ti.UI.SIZE,
			color:"#990000",
  			text:"(submitted for approval)",
  			font: {
         		fontSize: 14
    		}
		});
		name_view.add(approved);
	}
	
	top_line.add(name_view);
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

function addShareView(_data,detailed,_showHR,_profileType,_profileId){
	var user = login.getUser();
	var row = Ti.UI.createTableViewRow({backgroundColor:'#f1f1f1'});
	var cContainer = Titanium.UI.createView(
		 {
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical',
		  	_data:_data,
		  	_title: 'container'
	});
	
    cContainer.add(topRow(_data,_profileType,_profileId));

	
	if(true){
		cContainer.addEventListener('singletap',function(e){
			var win;
		    if((_profileType !=="user" && _profileId !== _data.uid ) && (e.source._gotoRecipient === true || (_profileType == "place" && _profileId == _data.pid))){
		    				win = require('ui/common/userProfile/UserProfile');
							var photo_big;
							if(_data.photo_big){
								photo_big = _data.photo_big;
							}else{
								photo_big = "images/flairs/300/" + _data.flair + ".png";
							}
							portal.open(win.init(_data.uid,_data.name,_data.photo_big,_data.photo));	
			}else{
					    
				  		  var placeView = require('ui/common/place/Place');
		                  portal.open(placeView.init({vicinity:_data.vicinity,lat:_data.lat,lng:_data.lng,pid:_data.pid,name:_data.placename,launchRecepient:_data.recipient,launchEName:_data.recepientname}));
			}
		});
	}
	
	if(user){
		if(_data.uid === user.getId()){
			cContainer.addEventListener('longpress',function(e){	
		  		deleteFlair(row,_data);
			});
		}
	}
	
	//cContainer.add(thumb);
	//cContainer.add(cRight);
	
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
	
	cContainer.add(Ti.UI.createView({top:0,bottom:0,backgroundImage: 'images/feed/like_hr.png',
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
    		row.setBackgroundColor("#f1f1f1");
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