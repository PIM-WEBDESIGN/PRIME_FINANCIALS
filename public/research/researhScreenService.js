angular.module('app').service('researhScreenService',['$http','mainAppService',function($http,mainAppService){
	/*
	this.getDataForChart = function(symbol,callback){
		//callback(researchData[symbol]);
		
			
		$.ajax({
			type: "GET",
			headers : { "prime_user_id" : mainAppService.userID , "last_years" : 10},
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/research/prattle",  
			dataType:'json',
			success: function(data){
				if(data.statusCode == 1){
					callback(data.dateAndData.date,data.dateAndData.data);	
				}
			},
			error: function(){
				
			}
		});
	
	};
	
	this.getSpDataForChart = function(symbol,callback){
		//callback(researchData[symbol]);
		
			
		$.ajax({
			type: "GET",
			headers : { "prime_user_id" : mainAppService.userID , "last_years" : 5},
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/research/sp",  
			dataType:'json',
			success: function(data){
				if(data.statusCode == 1){
					callback(data.dateAndData.date,data.dateAndData.data);	
				}
			},
			error: function(){
				
			}
		});
	
	};
	
	this.getDJIAdataForChart = function(symbol,callback){
		//callback(researchData[symbol]);
		
			
		$.ajax({
			type: "GET",
			headers : { "prime_user_id" : mainAppService.userID , "last_years" : 5},
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/research/djia",  
			dataType:'json',
			success: function(data){
				if(data.statusCode == 1){
					callback(data.dateAndData.date,data.dateAndData.data);	
				}
			},
			error: function(){
				
			}
		});
	
	};
	*/
	
	this.getDataForChart = function(callback){
			
		$.ajax({
			type: "GET",
			headers : { "prime_user_id" : mainAppService.userID , "last_years" : 10},
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/research/data",  
			dataType:'json',
			success: function(data){
				if(data.statusCode == 1){
					callback(data.data);	
				}
			},
			error: function(){
				
			}
		});
	
	};
	
	
}]);