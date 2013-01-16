var main;
exports.init = function(){
	main = Ti.UI.createWindow({	
		backgroundColor: '#fff',
    	title: 'Checkin',    	
    	barColor:'#aaa',
    	barImage: 'images/home/shadow.png' 
	});
	
	var view = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: '177',
		  	backgroundImage: 'images/checkin/bg.png',
		  	top:0
		 }
	);	
	
	var txtField = Ti.UI.createTextField({
  		value:'',
  		width:220,
  		top:50,
  		hintText:'Plate #',
  		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_ALL,
  		returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  		font: {
         		fontSize: 50
    		}		
	});	
	
	view.add(txtField);
	main.add(view);
	
	return main;
}
