var _main;
var _view;
var portal = require('ui/common/Portal');
var login = require('ui/common/Login');
var nav;
exports.init = function() {

	_main = Ti.UI.createWindow({
		backgroundColor : "#eee",
		navBarHidden : true,
		top : 0,
	});

	var scroll = Ti.UI.createScrollView({});

	_view = Ti.UI.createView({
		width : 250,
		top : 20,
		backgroundColor : "#eee",
		right : 0,
		height : Ti.UI.FILL,
		layout : "vertical"
	});
	scroll.add(_view);
	_main.add(scroll);
	_draw();

	if (Ti.App.isIos) {
		nav = Titanium.UI.iOS.createNavigationWindow({
			window : _main,
			width : Ti.Platform.displayCaps.platformWidth
		});
		nav.open();
	} else {
		
		_main.open();

	}

	Ti.App.addEventListener("userLoggedIn", function() {
		_view.removeAllChildren();
		_draw();
	});

};

exports.openSub = function(win) {
	nav.openWindow(win, {
		animated : true
	});
};

function open(win) {
	nav.openWindow(win, {
		animated : true
	});
}

function close(win) {
	nav.closeWindow(win, {
		animated : true
	});
	win = null;
}

function _draw() {
	var user = login.getUser();
	_view.add(item({
		closeMenu : true,
		approved : -1,
		icon : "/images/menu_me_icon.png",
		title : "My flairs",
		callBack : function() {
			login.init(function() {
				user = login.getUser();
				var win = require('ui/common/userProfile/UserProfile');
				portal.open(win.init(user.getId(), user.getName(), user.getPhotoBig(), user.getPhoto()));
			});
		}
	}));
	_view.add(_hr());
	if (login.loggedIn()) {

		_view.add(item({
			closeMenu : false,
			approved : -1,
			icon : "/images/menu_about_me_icon.png",
			title : "About Me",
			callBack : function(label) {

				user = login.getUser();
				var win = require('ui/common/userProfile/AboutMe');
				win.init(user.getAbout(), function() {
					//do nothing;
				});
			}
		}));
		_view.add(_hr());
	}//if logged in

	if (false) {
		_view.add(item({
			approved : -1,
			icon : "/images/menu_invite_icon.png",
			title : "Invite",
			callBack : function() {
				var placeView = require('ui/common/menu/menu_invite');
				open(placeView.init(null, function(win) {
					close(win);
				}));
			}
		}));
		_view.add(_hr());
	}

	var places = user.getPlaces();
	for (var i = 0; i < places.length; i++) {
		_view.add(item({
			approved : places[i].approved,
			icon : "/images/menu_place_icon.png",
			title : places[i].name,
			callBack : function(placedata) {
				if (placedata.approved) {
					var placeView = require('ui/common/menu/menu_place');
					open(placeView.init(placedata, function(win) {
						close(win);
					}));
				}
			},
			data : places[i]
		}));
		_view.add(_hr());
	}

	/*_view.add(item({approved:-1,icon:"/images/menu_join_a_business_icon.png",title:"Join a Business",callBack:function(){
	 searchBus();
	 }}));
	 */

}

function feedback() {

}

function searchBus(invite) {
	var Search = require('ui/common/search/Search');
	Search.open(function(_data) {
		addBus(_data, invite);
	});
}

function addBus(bus, invite) {
	if (!invite) {
		var new_bus = require('ui/common/userProfile/AccessCode');
		new_bus.init(bus);
	} else {
		var new_bus = require('ui/common/invite/Invite');
		new_bus.init(bus);
	}
}

function item(data) {
	var main = Ti.UI.createView({
		layout : "horizontal",
		height : Ti.UI.SIZE,
		left : 10,
		right : 10
	});
	//if(data.icon){
	var icon = Ti.UI.createImageView({
		image : data.icon,
		width : 30,
		height : 30,
		right : 0,
		opacity : 0.7,
		top : 15,
		bottom : 15
	});
	main.add(icon);
	//}

	var v = Ti.UI.createView({
		width : 200,
		layout : "vertical",
		height : Ti.UI.SIZE
	});

	var title = Ti.UI.createLabel({
		text : data.title,
		height : 16,
		width : Ti.UI.SIZE,
		color : "#aaa",
		left : 15,
		right : 0,
		shadowColor : '#fff',
		shadowOffset : {
			x : 1,
			y : 1
		},
		shadowRadius : 3,
		font : {
			fontSize : 14
		}
	});
	v.add(title);

	if (data.approved == 1 || data.approved == "1") {
		approved_txt = "(approved)";
	} else {
		approved_txt = "(approval pending)";
	}

	if (data.approved !== -1) {
		var app = Ti.UI.createLabel({
			text : approved_txt,
			height : Ti.UI.SIZE,
			left : 0,
			color : "#fff",
			color : "#aaa",
			left : 15,
			shadowColor : '#fff',
			shadowOffset : {
				x : 1,
				y : 1
			},
			shadowRadius : 3,
			font : {
				fontSize : 12
			}
		});
		v.add(app);
	}

	main.add(v);

	main.addEventListener("click", function() {
		if (data.closeMenu) {
			portal.toggleMenu(function() {
				data.callBack(data.data);
			});
		} else {
			data.callBack(data.data);
		}
	});
	return main;
}

exports.open = function() {
	_main.open();
};

exports.refresh = function() {

};

function _hr() {
	return Titanium.UI.createView({
		backgroundImage : '/images/feed/like_hr.png',
		height : 2,
		opacity : 0.6,
		bottom : 0,
		top : 0,
		width : Ti.UI.FILL
	});
}

