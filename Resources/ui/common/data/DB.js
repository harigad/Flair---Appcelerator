var _db;

exports.select = function(_sql){	
	return _db.execute(_sql);	
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
	_insert_data("_food",_getFood());
	//_load_from_server();
}

function _load_from_server(){
	//load and insert
	var that = this;
	
	var url = "http://flair.me/search.php";	
	var _data = {type:"_data",accessToken:Ti.Facebook.getAccessToken()};
		
	Ti.API.debug("_data.load");
 	var client = Ti.Network.createHTTPClient({ 		
 	 onload : function(e) {
 	 	 Ti.API.debug("_data.load recieved data");
 	 	 var response = JSON.parse(this.responseText);
 	 	 _insert_data("_adv",response._adv);
         _insert_data("_adj",response._adj);
         _insert_data("food",response._foods);
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


function _insert_data(_table,_response){
	if(_response && _response._data){
	
	
	//create table
	_db.execute('CREATE TABLE IF NOT EXISTS ' + _table + '(_txt TEXT)');
	        _db.execute("DELETE FROM " + _table);
         	for(var i=0;i<_response._data.length;i++){
         		_db.execute("INSERT INTO " + _table + "(_txt) VALUES (?)",_response._data[i]);
         	} 	
   
   
   }
}