//Application Window Component Constructor
exports.init = function() {
		
	Ti.Facebook.appid = '201613399910723';
	Ti.Facebook.permissions = ['publish_stream'];
	
		var login = require('ui/common/Login');	
		login.init(launchPortal);
		//var checkin = require('ui/common/checkin/Checkin');
		//checkin.init();
}

function launchPortal(){
		var portal = require('ui/common/Portal');		
		portal.init();		
}