var _db;

exports.select = function(_sql){	
	return _db.execute(_sql);	
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
	_db = Ti.Database.open('flair_db');
}

function _getAdj(){
	return {
		"_data" : 
					["delicious","spicy","hot","sweet","tasty"]
				  
		  };
}

function _getAdv(){
	return {
		"_data" : 
					["absolutely","very","extremely","mean"]
				  
		  };
}

function _getFood(){
	return {
		"_data" : 
					["chips","cookies","chai tea latte","maggie noodles","biscuits"]
				  
		  };
}


exports.load = function(){
	_insert_data("_adj",_getAdj());
	_insert_data("_adv",_getAdv());
	_insert_data("food",_getFood());
}

function _insert_data(_table,_response){
	//create table
	Ti.API.debug("A1");
	_db.execute('CREATE TABLE IF NOT EXISTS ' + _table + '(_txt TEXT)');
	Ti.API.debug("A2");
	        _db.execute("DELETE FROM " + _table);
	        Ti.API.debug("A3");
         	for(var i=0;i<_response._data.length;i++){
         		Ti.API.debug("A4");
         		_db.execute("INSERT INTO " + _table + "(_txt) VALUES (?)",_response._data[i]._txt);
         	} 	
	return;
	
	
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