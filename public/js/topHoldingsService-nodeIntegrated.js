$.support.cors = true;
angular.module('app').service('topHoldingsService',['$http',function($http){

  
    
	this.getQoutes = function(symbolList,callback){
		
		var dataObj = {ticker:symbolList};
		
		console.log("dataObj is : %o",dataObj);
					
		$.ajax({
			type: "POST",
			headers: AuthenticationManager.getHeaders(),
			url:apiManager.http + apiManager.snapqoute,
			data: dataObj,
			dataType:'json',
			crossDomain: true,
			async: true,
			success: function(data,status){				
				console.log("data in topholding is : %o",data);
				if(data.status==="SUCCESS"){
					callback(data.snapQuotes);
				}
					//callback(data);
			}
		});
					
			
		
    };
 
	this.changeSymbolRank =  function(json,callback){
	
		for(var key in json){
			if(json[key] == -1){
				
				
			}
			else{
				json[key] = json[key] + 1;	
			}
		}
	   callback(json);
	};
	
	this.deleteSymbolFromSymbolList = function(symbol,symbolList,callback){
	
		//console.log(symbol);
		var i = 0; 
		var array 	= 	symbolList.split(",");
		var index  	= 	array.indexOf(symbol);
		
		//console.log(array);
	//	console.log(index);
		symbolList = "";
		
		for( i= 0 ; i < array.length ; i++){
			if( i == index ){
			
			}
			else if( i != (array.length -1)){
				symbolList += array[i] + ",";
			}
			else{
				symbolList += array[i];
			}
		}
		
		if(index == (array.length -1)){
			symbolList = symbolList.substr(0,symbolList.length -1);
		}
	//	console.log(symbolList);
		
		callback(symbolList);
	
	};
	
	this.deleteSymbolFromArrayList = function(symbol,symbolRank,array,callback){
	
		var dataNew = [];
		var k = 0 , i = 0; 
		
			
		var j = 0;
		
		if(symbolRank[symbol] == -1){
		
		}
		else{
			
			for( k = 0 ; k < array.length ; k++){
				if( k == symbolRank[symbol]){
					symbolRank[symbol] = -1;
					//console.log(k);	
				}
				else{
					//console.log("else " +  k  );
					dataNew[j] = array[k];
					symbolRank[array[k].symbol] = j;
					j++;
				}
				
			}
			
			array =  dataNew;
			
		//	symbolRank[symbol] = -1;
		    console.log(symbolRank);
			callback(array,symbolRank);	
			
		}
	
	};
	
	
	this.displaySymbolList = function (strs){
		return function findMatches(q, cb) {
			var matches, substringRegex;

			// an array that will be populated with substring matches
			matches = [];

			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');

			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
				$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					matches.push(str);
				}
				});

			cb(matches);
		};
	};
	
}]);