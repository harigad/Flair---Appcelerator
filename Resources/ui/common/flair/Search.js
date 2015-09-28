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
var _colors = [
"ff004e",
"008aff",
"ff2a00",
"33c500",
"ff5a00",
"ffb400"
];
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
    	backgroundColor:'#fff',barColor:"#fff"
	});
	
	_draw();
	
	main.open();
	setTimeout(function(){
    	_textField.focus();
  },200);
	
};

var personName;
var tabMenu;

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
	 
	tabMenu = Ti.UI.createView({
		height:30, backgroundColor:"#fff"
	});
	var bb1 = Titanium.UI.iOS.createTabbedBar({
    	labels:['Flair an Employee', 'Flair a Friend'],
    	backgroundColor:'#aaa',borderColor:"#aaa",
    	top:-3,borderWidth:0,left:-3,index:0,
    	height:36,borderRadius:0.1,
   	    width:Ti.Platform.displayCaps.platformWidth + 6
	});

	bb1.addEventListener('click',function(e){
		if(index==0){
			_textFieldLabl.setText("type employee's name");
		}else{
			_textFieldLabl.setText("type friend's name");
		}
	});


	tabMenu.add(bb1);
	//outer.add(tabMenu);
	
	_tableView = Ti.UI.createTableView({
  	 	    height:'auto',left:0,
  	 		top:0,backgroundColor:'#fff'
	});
	outer.add(_tableView);
	
	_tableView.addEventListener("click",function(e){
		if(e.row._data.ignore == true){
			return;	
		}
		
		if(personName){
			if(validateEmail(e.row._data.name)){
				
				confirm.init(null,_place.name,function(h){
					login.init(function(){
						_callBack(e.row._data,h);
			  			personName = null;
			  			main.close();
					});
				});return;
			}else{
				//
			}
			
		}else if(e.row._data.ignore !== true){
		 personName = e.row._data;
		_textField.setText("");
		_textField.setValue("");

			if(e.row._data.uid || e.row._data.id){
			confirm.init(personName.name,_place.name,function(h){
				
				login.init(function(){
					_callBack(personName,h);
			  		Ti.API.info("3");
			  		personName = null;
			  		main.close();
				});
				
			});return;
			}


		_textFieldLabl.setValue("ex: john@johnscafe.com");
		_update();
		if(_textField.getValue() !==""){
			_textFieldLabl.hide();
		}else{
			_textFieldLabl.show();
		}
		
		
		var anim = Titanium.UI.createAnimation();
		anim.height = 0;
		anim.duration = 3000;
   	 		tabMenu.animate(anim);
		
		
		
		}
			
	});
	
	main.add(outer);
	if(_place.cast.length>0){
		draw_update("");
	}else{
		personName = "add new";
		draw_hashtags("");
	}
	
	
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function _top(){	
	var cRight = Titanium.UI.createView(
		 {
		  	left:0,
		  	top:0,
		  	width:Ti.UI.FILL,
		  	height:Ti.UI.SIZE,
		  	layout: 'vertical',backgroundColor:'#ccc'
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
   	 	
   	 	if(personName){
   	 	
		    draw_hashtags(txt);
		}else{
   	 		draw_update(txt);
   	 	}
   	 //},300);
}

function draw_update(txt){
	
	var user = login.getUser();
	var rs = [];
	txt = txt.trim();
	txt = txt.toLowerCase();
	var found = false;
	for (var i=0;i<_place.cast.length;i++){
		
		if(_place.cast[i].approved !==1 && _place.cast[i].approved !== "1"){
		  if(user.id !== _place.cast[i].uid){
		   	continue;
		  }else{
		  	_place.cast[i].ignore = true;
		  }
		}
		
		if(txt.length > 0){
			var lower = _place.cast[i].name.toLowerCase();
			if(lower.search(txt) === -1){
				continue;
			}
		}
		
		
		rs.push(createRow(_place.cast[i],_colors[i%6]));
  	}
  	
  	if(!_place.hasAdmin || _place.admin){
  		var ignore;
  		ignore = (txt.length > 3) ? false:true; 
  		var name = txt.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) || "ex:John Smith";
  		var photo = "/images/plus.png";
  		
  		rs.push(createRow({name:"add new",photo:photo,ignore:false},_colors[rs.length%6]));
  	}
  	
	_updateTable(rs);

}

function draw_hashtags(txt){
	var rs = [];
	txt = txt.trim();
	
	if(!txt){
		rs.push(createRow({name:"type in employee's email address'",photo:"",ignore:true,skip:true},"999"));
	}else{
		rs.push(createRow({name:txt,photo:"",ignore:false},"333"));
	}
	
	_updateTable(rs);
}

function createRow(data,color){
	 var row = Ti.UI.createTableViewRow({
			height:Ti.UI.SIZE,
			_data:data
		});
		
		var h = Ti.UI.createView({top:15,bottom:15,left:20,height:Ti.UI.SIZE,layout:"horizontal"});
		if(!personName){
			var user_photo = Titanium.UI.createImageView(
		 	{
		  		left:0,backgroundColor:'#ccc',
		  		width:'50',height: '50',borderWidth:3,borderColor:"#eee",
		  		image:data.photo || "/images/flairs/100/1.png",
		  		borderRadius: 25,
		 	}
			);
			h.add(user_photo);
		}
		
		var w = 220;
		if(personName){
			w = 280;
		}
		
		var v = Ti.UI.createView({height:Ti.UI.SIZE,layout:"vertical",width:w});
		var title = Ti.UI.createLabel({
			text:data.name,height:Ti.UI.SIZE,
			left:20,
			color:"#" + color,
			font:{
				fontSize:24
			}
		});
		
		if(color){
			title.setColor("#" + color);
		}
		
		v.add(title);
		
		if(data.role_id){
			var role = Ti.UI.createLabel({
     			left:0,width:Ti.UI.SIZE,
				height:Ti.UI.SIZE,
				color:"#aaa",left:20,
				shadowColor: '#fff',
    			shadowOffset: {x:1, y:1},
    			shadowRadius: 3,
  				text:data.role_id,
  				font: {
         			fontSize: 14
    			}
			});
			v.add(role);
		}
		
		if(data.uid && data.approved !== 1 && data.approved !== "1"){
			var pend = Ti.UI.createLabel({
     			left:0,width:Ti.UI.SIZE,
				height:Ti.UI.SIZE,
				color:"#990000",left:20,
				text:"Approval Pending",
  				font: {
         			fontSize: 14
    			}
			});
			v.add(pend);
		}
		
		
		h.add(v);
		row.add(h);	
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
var cancel_lbl;
function header(){	
	var reload_btn = Ti.UI.createView({left:20,right:20,borderRadius:4,height:40,top:15,bottom:10});
	_textFieldLabl = Ti.UI.createTextField({opacity:0.6,value:"type employee's name",color:"#fff",left:20,width:200,height:30});
	_textField = Ti.UI.createTextField({hint:"search",color:"#fff",left:20,width:200,height:30});
	
	reload_btn.add(_textFieldLabl);
	reload_btn.add(_textField);
	var cancel_btn = Ti.UI.createView({right:0,visible:true,bubbleParent:false,height:30,width:50});
	cancel_lbl = Ti.UI.createLabel({text:"cancel",color:"#fff",font: {
         fontSize: 14
    	},});
	cancel_btn.add(cancel_lbl);
	reload_btn.add(cancel_btn);
	
	cancel_btn.addEventListener("singletap",function(e){
			personName = null;
			main.close();
	});
	
	return reload_btn;
}





