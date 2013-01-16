
var profileView = require('ui/common/userProfile/UserProfileView');

exports.init = function(id,name,photo){

	var main = Titanium.UI.createWindow({
    	title: name,    	
    	barColor:'#333',
    	backgroundColor: '#eee'  	
	});	
	
	
	main.add(profileView.init(id,name,photo));
	return main;
}