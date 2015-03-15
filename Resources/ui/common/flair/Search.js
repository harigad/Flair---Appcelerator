var main;
var _tableView;
var _db = require('ui/common/data/DB');
var Portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var confirm = require('ui/common/flair/Confirm_Flair');
var _place;
var _callBack;
var _textField,_textFieldLabl;
var _places;

var serverSearchTimout;
var pleaseWaitTimeout;


exports.reset = function(){
	_textField.setText("");
};

exports.open = function(place,callBack){
	_place = place;
	_callBack = callBack;
	
	main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#eee',barColor:"#fff"
	});
	
	_draw();
	
	main.open();
	setTimeout(function(){
    	_textField.focus();
  },200);
	
};

function _draw(){
	var outer =  Titanium.UI.createView(
		 {
		  	width: Ti.UI.FILL,
		  	height: Ti.UI.FILL,
		  	top:0,
		  	left:0,
		  	layout:'vertical',backgroundColor:'#fff'
		 }
	);
	
	outer.add(_top());
	
	_tableView = Ti.UI.createTableView({
  	 	    height:'auto',left:0,
  	 		top:0,backgroundColor:'#eee'
	});
	outer.add(_tableView);
	
	_tableView.addEventListener("click",function(e){
		var home = require('ui/common/home/Home');	
		
		home.init(function(icon){
			login.init(function(){
				Ti.API.info("->" + e.row._data.ignore);
				if(e.row._data.ignore !== true){
					Ti.API.info("1");
					confirm.init(e.row._data.name,_place.name);
					Ti.API.info("2");
			  		_callBack(e.row._data,icon);
			  		Ti.API.info("3");
			  		main.close();
			 }
			});
			},e.row._data.name);
			
	});
	
	main.add(outer);
	draw_update("");
}

function _top(){	
	var cRight = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	width:Ti.UI.FILL,
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical',backgroundColor:'#40a3ff'
		 }
	);	
		
	var flair_details = Titanium.UI.createView(
		 {
		 	left:0,
		 	width:Ti.UI.FILL,
		 	height:Ti.UI.SIZE,
		 	top:10
		 }
	);	
		
	var _header = header();
	
	_textField.addEventListener("change",function(e){
		   _update();
		if(e.value !==""){
			_textFieldLabl.hide();
		}else{
			_textFieldLabl.show();
		}
	});

	flair_details.add(_header);
	cRight.add(flair_details);
	
	//--------------------------------------------------------------------------------------------------------------------
	
	var cContainer = Titanium.UI.createView(
		 {
		  	backgroundColor: '#fff',
		  	left:0,
		  	right:0,
		  	bottom:0,
		  	height:Ti.UI.SIZE,
		  	layout: 'horizontal'
		 }
	);
	
//	cContainer.add(thumb);
	cContainer.add(cRight);	
	
	return cContainer;	
}


function _update(){
	if(serverSearchTimout){
		clearTimeout(serverSearchTimout);
		serverSearchTimout = null;
	}
	
	if(pleaseWaitTimeout){
		clearTimeout(pleaseWaitTimeout);
		pleaseWaitTimeout = null;
	}
	var txt = _textField.getValue();
	
   	 //pleaseWaitTimeout = setTimeout(function(){
   	 	draw_update(txt);
   	 //},300);
}

function draw_update(txt){	
	var rs = [];
	txt = txt.trim();
	txt = txt.toLowerCase();
	var found = false;
	for (var i=0;i<_place.cast.length;i++){
		
		if(txt.length > 0){
			var lower = _place.cast[i].name.toLowerCase();
			if(lower.search(txt) === -1){
				continue;
			}
		}
		
		
		rs.push(createRow(_place.cast[i]));
  	}
  	
  	if(rs.length === 0){
  		var ignore = (txt.length > 3) ? false:true; 
  		var name = txt.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) || "ex:John Smith";
  		var photo = "images/flairs/100/1.png";
  		
  		rs.push(createRow({name:name,photo:photo,ignore:ignore}));
  	}
  	
	_updateTable(rs);

}

function createRow(data){
	 var row = Ti.UI.createTableViewRow({
			height:Ti.UI.SIZE,
			_data:data
		});
		var v = Ti.UI.createView({top:15,bottom:15,left:20,height:Ti.UI.SIZE,layout:"horizontal"});
		
		var user_photo = Titanium.UI.createImageView(
		 {
		  	left:0,backgroundColor:'#ccc',
		  	width:'50',height: '50',borderWidth:3,borderColor:"#eee",
		  	image:data.photo || "images/flairs/100/1.png",
		  	borderRadius: 25,
		 }
		);
		v.add(user_photo);
		
		var title = Ti.UI.createLabel({
			text:data.name,height:Ti.UI.SIZE,
			left:20,
			color:"#40a3ff",
			font:{
				fontSize:24
			}
		});
		v.add(title);
		row.add(v);	
		return row; 
}


var testTimeout;
function _updateTable(_dataArr){
	Ti.API.info("Search Results Found " + _dataArr.length);
	//if(_dataArr.length>0){
		if(testTimeout){
			clearTimeout(testTimeout);
			testTimeout = null;
		}
		testTimeout = setTimeout(function(){
					_tableView.setData(_dataArr);
		},100);
	//}else{
		//show_error("");
	//}  	
}


function clear(_view){
	for(var i=0;i<_view.children.length;i++){
			var c = _view.children[i];
			_view.remove(c);
	}
}

function header(){	
	var reload_btn = Ti.UI.createView({left:20,right:20,borderRadius:4,height:40,top:15,bottom:10});
	_textFieldLabl = Ti.UI.createTextField({opacity:0.6,value:"type employee's name",color:"#fff",left:20,width:200,height:30});
	_textField = Ti.UI.createTextField({hint:"search",color:"#fff",left:20,width:200,height:30});
	
	reload_btn.add(_textFieldLabl);
	reload_btn.add(_textField);
	var cancel_btn = Ti.UI.createView({right:0,visible:true,bubbleParent:false,height:30,width:50});
	var cancel_lbl = Ti.UI.createLabel({text:"cancel",color:"#fff",font: {
         fontSize: 14
    	},});
	cancel_btn.add(cancel_lbl);
	reload_btn.add(cancel_btn);
	
	cancel_btn.addEventListener("singletap",function(e){
		main.close();
	});
	
	return reload_btn;
}





