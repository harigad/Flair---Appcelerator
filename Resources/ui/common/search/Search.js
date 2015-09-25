var main;
var _tableView;
var _db = require('ui/common/data/DB');
var Portal = require('ui/common/Portal');
var _callBack;
var _textField,_textFieldLabl;
var _places;

var serverSearchTimout;
var pleaseWaitTimeout;

var _colors = [
"ff004e",
"008aff",
"ff2a00",
"33c500",
"ff5a00",
"ffb400"
];


exports.init = function() {	
	_places = [];
	serverSearchTimout = null;
	main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#eee',barColor:"#eee"
	});
	
	_draw();
};

exports.reset = function(){
	_textField.setText("");
};

exports.open = function(callBack){
	_callBack = callBack;
	
	main.open();
	setTimeout(function(){
    	_textField.focus();
  },200);
	Portal.loadPlaces(function(places){
		draw_update(places);
	},"init");
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
  	 	    height:'auto',
  	 		top:0,backgroundColor:'#fff'
	});
	outer.add(_tableView);
	
	_tableView.addEventListener("click",function(e){
	
		if(_callBack){
			_callBack(e.row.place);
			_callBack = null;
		}else{
			  	var placeView = require('ui/common/place/Place');
		      	Portal.open(placeView.init(e.row.place));
		}
		main.close();
	});
	
	main.add(outer);


	
}

function _top(){	
	var cRight = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	width:Ti.UI.FILL,
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical',backgroundColor:'#fff'
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
	
   	 pleaseWaitTimeout = setTimeout(function(){
   	 	showPleaseWait(txt);
   	 },500);
}

function draw_update(places){	
	var rs = [];
	for (var i=0;i<places.length;i++){
			
		var row = Ti.UI.createTableViewRow({
			height:Ti.UI.SIZE,layout:"vertical",
			place:places[i]
		});
		
		var title = Ti.UI.createLabel({
			text:places[i].placename,
			left:50,top:10,
			color:"#" + _colors[i%6],
			font:{
				fontSize:18
			}
		});
		var splitVic = "";
		if(places[i].vicinity){
			splitVic = places[i].vicinity.split(",")[0];
		}
		var sub = Ti.UI.createLabel({
			text:splitVic,
			left:50,bottom:10,
			color:"#aaa",
			font:{
				fontSize:14
			}});
			
			
		row.add(title);	
		row.add(sub);
		
		rs.push(row);
  	}
  	        /*define('QA_MYSQL_HOSTNAME', 'dlaswovdb02.nonprod.avaya.com'); // try '127.0.0.1' or 'localhost' if MySQL on same server
        define('QA_MYSQL_USERNAME', 'mukul');
        define('QA_MYSQL_PASSWORD', 'Avaya123');
        define('QA_MYSQL_DATABASE', 'avaya_answers_dev');*/
	_updateTable(rs);

}

function showPleaseWait(txt){
	var rs = [];
	rs.push({"_type":"      searching..",color:"#999",leftImage:"",_word:"searching..","title":"searching.."});
	_updateTable(rs);
	 serverSearchTimout = setTimeout(function(){
   	 	loadPlacesFromServer(txt);
   	 },500);
}

function loadPlacesFromServer(txt){
		Portal.loadPlaces(function(places){
			draw_update(places);
		},txt);
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
	
	var search_btn = Ti.UI.createView({opacity:0.5,left:0,height:20,width:20,backgroundImage:"images/search.png"});
	
	reload_btn.add(search_btn);
	_textFieldLabl = Ti.UI.createTextField({value:"type name of business",color:"#cecece",left:30,width:200,height:30});
	_textField = Ti.UI.createTextField({hint:"search",color:"#666",left:30,width:200,height:30});
	reload_btn.add(_textFieldLabl);
	reload_btn.add(_textField);
	var cancel_btn = Ti.UI.createView({right:0,visible:true,bubbleParent:false,height:30,width:50});
	var cancel_lbl = Ti.UI.createLabel({text:"cancel",color:"#aaa",font: {
         fontSize: 14
    	},});
	cancel_btn.add(cancel_lbl);
	reload_btn.add(cancel_btn);
	
	cancel_btn.addEventListener("singletap",function(e){
		main.close();
	});
	
	return reload_btn;
}




