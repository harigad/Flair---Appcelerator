
var profileView = require('ui/common/userProfile/UserProfileView');

exports.init = function(id,name,photo){

	var main = Titanium.UI.createWindow({
    	backgroundColor: '#eee',
    	navBarHidden:false ,barColor:'#fff'	
	});
	
	main.add(profileView.init(id,name,photo));
	
	main.addEventListener("hide",function(e){
		cleanWindow(main);
	});
	
	return main;
}

function cleanWindow( winObj ) {
    if (winObj.children) {
        Ti.API.info("Children: "+winObj.children);
        for (var i = winObj.children.length; i > 0; i--){
        //I added the below line to try and reset the child back to nothing before removing it, but this return an out of bounds error.
        //winObj.children[i-1] = null;
        var view = winObj.children[i-1];
        winObj.remove(view);
        view = null;
        
        }
 
    }
    
    winObj = null;
}