
var login = require('ui/common/Login');



exports.init = function(data,place,callBack){
	
	var w = Ti.UI.createWindow({
		backgroundColor:"#333",
		theme : "Theme.AppCompat.Translucent.NoTitleBar"
	});
	
	
	var v = Ti.UI.createView({
		height:Ti.UI.SIZE,
		left:20,
		right:20,
		layout:"vertical"
	});
	w.add(v);
	
	var photoViewOuter = Ti.UI.createView({
		width:60,height:60,top:10,
		backgroundColor:"#fff",
		borderRadius:30
	});
	
	photoView = Ti.UI.createImageView({
			width:50,height:50,borderRadius:25,
			image:data.photo
	});
	
	photoViewOuter.add(photoView);
	v.add(photoViewOuter);
	
	var title = Ti.UI.createLabel({
  		top:5,bottom:0,textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		text: data.name,
  			font: {
         		fontSize:30,
    	},
    	color: '#fff'
  		});
  	v.add(title);
	
	
	var submit = Ti.UI.createView({
		top:20,
		left:20,right:20,
		borderRadius:4,height:Ti.UI.SIZE,
		backgroundColor:"#ff004e"
	});
	var label = Ti.UI.createLabel({
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		top:15,bottom:15,color:"#fff",
		text:"REMOVE TEAMMATE"
	});
	
	submit.add(label);
	v.add(submit);
	
	var cancel = Ti.UI.createView({
		top:20,
		left:20,right:20,
		borderRadius:4,height:Ti.UI.SIZE,
		backgroundColor:"#999"
	});
	var clabel = Ti.UI.createLabel({
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		top:15,bottom:15,color:"#fff",
		text:"KEEP TEAMMATE"
	});
	
	cancel.add(clabel);
	v.add(cancel);
	
	submit.addEventListener("click",function(){
			 var dialog = Ti.UI.createAlertDialog({
    			cancel: -1,
    			buttonNames: ['Remove', 'Keep'],
    			message: 'Remove ' + data.name
   			 });
   			 
   			  dialog.addEventListener('click', function(e){
    			if (e.index === 0){
    				deleteFromServer(data.rid,place.id,data.uid,function(){
    					callBack();
    					w.close();
    				});
    			}else{
    					w.close();
    			}
   			 });
   			 dialog.show();
	
	});
	
	cancel.addEventListener("click",function(){
		w.close();
	});
	
	w.open();
	
};


function deleteFromServer(rid,pid,uid,callBack){
		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "deleteTeammate";
		_dataStr.rid = rid;
		_dataStr.pid = pid;
		_dataStr.uid = uid;
		_dataStr.accessToken = login.getAccessToken();

Ti.API.error(JSON.stringify(_dataStr));

 	 var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	Ti.API.error(this.responseText);
     	callBack();
     },
     onerror : function(e) {
     	callBack();
     	 Ti.API.error('error loading data for Place -> ' + pid);
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
}
