$.support.cors = true;

angular.module('app').service('majorIndicesService',['$http',function($http){
	
	this.getIndicesList = function(callback){
		
		$.ajax({
			type: "POST",
			headers: AuthenticationManager.getHeaders(), 
			url:apiManager.http + apiManager.majorindices,
			dataType:'json',
			crossDomain: true,
			async: true,
			success: function(data,status){
				console.log(data);
				
				if(data.status==="SUCCESS"){
					
					if((data.new_entitlements!==undefined)&&(Object.keys(data.new_entitlements).length > 0)){
						//alert("new_entitlements in major indices is : "+JSON.stringify(data.new_entitlements));
						sessionStorage.setItem("UID",data.new_entitlements.userID);
						sessionStorage.setItem("TOKEN",data.new_entitlements.TOKEN); 
					}
					callback(data.indices);
				}
				
			},
			error : function(){
				callback("error");	
			}
		});
		
		
	};
	
	
	
	this.getIndices = function(symbolList,callback){
		
		var data = {"ticker" :  symbolList};
		
		$.ajax({
			type: "POST",
			headers: AuthenticationManager.getHeaders(), 
			url:apiManager.http + apiManager.snapqoute,
			data : data,
			dataType:'json',
			crossDomain: true,
			async: true,
			success: function(data,status){				
				console.log("data in topholding is : %o",data);
				if(data.status==="SUCCESS"){
					callback(data.snapQuotes);
				}
				//callback(data);
			},
			error : function(){
				alert("error");
				callback("error");	
			}
		});
		
	};
	
	/*
		this.getIndices = function(symbolList,callback){
		
		$.ajax({
		type: "POST",
		headers: AuthenticationManager.getHeaders(), 
		url:Constants.TOMCAT_BASE_URL+"snapQuote.jsp?ticker="+symbolList,
		dataType:'json',
		crossDomain: true,
		async: true,
		success: function(data,status){
		console.log(data);
		callback(data);
		},
		error : function(){
		alert("error");
		callback("error");	
		}
		});
		
		};
	*/
	this.displaySymbolList = function(symbolArray) {
		return function findMatches(q, cb) {
			var matches, substringRegex;
			
			// an array that will be populated with substring matches
			matches = [];
			
			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');
			
			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(symbolArray, function(i, str) {
				if (substrRegex.test(str)) {
					matches.push(str);
				}
			});
			
			cb(matches);
		};
	};
	
	this.changeSymbolRank =  function(json,value,callback){
		count = 0;
		
		for(var key in json){
			if( count < value){
				count++;
			}
			else{
				json[key] = json[key] + 1;	
			}
		}
		callback(json);
	};
	
}]);