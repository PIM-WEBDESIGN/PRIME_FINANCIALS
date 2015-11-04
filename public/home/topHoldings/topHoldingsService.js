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
					
					if((data.new_entitlements!==undefined)&&(Object.keys(data.new_entitlements).length > 0)){
						//alert("new_entitlements in top holding is : "+JSON.stringify(data.new_entitlements));
						sessionStorage.setItem("UID",data.new_entitlements.userID);
						sessionStorage.setItem("TOKEN",data.new_entitlements.TOKEN); 
					}
					callback(data.snapQuotes);
				}
				else{
					alert("Unable To Find Data for " + symbolList);
				}
				
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
		
		var i = 0; 
		var array 	= 	symbolList.split(",");
		var index  	= 	array.indexOf(symbol);
		
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
		callback(symbolList);	
	};
	
	this.deleteSymbolFromDataSource = function(symbol,symbolRank,array,callback){
		
		var dataNew = [];
		var k = 0 , i = 0; 
		
		var j = 0;
		
		if(symbolRank[symbol] == -1){
			
		}
		else{
			
			for( k = 0 ; k < array.length ; k++){
				if( k == symbolRank[symbol]){
					symbolRank[symbol] = -1;	
				}
				else{
					dataNew[j] = array[k];
					symbolRank[array[k].symbol] = j;
					j++;
				}
				
			}
			
			array =  dataNew;
			
			// console.log(symbolRank);
			callback(array,symbolRank);	
			
		}
		
	};
	
	this.returnTrimmedArray = function(array,symbol,callback){
		
		if(array.length == 0){
			
		}
		else{
			
			var index = array.indexOf(symbol);
			var prevArr = array.slice(0,index);
			//console.log(prevArr);
			
			var frwdArr = array.splice(index+1);
			//	console.log(frwdArr);
			
			array = prevArr.concat(frwdArr); 
			//console.log(array);
		}
		
		callback(array);		
		
	}
	
}]);