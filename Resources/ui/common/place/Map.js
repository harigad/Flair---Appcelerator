var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var map = require('ti.map');
exports.init = function(_data){
	var main = Ti.UI.createWindow({	
	   	backgroundColor: '#fff',
	   	navBarHidden:true,barColor:'#fff'
	});

	Ti.App.addEventListener("close_all",function(){
		portal.close(main);
	});
	
	var view = Titanium.UI.createView(
		 {
		 	top:'0',backgroundColor: '#fff',
		 	height:Ti.UI.FILL,
		  	layout: 'vertical'
		 }
	);
	
	var annotations = [
    map.createAnnotation({
        latitude: _data.lat,
        longitude: _data.lng,
        title: _data.title,
     //   subtitle: '',
        animate: true,
        pincolor: map.ANNOTATION_GREEN
    })];
		
	var mapView = map.createView({
    mapType: map.NORMAL_TYPE,
    region:{latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.02, longitudeDelta:0.02},
    animate:true,
    regionFit:true,
    userLocation:false,
    annotations: annotations
   });
	
	mapView.addEventListener("complete",function(e){
   		mapView.region = {
   			latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.02, longitudeDelta:0.02
   		};
   	});
   	
  
	
  var mapViewCont_outer = Titanium.UI.createView(
		 {
		 	left:0,right:0,top:0,bottom:0,
		    backgroundColor:"#fff",
		    layout:"vertical"
		 }
   );
   
   var addrV = Ti.UI.createView({
   	layout:"horizontal",left:10,right:10,backgroundColor:"#fff",borderRadius:8,
   	height:Ti.UI.SIZE,bottom:10
   });
   
   var phone = Ti.UI.createImageView({
   	image:"images/phone.png",top:10,bottom:10,
   	width:50,height:50,left:20
   });
   
   phone.addEventListener("click",function(){
   	    Ti.API.error(_data.phone);
   	    var p = "";
   	    if(_data.phone){
   	    	p = _data.phone.replace(/[^A-Z0-9]+/ig, "");
   	    }
   		Ti.Platform.openURL('tel://' + p); 
   });
   
    addrV.add(phone);
   	var addr = Ti.UI.createLabel({
		left:20,right:20,height:Ti.UI.SIZE,top:10,bottom:10,
		color:"#333",
		font:{
			fontSize:14
		},
		text:_data.vicinity || _data.city
	});
	
	addrV.add(addr);
	//mapViewCont_outer.add(Ti.UI.createView({height:20,backgroundColor:"#666"}));
	
   var mapViewCont = Titanium.UI.createView(
		 {
		 	top:0,left:0,right:0,bottom:0
		 }
	);	
	
	mapViewCont.add(mapView);
	mapViewCont_outer.add(mapViewCont);
	
	mapView.add(addrV);
	
	
	
	
    view.add(mapViewCont_outer);
    
    main.add(view);
    main.add(header(main));

	return main;

};

function header(win){
	var h = Ti.UI.createView({top:15,height:40,width:Ti.UI.FILL});
	var left = Ti.UI.createView({left:20,width:22,height:30,backgroundImage:"images/left_btn_dark.png"});
	h.add(left);
	
	
	left.addEventListener("click",function(){
		portal.close(win);
	});
	
	var home = Ti.UI.createView({right:20,width:36,height:30,backgroundImage:"images/home_icon_dark.png"});
	home.addEventListener("click",function(){
		Ti.App.fireEvent("close_all");
	});
	
	h.add(home);
	return h;
}