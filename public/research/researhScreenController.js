angular.module('app').controller('researhScreenController',['$scope','researhScreenService','mainAppService','tabService',function($scope,researhScreenService,mainAppService,tabService){
	
	var lastData = {};
	//var orignalJson={};
	var orignalString='';
	var symbol;
	
	var addButtonSymbolsList = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('FIELD1'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 15,
		local : [{
			"FIELD1":"ACE",
			"FIELD2":"Ace Limited"
			},{
			"FIELD1":"GOOG",
			"FIELD2":"Google Inc-Cl C"
			},{
			"FIELD1":"AAPL",
			"FIELD2":"Apple Inc"
			}, {
			"FIELD1":"F",
			"FIELD2":"Ford Motor Co"
		}, 
		{
			"FIELD1":"CSCO",
			"FIELD2":"Cisco Systems"
			},{
			"FIELD1":"SPY",
			"FIELD2":"SPDR S&P 500 ETF"
		}]
	});
	
	//var subscribedId;
	var symbolDataJson = {symbol : "" , companyName : ""};
	var flag = false;
	var prev = 0;
	var color = "green";
	
	var callback=function(message){
		
		var currentObject=JSON.parse(message);
		
		var symbol = currentObject.T;
		if(currentObject.L){
			//console.log(currentObject.L);
			if(prev < currentObject.L){
				color = "green";	
			}
			else{
				color = "red";					
			}
			
			prev = currentObject.L;
			
			StockMarketChartManager.showLiveDataLine(currentObject.L,color);
		}
		
		$scope.$apply();
	};
	
	$scope.reset = function(){
		//alert("lastData	 :  " +  JSON.stringify(lastData));
		var curJson=JSON.parse(orignalString);
		//orignalJson = curJson;
		HistoricalDataChart.init(curJson,tabService.cmfColorArray,tabService.hlcColorArray,tabService.powerGauageColorArray,tabService.ticksColor);
	}
	
	$scope.init = function(){
		
		
		$('#tickerName').text("GOOG");
		$('#tickerCompany').text("GOOGLE");
		symbol	 = "GOOG";
		var dataStruct =  researchData[symbol];
		
		
		
		researhScreenService.getDataForChart(function(data){
			
			var datalength = data.length;
			var portfolios = {};
			var dateArr = [];
			var p_valueArr = [];
			var d_valueArr = [];
			var s_valueArr = [];
			console.log("data is research array  : %o ",data);
			
			for(var i =0;i<datalength;i++){
				console.log(typeof(data[i]['date']))
				var d = new Date(data[i]['date']); 
				// var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				var month = (d.getUTCMonth()+1).toString();
				var day = d.getUTCDate().toString();
				if(month.length<2)
				month = "0"+month;
				if(day.length<2)
				day = "0"+day;
				
				var date = d.getUTCFullYear()+"-"+month+"-"+day; 
				dateArr.push(date);
				p_valueArr.push(data[i]['p_score']||'');
				d_valueArr.push((data[i]['d_value'])||'');
				s_valueArr.push((data[i]['s_value'])||'');
				
			}
			console.log(dateArr);
			console.log("--------------------------------------------------------------------------------------------------------");
			
			d_valueArr = d_valueArr.reverse();
			
			console.log(d_valueArr);
			
			
			dataStruct["dates"] = dateArr;
			dataStruct["slices"][0]["indicators"][0]["data"] = d_valueArr;
			dataStruct["slices"][0]["indicators"][1]["data"] = s_valueArr;
			dataStruct["slices"][1]["indicators"][0]["data"] = p_valueArr; 
			dataStruct["slices"][4]["indicators"][0]["data"] = s_valueArr;
		
			orignalString=JSON.stringify(dataStruct);
			lastData = dataStruct;
		
		});

		addButtonSymbolsList.initialize();
		
	};
	
	
	$scope.$on('researchDivInit',function(){
		
		if(orignalString != undefined &&  orignalString != ''){
			
			var curJson =JSON.parse(orignalString);
			HistoricalDataChart.init(curJson,tabService.cmfColorArray,tabService.hlcColorArray,tabService.powerGauageColorArray,tabService.ticksColor);
			//$('#textContainer').css('display','block');
			if(mainAppService.subsribeSymbolIdMapping[symbol] === undefined || mainAppService.subsribeSymbolIdMapping[symbol] == ""){
				
			}
			else{
				mainAppService.unsubscribe(symbol);
			}
			
			id = socketClient.client.subscribe("/topic/E:"+symbol, callback);
			mainAppService.subsribeSymbolIdMapping[symbol] = id;		
		}
		
	});
	
	
	/*
		$('.researchSymbolDisplay .typeahead').typeahead(null,{
		highlight: true,
		name: 'FIELD1',
		displayKey: 'FIELD1',
		source: addButtonSymbolsList.ttAdapter(),
		templates: {
		empty: [
		'<div class="empty-message">',
		'no results found',
		'</div>'
		].join('\n'),
		suggestion: function(data){
		return '<p><strong>' +data.FIELD1 + '</strong> <span class = "companyNameNameinAddList"> '+ data.FIELD2 +'</span></p>';
		}	
		},
		engine: Hogan
		})
		.on('typeahead:selected', function (obj, datum) {
		symbolDataJson.symbol = datum.FIELD1;
		symbolDataJson.companyName = datum.FIELD2;
		flag = true;
		});
	*/
	var json = {
		"hlcChart" : "block",
		"cmfChart" : "block",
		"powerGaugeChart" : "block"
	};
	
	$scope.chartHideShow = function(value){
		if(json[value] == "block")
		{	
			json[value] = "none";
		}
		else{
			
			json[value] = "block";
		}
		
		StockMarketChartManager.hideChart(value,json[value]);
	};
	/*
		$('#inputText').on('blur', function() {
		flag = false;
		this.value =  "";
		$('#tickerName').text(symbolDataJson.symbol);
		$('#tickercompanyName').text(symbolDataJson.companyName);
		
		researhScreenService.getDataForChart(symbolDataJson.symbol,function(data){
		HistoricalDataChart.init(data);
		});
		id = socketClient.client.subscribe("/topic/E:"+symbolDataJson.symbol, callback);
		});
		*//*
		$('#inputText').on('keypress', function (e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		//var symbol = symbolDataJson.symbol;
		
		if(symbolDataJson.symbol == symbol){
		
		}
		else{
		symbol = symbolDataJson.symbol;
		if (code == 13 && flag) {
		flag = false;
		e.preventDefault();
		this.value =  "";
		
		var dataStruct =  researchData[symbol];
		
		researhScreenService.getDataForChart(symbol,function(dateArray,dataArray){
		
		alert(dataArray.length);
		
		researhScreenService.getSpDataForChart(symbol,function(spdate,spdata){
		
		alert(spdata.length);
		
		researhScreenService.getDJIAdataForChart(symbol,function(djiaDate,djiaData){
		
		alert(djiaData.length);
		
		dataStruct["dates"] = dateArray;
		dataStruct["slices"][0]["indicators"][0]["data"] = djiaData;
		dataStruct["slices"][0]["indicators"][1]["data"] = spdata;
		dataStruct["slices"][1]["indicators"][0]["data"] = dataArray; 
		dataStruct["slices"][4]["indicators"][0]["data"] = spdata;
		
		
		orignalString = JSON.stringify(dataStruct);
		
		
		if(Object.keys(dateArray).length == 0){
		alert("This symbol data does not EXISt");
		}
		else{
		tabService.setSymbolsToSubscribeOnTabChange($('#tickerName').text());
		tabService.setResearchTabSubscribedSymbol(symbol);
		$('#tickerName').text(symbolDataJson.symbol);
		$('#tickerCompany').text(symbolDataJson.companyName);
		
		console.log(dataStruct);
		
		var curJson=JSON.parse(orignalString);
		console.log(curJson);
		
		//orignalJson = curJson;
		HistoricalDataChart.init(curJson,tabService.cmfColorArray,tabService.hlcColorArray,tabService.powerGauageColorArray,tabService.ticksColor);
		
		if(mainAppService.subsribeSymbolIdMapping[symbol] === undefined || mainAppService.subsribeSymbolIdMapping[symbol] == ""){
		
		}
		else{
		console.log("not undefined")
		mainAppService.unsubscribe(symbol);
		}
		
		id = socketClient.client.subscribe("/topic/E:"+symbol, callback);
		mainAppService.subsribeSymbolIdMapping[symbol] = id;
		
		}
		});
		});
		});
		
		
		}
		}
		
		
	});*/
}])	
