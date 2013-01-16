var _db;

exports.select = function(_sql){	
	return	select_from_server(_sql);
	//return _db.execute(sql);	
}

function select_from_server(_sql){
	//load and insert
	var that = this;
	
	var url = "http://flair.me/search.php";	
	var _data = {type:"_data",_sql:_sql,accessToken:Ti.Facebook.getAccessToken()};
		
	Ti.API.debug("_data.load sending data " + _table);
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	 Ti.API.debug("_data.load recieved data");
 	 	 var response = JSON.parse(this.responseText);
         if(response.status){
         		_db.execute("DELETE FROM " + _db);
         	for(var i=0;i<respose._data.length;i++){
         		_db.execute("INSERT INTO " + _table + "(_id,_txt) VALUES (?,?)",_respose._data[i]._id,_respose._data[i]._txt);
         	} 	 		 
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

exports.open = function(){
	return;
	_db = Ti.Database.open('flair_db');
}

exports.load = function(){
	return;
	_insert_data("_adj");
	_insert_data("_adv");
	_insert_data("food");
}

function _insert_data(_table){
	//create table
	_db.execute('CREATE TABLE IF NOT EXISTS ' + _table + '(_id INTEGER, _txt TEXT)');
	
	//load and insert
	var that = this;
	
	var url = "http://flair.me/search.php";	
	var _data = {type:"_data",_table:_table,accessToken:Ti.Facebook.getAccessToken()};
		
	Ti.API.debug("_data.load sending data " + _table);
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	 Ti.API.debug("_data.load recieved data");
 	 	 var response = JSON.parse(this.responseText);
         if(response.status){
         		_db.execute("DELETE FROM " + _db);
         	for(var i=0;i<respose._data.length;i++){
         		_db.execute("INSERT INTO " + _table + "(_id,_txt) VALUES (?,?)",_respose._data[i]._id,_respose._data[i]._txt);
         	} 	 		 
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