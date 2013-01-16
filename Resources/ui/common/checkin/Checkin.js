var main;
var searchBar;
var tableView;
var friends;
var portal = require('ui/common/Portal');

exports.init = function(_clearView,_refreshView){	

	main = Ti.UI.createWindow({	
		backgroundColor: '#fff' 
	});	
	
	var view = Titanium.UI.createView(
		 {
		 	width: '100%',
		 	height:'auto',
		 	top:0,
		 	backgroundColor:'#eee'
		 }
	);		
	
	var fieldView = Titanium.UI.createView(
		 	{
		 		left:10,
		 		right:10,
		 		top:10,
		 		width:300,
		 		bottom:10,
		 		height:'auto',
		 		layout: 'vertical',
		 		backgroundColor: '#ccc',
		 		borderRadius: 4
		 	}
	);
	
	/*	
	var send = Titanium.UI.createButton({
    title : 'Send',
    style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});

	var cancel = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
	});

	var flexSpace = Titanium.UI.createButton({
    	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	keyboardToolbar : [cancel, flexSpace, camera, flexSpace, send],
    keyboardToolbarColor : '#999',
    keyboardToolbarHeight : 40,
    */		
	
	search = Ti.UI.createTextField({
		value:'',
		height:40,
		left:10,
		right:10,
  		hintText:'search friends',
  		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_ALL,
  		returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE  		
	});
  	
  	search.addEventListener('change',function(){
  		searchProcess(this.value);
  	});

	fieldView.add(search);
	view.add(fieldView);

	tableView = Ti.UI.createTableView({
  	 		height:'auto',
  	 		top:60
	});
	
	tableView.addEventListener("click",function(e){
		Ti.API.debug("table View clicked");
		main.close();
		_clearView();		
		processCheckin(e.rowData.data,_refreshView);
	});
	
	main.add(view)
	main.add(tableView);	
    main.open();	

	loadFriends();

}


function processCheckin(data,_callBack){
	
	
	
	
	
}


function addShare(friend){
	
}

function searchProcess(searchStr){
	 var outPut = [];
	 
	 if(searchStr!==""){
	 
	 for(c=0;c<friends.length;c++){
	 	 var friend = friends[c];
         var first_name = friend.fname; 
         	var fLower = first_name.toLowerCase();
         	var sLower = searchStr.toLowerCase();
        // Ti.API.debug("searching for " + searchStr + " in " + first_name);
         if(fLower.indexOf(sLower) === 0 ){
         		Ti.API.debug("found " + searchStr + " in " + first_name);
           		outPut.push(friend);	
         }
	 }	 
	 	printResults(outPut);
	 }else{
	 	printResults([]);
	 }
}

function clear(){
	Ti.API.debug("clearing tableView with items = " + tableView.children.length);
	for(var i=0;i<tableView.children.length;i++){
			var c = tableView.children[tableView.children.length-1];
			tableView.remove(c);
	}
	Ti.API.debug("clearing done with items = " + tableView.children.length);
}

function printResults(friends){
		var friendsArr = [];
	 //Sort the resulting list of friends via sortByName. Yes, below is not a typo, you dont need ()
       // row = row.sort(sortByName);
        var len = friends.length;
        if(len > 20){
        	len = 20;
        }
       
        for(c=0;c<len;c++){
            var friend = friends[c];
            var fullname = friend.fname;
            //Ti.API.debug(fullname);
 
            var tvRow = Ti.UI.createTableViewRow({
                height:'auto',
                backgroundColor:'#fff',
                hasChild: false,
                className: 'friend',
                data: friend,
                layout: 'horizontal'
            });            
            
  var fLabel =  Ti.UI.createLabel({
  left:2,
  width:'auto',
  height: 'auto',
  left:20,right:10,top:15,bottom:15,
  color: '#2179ca',
  text: fullname,
  font: {
         fontSize: 12
    }
  });	
  
  			var icon = Ti.UI.createImageView({
  				image: 'images/32/' + friend.logo
  				
			});
  
 
 
  var fLabel2 =  Ti.UI.createLabel({
  left:2,
  width:'auto',
  height: 'auto',
  left:5,top:15,bottom:15,
  color: '#999',
  text: friend.carname,
  font: {
         fontSize: 12
    }
  });	 
            
            tvRow.add(fLabel);
            tvRow.add(icon);
            tvRow.add(fLabel2);
            
 			friendsArr.push(tvRow); 		
        }
        clear();
        tableView.setData(friendsArr);       
	
}


function loadFriends(_callBack){
   var Login = require('ui/common/Login');
   var user = Login.getUser();
   friends = user.getUserFriends(); 
}


function sortByName(a, b) { 
    //notice how I am sorting by last_name which is a special field
    var x = a.last_name.toLowerCase();  
    var y = b.last_name.toLowerCase();  
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));  
}  
