angular.module('app').service('mainAppService',['$http',function($http){
	
	this.loader  = 0;
	this.loginVal ="";
	
	this.setLoginValue = function(val){
		console.log("main App Service :" +  val);
		this.loginVal =  val;
	}
	
	this.subsribeSymbolIdMapping = {};
	
	this.unSubscribeAllSubscribedSymbols  = function(){
		//console.log(JSON.stringify(this.subsribeSymbolIdMapping));
		for(var key in this.subsribeSymbolIdMapping){
			this.unsubscribe(key);
		}
	};
	
	this.unsubscribe = function(symbol){
		//console.log(symbol);
		if(this.subsribeSymbolIdMapping[symbol] == ""){
		
		}
		else{
			socketClient.client.unsubscribe(this.subsribeSymbolIdMapping[symbol]);
			this.subsribeSymbolIdMapping[symbol] = "";
		}
		
	};
	/*
	this.getNumberFormatted = function(number,callback){
		if(number % 1 == 0){
			number  = number.toString();
		}
		else{
			number  = number.toFixed(2);	
			number  = number.toString();
			var	decimal = number.substr(number.length-2 , number.length);
			number	= number.substr(0,number.length-3);
		}
		
		var reverseNumber = number.split("").reverse().join("");	
		
		if( reverseNumber.length <= 3 ){
			
		}
		else{
			var original = "";
			var firstPart = reverseNumber.substr(0,3);
			var secondPart = reverseNumber.substr(3,reverseNumber.length);
			
			var numberOfCommas = secondPart.length / 2  - 1;
			var  temp = "";
			for(var i = 0 ; i < numberOfCommas ; i+2)
			{
				temp =  secondPart[i]  + secondPart[i+1] + ","; 
			}
			
			temp = temp +  secondPart.substring(temp.length - numberOfCommas , secondPart.length);	
		}
	}*/
	
	this.numberWithCommas = function(x,callback){
		
		callback(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		
	}
	
}]);