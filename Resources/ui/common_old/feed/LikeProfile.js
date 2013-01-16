
exports.init = function(_data) {
	Ti.API.debug("printing feedProfile");

	var main = Ti.UI.createWindow({			
    	hideNavBar:true,
    	backgroundColor:'#42698d'
	});

	var outer =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 'auto',
		  	top:170,
		  	left:0,
		  	layout:'vertical'
		 }
	);
	
	outer.add(_create(main,_data,0,_data.recipientname,'#42698d','#6388aa',false));	
	outer.add(_create(main,_data,1,_data.food,'#99452b','#c26447',true));	
	outer.add(_create(main,_data,2,_data.placename,'#54733e','#84ab68',true));
	
	main.add(outer);

	main.open();
	
}


function _create(main,_data,_type,_name,_bgColor,_color,_showHr){
	var outer =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 100,
		  	left:0,
		  	layout: 'horizontal',
		  	backgroundColor:_bgColor
		 }
	);
	
	var inner =  Titanium.UI.createView(
		 {
		  	width: 50,
		  	height: 50,
		  	borderRadius:4,
		  	left:20,
		  	top:16
		 }
	);
	
	var name_txt = Ti.UI.createLabel({
		height:'auto',
		left:20,
		width:'230',
  		text:_name,
  		wordWrap:false,
  		color:_color,
  		top:16,
  		font: {
         fontSize: 42,
         fontWeight: 'bold'
    	}		
	});
	
	if(_showHr){
		outer.add(_hr());
	}
	
	outer.add(inner);
	outer.add(name_txt);
	
	outer.addEventListener("click", function(){
		processLike("add",_type,_data,main);
	});
	
	return outer;
	
}

function processLike(_action,_type,_data,main){
		var that = this;

		var url = "http://flair.me/search.php";
		var _dataStr = {};
		
		_dataStr.type = "like";
		_dataStr.likeType = _type;
		_dataStr.action = _action;
		
		if(_data.fid){
		_dataStr.fid = _data.fid;
		}else if(_data.coid){
		_dataStr.coid = _data.coid;	
		}
		_dataStr.accessToken=Ti.Facebook.getAccessToken();
	
 	var client = Ti.Network.createHTTPClient({
     onload : function(e) {
     	 Ti.API.debug('loaded data from processLike');
     },
     onerror : function(e) {
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
 	});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);
		
	main.close();
}




function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/like_hr.png',
		  	backgroundRepeat: true,
		  	height:9,
		  	top:0,bottom:0,
		  	width:'100%'
		 }
	);
}



