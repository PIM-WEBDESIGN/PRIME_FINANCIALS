angular.module('app').service('tabService',['$http',function($http){
	this.symbol =  "";
	this.symbolArray = [];
	
	this.setResearchTabSubscribedSymbol =  function(value){		
		this.symbol = value;
	};
	
	this.getResearchTabSubscribedSymbol  = function(callback){
		callback(this.symbol);
	};
	
	this.setSymbolsToSubscribeOnTabChange = function(val){	
		this.symbolArray.push(val);	
	};
	
	this.getSymbolsToSubscribeOnTabChange = function(callback){
		callback(this.symbolArray);
	};
	
	this.activeTheme = "";
	this.ticksColor = "";
	this.blackTheme = {
						 "cmfColorArray" : ["#4FB845","#CB3E3A"], 
						 "hlcColorArray" : ["#00ff7e","orange","#4fb6f2","cyan","#a7a7a7","yellow"],    
						 "powerGauageColorArray" : ["#426F74"]
					   };
	this.whiteTheme =  {
						 "cmfColorArray" : ["#16A085","#D9544F"], 
						 //"hlcColorArray" : ['#578ebe','#44b6ae','#8775a7','#ffb848','#89c4f4','cyan'],    
						// "hlcColorArray" : ["#578ebe","orange","#4fb6f2","cyan","#a7a7a7","yellow"],    
						 "hlcColorArray" : ["#DB0A5B","#26A65B","blue","cyan","#d9442f","yellow"],    
						 "powerGauageColorArray" : ["#578ebe"]	
					   };
					   
	this.cmfColorArray = [];
	this.hlcColorArray = [];
	this.powerGauageColorArray = [];
	
	this.pieDonutColorArray = {	
								 "black" : ['#a7a7a7','#95d7bb','#fcb322','#e67a77','#aec785'],	
								 "white" : ['#578ebe','#44b6ae','#8775a7','#ffb848','#89c4f4']  	
							  };
						  
	
}]);