//Application Window Component Constructor
exports.init = function() {
		
	var db = require('ui/common/data/DB');
	db.open();	

		var login = require('ui/common/Login');	
		login.init(launchPortal);
		//var checkin = require('ui/common/checkin/Checkin');
		//checkin.init();
}

function launchPortal(){
		var portal = require('ui/common/Portal');		
		portal.init();		
}