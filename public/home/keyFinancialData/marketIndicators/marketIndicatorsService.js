$.support.cors = true;

angular.module('app').service('marketIndicatorsService',['$http',function($http){
	
	this.getIndicatorsList = function(callback){
		
		$.ajax({
			type: "POST",
			headers: AuthenticationManager.getHeaders(), 
			url:apiManager.http + apiManager.marketIndicatorTickerlist,
			dataType:'json',
			crossDomain: true,
			async: true,
			success: function(data){
				if(data.status==='SUCCESS'){
					
					if((data.new_entitlements!==undefined)&&(Object.keys(data.new_entitlements).length > 0)){
							//alert("new_entitlements in market indicators is : "+JSON.stringify(data.new_entitlements));
						sessionStorage.setItem("UID",data.new_entitlements.userID);
						sessionStorage.setItem("TOKEN",data.new_entitlements.TOKEN); 
					}
					callback(data.mitickerlist);
				}				
			}
		});
		
	};
	
}]);