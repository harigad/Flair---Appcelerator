

exports.init = function(_callBack) {
			this._callBack = _callBack;
			var signup = require('ui/common/signup/Signup1');			
			signup.init(signup1Callback);
}


function signup2Callback(){
	signup2.close();
	Ti.App.fireEvent('launch_portal');
}

function signup2Errback(){

}

function signup1Callback(_data) {
	var Signup2 = require('ui/common/signup/Signup2');
	signup2 = new Signup2(signup2Callback,_data);
	signup2.open();
	signup1.hide();
}