var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var _colors = [
"ff004e",
"008aff",
"ff2a00",
"33c500",
"ff5a00",
"ffb400"
];
var i=0;
var scrollView;
var data;
var tStart;
var vertical;
var lastSlided = 1;
var slidesLoaded = false;
exports.init = function(callBack){
	i = 0;
	var main = Titanium.UI.createWindow({
    	backgroundColor: '#ccc',
    	navBarHidden:true ,barColor:'#ccc'	
	});

	Ti.App.addEventListener("close_all",function(){
		portal.close(main);
	});

	scrollView = Ti.UI.createView({
  		width: Ti.UI.FILL,height:Ti.UI.FILL,
  		backgroundColor:"#ccc",
  		layout:"vertical"
	});
	
	main.add(scrollView);
	main.add(header(main,callBack));
    
    loadData(scrollView);
    portal.open(main);
};

function loadData(view){
		var _loadingPlace = Ti.UI.createLabel({text:"please wait..",height:Ti.UI.SIZE,left:30,
			color:"#aaa",top:20,
				shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 3,
				font:{
				fontSize:14
				}
		});
		view.add(_loadingPlace);

	 	var that = this;

		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.type = "notifications";
		_dataStr.accessToken = login.getAccessToken();

 	 	var client = Ti.Network.createHTTPClient({
     	onload : function(e) {
     		
     		Ti.API.error(this.responseText);
     		
     		if(_loadingPlace){
				view.remove(_loadingPlace);
			}
     	 	data = JSON.parse(this.responseText);
     	 	build();
     	},
        onerror : function(e) {
        Ti.API.error(e.error);
     	if(_loadingPlace){
			_loadingPlace.setText("Network Error!");
		}
     	
     	
     	 Ti.API.error('error loading data for Place -> ' + pid);
         Ti.API.error(e.error);
     },
     timeout : 5000  // in milliseconds
		});
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
	
}


function sendToServer(dataObj,type){
		var url = "http://services.flair.me/search.php";
		var _dataStr = {};
		_dataStr.fid = dataObj.fid;
		_dataStr.type = type;
		_dataStr.accessToken = login.getAccessToken();

 	    var client = Ti.Network.createHTTPClient({
     	onload : function(e) {
     		// i++;
     		// build();
     	},
     	onerror : function(e) {
     		//i++;
     	 	//build();
     	},
     	timeout : 15000  // in milliseconds
	 });
 
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_dataStr);	
}



function build(){
	scrollView.removeAllChildren();
	
	var btns = Ti.UI.createView({
		height:Ti.UI.SIZE,layout:"vertical",
		bottom:0
	});
	var like = Ti.UI.createView({
		height:Ti.UI.SIZE,
		backgroundColor:"#009900"
	});
	var like_lbl = Ti.UI.createLabel({
		text:"LIKE",
		top:20,bottom:20,
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		color:"#fff",
		font:{
			fontSize:12
		}
	});
	like.add(like_lbl);
	
	var report = Ti.UI.createView({
		height:Ti.UI.SIZE,
		backgroundColor:"#990000"
	});
	var report_lbl = Ti.UI.createLabel({
		text:"REPORT",
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		top:20,bottom:20,
		color:"#fff",
		font:{
			fontSize:12
		}
	});
	report.add(report_lbl);
	
	
	btns.add(like);btns.add(report);
	if(i<data.length){
		var row = buildRow(data[i],i);
		row.add(btns);
		scrollView.add(row);
		row.animate({
			opacity:1,duration:1500
		});
		
		
	}
	
	like.addEventListener("click",function(){
		sendToServer(data[i],"like_a_flair");
		row.animate({
			opacity:0,duration:1000
		},function(){
			i++;
			build();
		});
	});
	report.addEventListener("click",function(){
		sendToServer(data[i],"report_a_flair");
		row.animate({
			opacity:0,duration:1000
		},function(){
			i++;
			build();
		});
	});
	
	if(i >= data.length){
		scrollView.add(Ti.UI.createLabel({
			color:"#999",text:"no more notifications to show",
			height:Ti.UI.SIZE,width:Ti.UI.SIZE,
			top:150
		}));
	}

}

