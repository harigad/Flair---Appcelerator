var login = require('ui/common/Login');
var user = login.getUser();
var selectedRoleView;
exports.init = function(){
	var main = Titanium.UI.createWindow({
    	title: "Role",    	
    	barColor:'#333',
    	backgroundColor: '#eee'	
	});
	
	main.addEventListener('close',function(e){
		Ti.API.debug("Window Closed");
	});
	
	var scrollView = Ti.UI.createScrollView({
  		contentWidth: 'auto',
  		contentHeight: 'auto',
  		showVerticalScrollIndicator: false,
  		showHorizontalScrollIndicator: false,
  		width: 320,
  		top:0
	});
	
	var roles_view = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 'auto',
		  	top:5,
		  	layout: 'vertical'
		});	
	
	roles_view.add(_createRole({_role_title:"Super Hero",_role_id:"Super Hero"},true));
	roles_view.add(_createRole({_role_title:"Villain",_role_id:"Villain"},true));
	roles_view.add(_createRole({_role_title:"Comedian",_role_id:"Comedian"},true));
	roles_view.add(_createRole({_role_title:"Director",_role_id:"Director/CEO"},false));
	roles_view.add(_createRole({_role_title:"Producer",_role_id:"Producer"},false));
	roles_view.add(_createRole({_role_title:"Advisory Board",_role_id:"Advisory Board"},false));
	
	var delete_btn = Titanium.UI.createView(
		 {
		  	width: 'auto',
		  	height: 'auto',
		  	top:5,bottom:10,
		  	layout: 'horizontal',
		  	borderRadius:4,
		  	backgroundColor:'#770000'
		 }
	);
	
	var delete_txt = Ti.UI.createLabel({
		top:15,
		bottom:15,
  		width:280,
  		left:10,
  		right:10,
  		color: '#fff',
  		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  		text: "Quit " + user.getPlace().name,
  			font: {
         		fontSize: 18
    		}
  	});
  	
  	delete_btn.add(delete_txt);
  	roles_view.add(delete_btn);	
	
	scrollView.add(roles_view);
	main.add(scrollView);
	return main;
}

function _createRole(_data,_showHR){
	var _role_title = Ti.UI.createLabel({
  		left:0,
  		width:'auto',
  		color: '#40a3ff',
  		shadowColor: '#aaa',
  		shadowOffset: {x:1, y:1},
  		text: _data._role_title,
  			font: {
         		fontSize: 25
    		}
  	}); 
  	
  	var role_view = Titanium.UI.createView(
		 {
		  	width: '100%',
		  	height: 'auto',
		  	top:0,
		  	layout: 'horizontal',
		  	_role_title: _role_title,
		  	_data:_data
		 }
	);
	
	role_view.add(_createThumb(_data));	
	role_view.add(_role_title);	
	
	if(_showHR){
		role_view.add(_hr());
	}
	
		role_view.addEventListener('singletap',function(e){
			this._cancelClick = true;
			
			if(selectedRoleView && selectedRoleView == this){
				return;
			}
			
			this.setBackgroundColor('#40a3ff');
			this._role_title.setColor("#fff");
			if(selectedRoleView){
				selectedRoleView.setBackgroundColor('#fff');
				selectedRoleView._role_title.setColor('#40a3ff');
			}
			selectedRoleView = this;
			user.getPlace().role = this._data._role_title;
		});
	
		role_view.addEventListener('touchstart',function(e){
			Ti.API.debug("sournce = " + e.source);
			this._cancelClick = false;
			var that = this;	
				setTimeout(function(){
					if(that._cancelClick !== true){
						that.setBackgroundColor('#40a3ff');
						that._role_title.setColor("#fff");
					}
				}, 300 );
			
		});
		
		role_view.addEventListener('touchend',function(e){
			//this.setBackgroundColor('#fff');
			//this._role_title.setColor("#40a3ff");
		});
		
		role_view.addEventListener('touchmove',function(e){
			this._cancelClick = true;
			if(selectedRoleView && selectedRoleView !== this){
				this.setBackgroundColor('#fff');
				this._role_title.setColor("#40a3ff");
			}
		});
		
		
		if(user.getPlace().role == _data._role_title){
			selectedRoleView = role_view;
			role_view.setBackgroundColor('#40a3ff');
			_role_title.setColor("#fff");
		}
	
	return role_view;
}


function _createThumb(_data){
	var outer =  Titanium.UI.createView(
		 {
		  	width: 100,
		  	height: 100,
		  	top:5,
		  	bottom:5,
		  	left:10,
		  	right:10,
		  	backgroundColor:'#f1f1f1',
		  	borderRadius: 4,
		   	_data: _data
		 }
	);
	
	var inner =  Titanium.UI.createView(
		 {
		  	width: 80,
		  	height: 80,
		  	backgroundImage:'images/roles/100/' + _data._role_id + '.png'
		 }
	);
	
	outer.add(inner);
	return outer;
}

function _hr(){
	return  Titanium.UI.createView(
		 {
		  	backgroundImage: 'images/feed/hr.png',
		  	backgroundRepeat: true,
		  	height:2,
		  	top:0,bottom:0,
		  	width:'100%'
		 }
	);
}