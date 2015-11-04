angular.module('app').service('newsService',['$http',function($http){
	
	this.getNews =  function(callback){
		$.ajax({
			type: "POST",
			headers: AuthenticationManager.getHeaders(), 
			url: apiManager.http + apiManager.news,
			dataType:'json',
			crossDomain: true,
			async: true,
			success: function(data,status){
				if(data.status==="SUCCESS"){
					console.log(data);
					
					if((data.new_entitlements!==undefined)&&(Object.keys(data.new_entitlements).length > 0)){
					     //alert("new_entitlements in news services is : "+JSON.stringify(data.new_entitlements));
						sessionStorage.setItem("UID",data.new_entitlements.userID);
						sessionStorage.setItem("TOKEN",data.new_entitlements.TOKEN); 
					}
					callback(data.newsList);
				}
			},
			error: function(request, status, error){
				alert("UNABLE TO FETCH NEWS FROM COMTEX");
				callback("error");
			}
		});
	};
	
	this.fetchNewsDetailsForDJN = function(nid,source,callback)
	{
		source=source=='N'?'EDGE':'DOWJONES';
		var sourceVal ='http://199.96.250.198/b4utrade/app/EquityPlusScrollingNewsDetail.do?BACK_TO_ID=MARKETNEWS&HEADER=FALSE&NEWS_ID='+nid+'&NEWS_SOURCE='+source;
		
		callback(sourceVal);
		
	};
	
}]);