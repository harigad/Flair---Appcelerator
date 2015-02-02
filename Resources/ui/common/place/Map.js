var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var map = require('ti.map');
exports.init = function(_data){
	var main = Ti.UI.createWindow({	
	   	backgroundColor: '#40a3ff',
	   	navBarHidden:true,barColor:'#40a3ff'
	});

	
	var view = Titanium.UI.createView(
		 {
		 	top:'0',backgroundColor: '#40a3ff',
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
    region:{latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.05, longitudeDelta:0.05},
    animate:true,
    regionFit:true,
    userLocation:false,
    annotations: annotations
   });
	
	mapView.addEventListener("complete",function(e){
   		mapView.region = {
   			latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.05, longitudeDelta:0.05
   		};
   	});
	
  var mapViewCont_outer = Titanium.UI.createView(
		 {
		 	left:0,right:0,top:0,bottom:0,
		    backgroundColor:"#40a3ff",
		    layout:"vertical"
		 }
   );
   
   	var addr = Ti.UI.createLabel({
		top:65,left:20,right:20,height:Ti.UI.SIZE,bottom:20,
		color:"#fff",
		font:{
			fontSize:16
		},
		text:_data.vicinity || _data.city
	});
	
	mapViewCont_outer.add(addr);
	mapViewCont_outer.add(Ti.UI.createView({height:20,backgroundColor:"#fff"}));
	
   var mapViewCont = Titanium.UI.createView(
		 {
		 	top:0,left:0,right:0,bottom:0
		 }
	);	
	
	mapViewCont.add(mapView);
	mapViewCont_outer.add(mapViewCont);
	
    view.add(mapViewCont_outer);
    
    main.add(view);
    main.add(header(main));

	return main;

};

function header(win){
	var h = Ti.UI.createView({top:15,height:40,width:Ti.UI.FILL});
	var left = Ti.UI.createView({left:20,width:22,height:30,backgroundImage:"images/left_btn.png"});
	h.add(left);
	
	
	h.addEventListener("click",function(){
		portal.close(win);
	});
	
	var home = Ti.UI.createView({right:20,width:36,height:30,backgroundImage:"images/home_icon.png"});
	h.add(home);
	return h;
}