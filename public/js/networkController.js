var networkAPI = {


fetchSnapDataViaAjaxCallForSymbolListForPortFolio:function(symbolList, callback){
 console.log("snap symbol:"+symbolList);
			$.ajax({
			type: "POST",
			headers: AuthenticationManager.getHeaders(), 
			url:Constants.TOMCAT_BASE_URL+"snapQuote.jsp?ticker="+symbolList,
			dataType:'json',
			crossDomain: true,
			async: true,
			success: function(data,status){
			  callback(data);
			 }
		});
},

fetchSnapDataViaAjaxCallForSymbolForPortFolio: function (sym, callback) {
	     console.log("snap symbol:"+sym);
			$.ajax({
				type: "POST",
				
				
				//headers: AuthenticationManager.getHeaders(), 
				headers: AuthenticationManager.getHeaders(), 
				
				url:Constants.TOMCAT_BASE_URL+"snapQuote.jsp?ticker="+sym,
				dataType:'json',
				crossDomain: true,
				async: true,
				success: function(data,status){
					callback(data);
				  }
				});
			},

fetchDataViaAjaxCallForSymbol:function(sym, callback)
	{
		 console.log("detail symbol:"+sym);
		$.ajax({
		type: "POST",
		headers: AuthenticationManager.getHeaders(), 
		url:Constants.TOMCAT_BASE_URL+"detailedQuote.jsp?ticker="+sym,
		dataType:'json',
		crossDomain: true,
		 async: true,
		success: function(data,status){
			callback(data);
		  }
	   });
	},
	
	fetchDataForIndicators:function(callback)
	{
		$.ajax({
		type: "POST",
		headers: AuthenticationManager.getHeaders(), 
		url:Constants.TOMCAT_BASE_URL+"marketIndicatorTickerList.jsp",
		dataType:'json',
		crossDomain: true,
		 async: true,
		success: function(data,status){
			callback(data);
		  }
	   });
	},
	
	fetchDataForIndicies:function(callback)
	{
		$.ajax({
		type: "POST",
		headers: AuthenticationManager.getHeaders(), 
		url:Constants.TOMCAT_BASE_URL+"marketIndicesTickerList.jsp",
		dataType:'json',
		crossDomain: true,
		 async: true,
		success: function(data,status){
			callback(data);
		  }
	   });
	},
	
}