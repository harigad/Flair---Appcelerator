var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var UserWin = require('ui/common/userProfile/UserProfile');
var PlaceWin = require('ui/common/place/Place');

var roleNames = ["","now the Founder/CEO of","now an Investor @","now an Advisor for","now a Team Member @","now a key Marketing/Web Guru for"];
		               
exports.init = function(_data, detailed, _showHR,_profileType,_profileId){
	
	var cont = Ti.UI.createView({
		  left:10,
		  right:10,top:10,bottom:0,backgroundColor:"#fff",borderRadius:4,borderWidth:0.5,borderColor:'#ddd',
		  height:Ti.UI.SIZE,
		  layout: 'horizontal',
		  _data:_data
	});
	
	var user_photo = Titanium.UI.createView(
		 {
		  	left:10,top:10,bottom:10,
		  	width:'60',height: '60',
		  	backgroundImage:_data.photo,
		  	borderRadius: 4, backgroundColor:'#ccc',
    		_gotoUser:true
		 }
	);	
	cont.add(user_photo);	
	
	var top_line = Titanium.UI.createView(
		 {
		  	left:10,right:0,
		  	top:5,width:210,
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical'
		 }
	);
	
	cont.add(top_line);
	
	var name_txt = Ti.UI.createLabel({
		left:0,top:0,
		width:210,height:Ti.UI.SIZE,
  		text:_data.name,
  		wordWrap:false,
  		color:'#333',
  		font: {
         fontSize: 24
    	},
    	_gotoUser:true
	});
	
	top_line.add(name_txt);
	
	var roleName = roleNames[_data.role_id];
	var txtString = "is " + roleName + " " + _data.placename;
		var txt = Ti.UI.createLabel({
        width:210,top:0,
		height:Ti.UI.SIZE,
		color:'#aaa',_color:'#aaa',
  		text:txtString,
  		font: {
         fontSize: 14
    	}
		});
		
		top_line.add(txt);
		
			cont.addEventListener('singletap',function(e){
		    if(e.source._gotoUser === true ){
		    			  if(_profileType == "user" && _profileId == _data.uid){
								return;
						  }
			              portal.open(UserWin.init(_data.uid,_data.name,_data.photo_big));	
			}else{
					      if(_profileType == "place" && _profileId == _data.pid){
								return;
						  }
					      portal.open(PlaceWin.init({vicinity:_data.vicinity,lat:_data.lat,lng:_data.lng,pid:_data.pid,name:_data.placename,launchRecepient:_data.recipient,launchEName:_data.recepientname}));
			}
		});
		
	return cont;
	
};



