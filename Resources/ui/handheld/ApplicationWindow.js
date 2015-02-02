//Application Window Component Constructor
exports.init = function() {
	//var login = require('ui/common/Login');
//	login.logout();	
	//var db = require('ui/common/data/DB');
	//db.open();	

	//	var login = require('ui/common/Login');	
		//login.init(launchPortal);
		launchPortal();
		//var checkin = require('ui/common/checkin/Checkin');
		//checkin.init();
};

function launchPortal(){
		var portal = require('ui/common/Portal');		
		portal.init();		
}