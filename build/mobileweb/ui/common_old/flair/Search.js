
exports.search = function(){
	
	
	
	
}


function print(_data){
  var _dataArr = [];
	 
  for(c=0;c<_data.len;c++){
     var obj = _data[c];
          
  var tvRow = Ti.UI.createTableViewRow({
                height:'auto',
                backgroundColor:'#fff',
                data: friend,
                layout: 'horizontal'
  });            
            
  var fLabel =  Ti.UI.createLabel({
  	width:'auto',
  	height: 'auto',
  	left:0,
  	right:5,
  	color: '#2179ca',
  	text: _data.text,
  	font: {
         fontSize: 12
    }
  });	
  
  var icon = Ti.UI.createImageView({
  	image: 'images/edit.png'
  });
            
  tvRow.add(icon);
  tvRow.add(fLabel);
            
  _dataArr.push(tvRow); 		
  
  }
  
  return _dataArr;
  
}


