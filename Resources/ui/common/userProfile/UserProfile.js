
var profileView = require('ui/common/userProfile/UserProfileView');
var portal = require('ui/common/Portal');

exports.init = function(id,name,photo_big,photo,icon){

	var main = Titanium.UI.createWindow({
    	backgroundColor: '#fff',
    	navBarHidden:true ,barColor:'#fff'	
	});
	
	Ti.App.addEventListener("close_all",function(){
		portal.close(main);
	});
	
	var head = header(main);
	var photoC = Ti.UI.createView({backgroundColor:"#999",width:Ti.UI.FILL,height:Ti.UI.SIZE,top:0});
	
	if(!photo){
		icon =  Math.round(Math.random()*8);
		photo_big = "images/flairs/100/" + icon + ".png";
	}
	
	var photoV = Ti.UI.createImageView({opacity:0.25,image:photo_big,width:Ti.UI.FILL});
	photoC.add(photoV);
	main.add(photoC);
	main.add(profileView.init(id,name,photo_big,photo,icon,function(e){
		if(e){
			head.setBackgroundColor("#fff");
			head.left_btn.setBackgroundImage("images/left_btn_dark.png");
			head.right_btn.setBackgroundImage("images/home_icon_dark.png");
		}else{
			head.setBackgroundColor("transparent");
			head.left_btn.setBackgroundImage("images/left_btn.png");
			head.right_btn.setBackgroundImage("images/home_icon.png");
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
	h.left_btn = left;
	
	left.addEventListener("click",function(){
		portal.close(win);
	});
	
	
	var home = Ti.UI.createView({top:20,right:20,width:36,height:30,backgroundImage:"images/home_icon.png"});
	h.add(home);
	h.right_btn = home;
	home.addEventListener("click",function(){
		Ti.App.fireEvent("close_all");
	});
	
	return h;
}