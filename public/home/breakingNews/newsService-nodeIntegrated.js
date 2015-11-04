angular.module('app').service('newsService',['$http','$sce',function($http,$sce){
	
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
						callback(data.newsList);
					}
				},
				error: function(request, status, error){
					alert("COULDN'T ABLE TO FETCH NEWS FROM COMTEX");
				}
			});
		
			
		};
	
		
	this.fetchNewsDetailsForDJN = function(nid,source,callback)
	{
		source=source=='N'?'EDGE':'DOWJONES';
		var sourceVal ='http://199.96.250.198/b4utrade/app/EquityPlusScrollingNewsDetail.do?BACK_TO_ID=MARKETNEWS&HEADER=FALSE&NEWS_ID='+nid+'&NEWS_SOURCE='+source;
		
	     $.ajax({
			type: "GET",
		});		
		
		callback(sourceVal);
		
	};
		
	
	
		
}]);