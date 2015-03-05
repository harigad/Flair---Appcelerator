
var profileView = require('ui/common/userProfile/UserProfileView');
var portal = require('ui/common/Portal');

exports.init = function(id,name,photo_big,photo){

	var main = Titanium.UI.createWindow({
    	backgroundColor: '#40a3ff',
    	navBarHidden:true ,barColor:'#40a3ff'	
	});
	
	Ti.App.addEventListener("close_all",function(){
		portal.close(main);
	});
	
	var head = header(main);
	main.add(profileView.init(id,name,photo_big,photo,function(e){
		if(e){
			head.setBackgroundColor("#40a3ff");
		}else{
			head.setBackgroundColor("transparent");
		}
	}));
	main.add(head);
	
	main.addEventListener("hide",function(e){
		cleanWindow(main);
	});
	
	return main;
};

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

function header(win){
	var h = Ti.UI.createView({top:0,height:60,width:Ti.UI.FILL});
	var left = Ti.UI.createView({top:20,left:20,width:22,height:30,backgroundImage:"images/left_btn.png"});
	h.add(left);
	
	
	left.addEventListener("click",function(){
		portal.close(win);
	});
	
	
	var home = Ti.UI.createView({top:20,right:20,width:36,height:30,backgroundImage:"images/home_icon.png"});
	h.add(home);
	
	home.addEventListener("click",function(){
		Ti.App.fireEvent("close_all");
	});
	
	return h;
}