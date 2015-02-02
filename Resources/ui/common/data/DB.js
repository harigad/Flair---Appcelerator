var _db;
var login = require('ui/common/Login');

exports.getDB = function(){
	return Ti.Database.open('flair_db');
}

exports.select = function(_sql){
	Ti.API.info("select = " + _sql);
	_open();	
	return _db.execute(_sql);	
	_close();
}

exports.open = function(){
	_open();
};


function _open(){
		_db = Ti.Database.open('flair_db');
}

function _close(){
		_db.close();
}

exports.load = function(){
	//_load_from_server();
}

function _load_from_server(){
	//load and insert
	var that = this;
	
	var url = "http://services.flair.me/search.php";	
	var _data = {type:"_data",accessToken:login.getAccessToken()};
		
	Ti.API.debug("DB _data.load");
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	 Ti.API.debug("_data.load recieved data" + this.responseText);
 	 	 var response = JSON.parse(this.responseText);
 	 	 _insert_data("_adv",response._adverbs,_db);
         _insert_data("_adj",response._adjectives,_db);
         _insert_data("_food",response._food,_db);
         _insert_data("_forbidden",response._forbidden,_db);
         if(response._delete_this_data){
         	_delete_data(response._delete_this_data,_db);
         }
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


function _insert_data(_table,_data,_db){
	//create table
	_open();
	_db.execute('CREATE TABLE IF NOT EXISTS ' + _table + '(_txt TEXT)');
         	for(var i=0;i<_data.length;i++){
         		    var exists = _db.execute("select * from " + _table + " where _txt='" + _data[i] + "'");
         		    	if(exists && exists.rowCount === 0){
         					_db.execute("INSERT INTO " + _table + "(_txt) VALUES (?)",_data[i]);
         				}
         			row_close(exists);
         	}
    _close();     	
}

function row_close(rowset){
	if(rowset){
		rowset.close();
		rowset = null;
	}
}

function _delete_data(_data,_db){
	_open();
		for(var i=0;i<_data.length;i++){
          _db.execute("delete from " + _data[i]._table + " where _txt ='" + _data[i]._txt + "'");
		}
	_close();
}