function buildRow(obj,i){
   
   var row_outer = Ti.UI.createView({
   	left:30,
   	right:30,
   	top:80,
   	bottom:50,opacity:0,
   	backgroundColor:"#fff",
   	borderRadius:8});
   
   
   var row_inner = Ti.UI.createView({
   	layout:"vertical",
   	height:Ti.UI.SIZE
   });
   row_outer.add(row_inner);
   
    var photoViewOuter = Ti.UI.createView({
		width:60,height:60,top:10,
		backgroundColor:"#eee",
		borderRadius:30
	});
	
	photoView = Ti.UI.createImageView({
			width:50,height:50,borderRadius:25,
			image:obj.photo
	});
	
   photoViewOuter.add(photoView);
   row_inner.add(photoViewOuter);
   
   var right = Ti.UI.createView({
   	height:Ti.UI.SIZE,layout:"vertical",
   	bottom:80
   });
   
   var label = Ti.UI.createLabel({
  		top:10,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		text: obj.name,
  			font: {
         		fontSize:24,
    	},
    	color: '#'  + _colors[i%6]
  		});
  right.add(label);
  
    var action = Ti.UI.createLabel({
  		top:10,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		text: "sent you a flair",
  			font: {
         		fontSize:14,
    	},
    	color: "#999"
  		});
  right.add(action);
  
  
 if(obj.hash){
  var hash = Ti.UI.createLabel({
  		top:10,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		text: '"' + obj.hash + '"',
  			font: {
         		fontSize:14,
    	},
    	color: "#333"
  		});
  right.add(hash);
 }
  var placename = Ti.UI.createLabel({
  		top:10,bottom:10,
    	width:Ti.UI.SIZE,
  		height:Ti.UI.SIZE,
  		text: "@ " + obj.placename,
  			font: {
         		fontSize:14,
    	},
    	color: '#'  + _colors[i%6]
  		});
  right.add(placename);
  
  
  
  row_inner.add(right);
  
  
  var btnsVertical = Ti.UI.createView({
  	bottom:0,height:Ti.UI.SIZE,layout:"vertical"
  });
 // row_outer.add(btnsVertical);
  
  var like = Ti.UI.createView({
  	height:Ti.UI.SIZE,left:10,right:10,bottom:10,borderRadius:4,
  	backgroundColor:"#009900"
  });
  like.add(Ti.UI.createLabel({
  	text:"Like",top:25,bottom:25,
  	color:"#fff",
  	height:Ti.UI.SIZE,
  	width:Ti.UI.SIZE
  }));
  btnsVertical.add(like);
  
  var report = Ti.UI.createView({
  	height:Ti.UI.SIZE,left:10,right:10,bottom:10,borderRadius:4,
  	backgroundColor:"#990000"
  });
  report.add(Ti.UI.createLabel({
  	text:"Report",top:25,bottom:25,
  	color:"#fff",
  	height:Ti.UI.SIZE,
  	width:Ti.UI.SIZE
  }));
  btnsVertical.add(report);
  
  return row_outer;
}

function like(obj){
	alert('liking');
	//CODE FOR SENDING THE LIKED ACTION TO SERVER WILL GO HERE
}

function report(obj){
  alert('reporting');
  //CODE FOR SENDING THE REPORT ACTION TO SERVER WILL GO HERE	
}

function header(win,callBack){
	var h = Ti.UI.createView({top:0,height:60,width:Ti.UI.FILL});
	var left = Ti.UI.createView({top:20,left:20,width:22,height:30,backgroundImage:"/images/left_btn_dark.png"});
	h.add(left);
	h.left_btn = left;
	
	left.addEventListener("click",function(){
		callBack(data.length-i);
		portal.close(win);
	});
	
	
	var home = Ti.UI.createView({top:20,right:20,width:36,height:30,backgroundImage:"/images/home_icon_dark.png"});
	h.add(home);
	h.right_btn = home;
	home.addEventListener("click",function(){
		callBack(data.length-i);
		Ti.App.fireEvent("close_all");
	});
	
	return h;
}
