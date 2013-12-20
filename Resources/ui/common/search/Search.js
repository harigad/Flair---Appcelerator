var main;
var _tableView;
var _db = require('ui/common/data/DB');
var Portal = require('ui/common/Portal');
var _callBack;
var _textField;
var _places;

var serverSearchTimout;
exports.init = function() {	
	_places = [];
	serverSearchTimout = null;
	main = Ti.UI.createWindow({			
    	navBarHidden:true,
    	backgroundColor:'#eee',barColor:"#fff"
	});
	
	_draw();
}

exports.reset = function(){
	_textField.setText("");
}

exports.open = function(callBack){
	_callBack = callBack;
	
	Portal.getPlaces(function(places){
		_places = places;
	});
	
	main.open();
	setTimeout(function(){
    	_textField.focus();
    	//_update(_textField);
		//_callBack();
	},200);
	
}

function _draw(){
	clear(main);
	
	var outer =  Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: '100%',
		  	top:0,
		  	left:0,
		  	layout:'vertical',backgroundColor:'#fff'
		 }
	);
	
	outer.add(_top());
	
	_tableView = Ti.UI.createTableView({
  	 	    height:'auto',
  	 		top:0,backgroundColor:'#eee'
	});
	outer.add(_tableView);
	
	_tableView.addEventListener("click",function(e){
		
		if(e.rowData._type === "place"){
			var flairWin = require('ui/common/flair/Flair');
			var placeObj;
			
			Portal.getPlaces(function(places){
				
			for(var i=0;i<places.length;i++){
				if(places[i].name === e.rowData.title){
					placeObj = places[i];	
				}
			}
		
			  if(e.x<250){
			 
			  	var placeView = require('ui/common/place/Place');
		      	Portal.open(placeView.init({vicinity:placeObj.vicinity,lat:placeObj.lat,lng:placeObj.lng,pid:placeObj.pid,name:placeObj.name,launchRecepient:placeObj.recipient,launchEName:placeObj.recepientname}));
		
			 }else{
			
				flairWin.init(placeObj,function(){
				//Ti.API.debug("6");
				});	
			}
				
				
		_textField.setValue("");

				
			});
			
			
		}else{
			_callBack(e.rowData);
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
	
	_textField.addEventListener("change",function(){
		   _update();
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
	var rs = [];
	var txt = _textField.getValue();
	
	var places_rs = _db.select("SELECT  name as _txt,'place' as _type FROM places where name like '"+ txt + "%'");
	while (places_rs.isValidRow()){
			conct = "images/place_20_20.png";
			color = "#2179ca";
		rs.push({"_type":places_rs.field(1),color:color,rightImage:"images/signup/bg1_30.png",leftImage:conct,_word:places_rs.field(0),"title":places_rs.field(0)});
		places_rs.next();
  	}
  	
  	if(places_rs){
		places_rs.close();
	}
	
	var rows = _db.select("SELECT  _txt,'adj' as _type FROM _adj where _txt like '"+ txt + "%'  union SELECT _txt,'food' as _type from _food where _txt like '"+ txt + "%' ");
	
	var conct;var color;
	while (rows.isValidRow()){

		if(rows.field(1) === "adj"){
			conct = "images/hash_20_20.png";
			color = "#333";
		}else if(rows.field(1) === "food"){
			conct = "images/food_20_20.png";
			color = "#693100";
		}
		
		rs.push({"_type":rows.field(1),color:color,leftImage:conct,_word:rows.field(0),"title":rows.field(0)});
		rows.next();
  }
  
  if(rows){
  	rows.close();
  }
  
   if(rs.length === 0){
   	 serverSearchTimout = setTimeout(function(){
   	 	showPleaseWait()
   	 },500);
   	
   }
  
  	_updateTable(rs);
}

function showPleaseWait(){
	var rs = [];
	rs.push({"_type":"searching..",color:"#999",leftImage:"",_word:"searching..","title":"searching.."});
	_updateTable(rs);
	loadPlacesFromServer();
}

function loadPlacesFromServer(){
		
	
	
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
	var reload_btn = Ti.UI.createView({layout:'horizontal',width:300,borderRadius:4,height:40,top:15});
	
	var search_btn = Ti.UI.createView({opacity:0.5,left:10,height:20,width:20,backgroundImage:"images/search.png"});
	
	reload_btn.add(search_btn);
	
	_textField = Ti.UI.createTextField({hint:"search",color:"#666",left:15,width:200,height:30});
	reload_btn.add(_textField);
	var cancel_btn = Ti.UI.createView({visible:true,bubbleParent:false,height:30,width:50});
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


