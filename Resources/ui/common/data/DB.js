var _db;
var login = require('ui/common/Login');

exports.select = function(_sql){	
	return _db.execute(_sql);	
}

exports.open = function(){
	_db = Ti.Database.open('flair_db');
	var service = Ti.App.iOS.registerBackgroundService({url:'ui/common/data/DB_Background.js'});
}

exports.load = function(){
	_load_from_server();
}

function _load_from_server(){
	//load and insert
	var that = this;
	
	var url = "http://flair.me/search.php";	
	var _data = {type:"_data",accessToken:login.getAccessToken()};
		
	Ti.API.debug("_data.load");
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	 Ti.API.debug("_data.load recieved data" + this.responseText);
 	 	 var response = JSON.parse(this.responseText);
 	 	 _insert_data("_adv",response._adverbs);
         _insert_data("_adj",response._adjectives);
         _insert_data("_food",response._food);
         _insert_data("_forbidden",response._forbidden);
 	 },
 	 onerror: function(e){
 		 	Ti.API.error("_data.load error " + e);
 	 }
 	});
 	
 	// Prepare the connection.
 		client.open("POST", url);
 	// Send the request.
 		client.send(_data);
}


function _insert_data(_table,_data){
	//create table
	_db.execute('CREATE TABLE IF NOT EXISTS ' + _table + '(_txt TEXT)');
	        _db.execute("DELETE FROM " + _table);
         	for(var i=0;i<_data.length;i++){
         		_db.execute("INSERT INTO " + _table + "(_txt) VALUES (?)",_data[i]);
         	} 	

}