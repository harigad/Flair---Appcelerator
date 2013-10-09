var portal = require('ui/common/Portal');
var login = require('ui/common/Login');

exports.init = function(_data){
	var main = Ti.UI.createWindow({	
	   	backgroundColor: '#eee',
	   	navBarHidden:false,barColor:'#cecece'
	});
	
	var view = Titanium.UI.createView(
		 {
		 	top:'0',
		 	height:Ti.UI.FILL,
		  	layout: 'vertical'
		 }
	);
	
	var annotations = [
    Ti.Map.createAnnotation({
        latitude: _data.lat,
        longitude: _data.lng,
        title: _data.title,
     //   subtitle: '',
        animate: true,
        pincolor: Ti.Map.ANNOTATION_GREEN
    })];
		
	var mapView = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    region:{latitude:_data.lat, longitude:_data.lng, latitudeDelta:0.05, longitudeDelta:0.05},
    animate:true,
    regionFit:true,
    userLocation:false,
    annotations: annotations
   });
	
  var mapViewCont_outer = Titanium.UI.createView(
		 {
		 	top:'0',left:0,right:0,top:0,
		  	height: Ti.UI.FILL,
			layout:'vertical'
		 }
   );
	
   var mapViewCont = Titanium.UI.createView(
		 {
		 	top:'0',left:0,right:0,top:0,bottom:0,
		 	width:Ti.UI.FILL,
		  	height: Ti.UI.FILL
		 }
	);	
	
	mapViewCont.add(mapView);
	mapViewCont_outer.add(mapViewCont);
	
    view.add(mapViewCont_outer);
    
    main.add(view);

	return main;

}