var HistoricalDataChart = {
	startDate : "",
	endDate : "",
	cmfConfigurations:'',
	lineChartConfiguration:'',
	powerGauageChartConfiguration:'',
	initialIndex : "",
	lastIndex : "",
	counter : 0,
	lastDate : "",
	inititialTimeArray:[],
	init:function(data,cmfColorArray,hlcColorArray,powerGauageColorArray,ticksColor){
		HistoricalDataChart.bindEvents();
		HistoricalDataChart.initialiseChart(data,cmfColorArray,hlcColorArray,powerGauageColorArray,ticksColor);
	},
	bindEvents:function(){
		$(".chart-type").find(".line").change(function () {
			
            var check = $(this).prop('checked');
			if(check)
			{
				StockMarketChartManager.hideChart("hlcChart","block");
				}else{
				StockMarketChartManager.hideChart("hlcChart","none");
			}
			
		}); 
		
		$(".chart-type").find(".area").change(function () {
            var check = $(this).prop('checked');
			if(check)
			{
				StockMarketChartManager.hideChart("cmfChart","block");
				}else{
				StockMarketChartManager.hideChart("cmfChart","none");
			}
			
		}); 
		
		$(".chart-type").find(".candle").change(function () {
			var check = $(this).prop('checked');
			if(check)
			{
				StockMarketChartManager.hideChart("powerGaugeChart","block");
				}else{
				StockMarketChartManager.hideChart("powerGaugeChart","none");
			}	  
		});
		
		$("#updateChartData").click(function(){
			var dateArray = HistoricalDataChart.inititialTimeArray;
			var container = $(".select-date");
			var startDate = $(container).find( ".startDate" ).val();
			var endDate = $(container).find( ".endDate" ).val();	
			
			
			var initialIndex = dateArray.indexOf(startDate);
			
			if(initialIndex == -1){
				HistoricalDataChart.returnValidStartDate(startDate,function(validDate){
					HistoricalDataChart.startDate = validDate;
					initialIndex = dateArray.indexOf(validDate);
					StockMarketChartManager.initialTimeIndex = initialIndex;
				});				
			}
			else{
				HistoricalDataChart.startDate = startDate;
				StockMarketChartManager.initialTimeIndex = initialIndex;	
			}
			
			
			var lastIndex = dateArray.indexOf(endDate);
			
			if(lastIndex == -1){
				HistoricalDataChart.returnValidStartDate(endDate,function(validDate){
					HistoricalDataChart.endDate = validDate;
					lastIndex = dateArray.indexOf(validDate);
					StockMarketChartManager.lastTimeIndex = initialIndex;				
				});				
			}
			else{
				HistoricalDataChart.endDate = endDate;
				StockMarketChartManager.lastTimeIndex = lastIndex;	
			}
			
			var err = HistoricalDataChart.checkValidationOfCalender(HistoricalDataChart.startDate,HistoricalDataChart.endDate,StockMarketChartManager.initialTimeIndex,StockMarketChartManager.lastTimeIndex);
			if(err == "")
			{	
				StockMarketChartManager.updateChartWithData();	
			}
			else
			{
				alert(err);
			}
			
		})  
	},
	returnValidStartDate : function(date,callback){
		
		var dateArray = JSON.parse(JSON.stringify(HistoricalDataChart.inititialTimeArray));
		var prevDate =  new Date(date);
		var newDate =  new Date(date); 	
		
		newDate.setUTCDate(prevDate.getUTCDate() + 1);
		
		if(prevDate.getUTCDate() < newDate.getUTCDate()){
			newDate.setUTCMonth(prevDate.getUTCMonth());
			var month = newDate.getUTCMonth() + 1; 	
		}
		else{
			newDate.setUTCMonth(prevDate.getUTCMonth());
			var month = newDate.getUTCMonth() + 2;
		}
		
		if(month <= 12){
			var year = newDate.getUTCFullYear().toString();  
		}
		else{
			var year = (newDate.getUTCFullYear()+1).toString();
			month = month%12;  
		}
		month = month.toString();
		var day = newDate.getUTCDate().toString();
		
		if(day.length<2){
			day = "0"+day;	
		}
		
		if(month.length<2){
			month = "0"+ month;
		}
		
		var d = year+"-"+month+"-"+day;
		
		//alert("In valid return Start Date "  +  " Date IS :  "+ d)
		
		var index = dateArray.indexOf(d);
		
		if(index != -1){
			callback(d);
			//alert("index of Start Date	: " + index);
		}
		else{
			HistoricalDataChart.returnValidStartDate(d,callback);	
		}
	}, 
	returnValidDate : function(date,type,callback){
		
		
	}, 
	updateMinMaxDateOfCalender :  function()
	{
		$(".select-date").find( ".startDate" ).datepicker( "option" , {
			dateFormat: 'yy-mm-dd',
			minDate: new Date(HistoricalDataChart.inititialTimeArray[0]),
			maxDate: new Date(HistoricalDataChart.inititialTimeArray[HistoricalDataChart.inititialTimeArray.length-1]),
			setDate:new Date(HistoricalDataChart.startDate)
		} );
		
		$(".select-date").find( ".startDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
		$(".select-date").find( ".startDate" ).datepicker('setDate',HistoricalDataChart.startDate);
		
		$(".select-date").find( ".endDate" ).datepicker( "option" , {
			dateFormat: 'yy-mm-dd',
			minDate: new Date(HistoricalDataChart.inititialTimeArray[0]),
			maxDate: new Date(HistoricalDataChart.inititialTimeArray[HistoricalDataChart.inititialTimeArray.length-1]),
			setDate:new Date(HistoricalDataChart.endDate)
		});
		$(".select-date").find( ".endDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
		$(".select-date").find( ".endDate" ).datepicker('setDate',HistoricalDataChart.endDate);
	},
	checkValidationOfCalender:function(startDate,endDate,initialIndex,lastIndex){
		
		var err = "";
		
		if(startDate == "")
		{
			//alert('1');
			err = ERR_MSG.SELECT_START_DATE;
		}
		else if(endDate == "")
		{
			//alert('2');
			err = ERR_MSG.SELECT_END_DATE;
		}
		else if(initialIndex == -1)
		{
			//alert('3');
			err = ERR_MSG.START_DATA_NOT_AVAILABLE;
		}
		else if(lastIndex == -1)
		{
			//alert('4');
			err = ERR_MSG.END_DATA_NOT_AVAILABLE;
		}
		else if(lastIndex < initialIndex)
		{
			//alert('5');
			err = ERR_MSG.DATE_CONDITION;
		}
		
		return err;
		
	},
	initialiseChart:function(staticData,cmfColorArray,hlcColorArray,powerGauageColorArray,ticksColor){
		//console.log(JSON.stringify(staticData));
		var historicChartData123=HistoricalDataChart.formatData(staticData);
		var cmfConfigurations={"fieldName":"Prattle Data",'data':historicChartData123};
		var lineConfigurations={'data':historicChartData123,"highFieldName":"DJIA","closeFieldName":"Close","lowFieldName":"S&P 500","Trend":"Trend","LowBand":"S&P 500","HighBand":"DJIA","Band":"Band"};
		var pgrColorMap={"-1": "grey",
			"0":"white",
			"1": "#b41923",
			"2": "#b41923",
			"3": "#fed833",
			"4": "#15b328",
		"5": "#15b328"};
		
		var pgrConfiguration={'data':historicChartData123,'pgrColorMap':pgrColorMap,'closeFieldName':'S&P 500'};
		
		//console.log(historicChartData123);
		var dateArray=[];
		/*$(historicChartData123).each(function(i,obj){
			dateArray.push(obj.date);
		})*/
		dateArray = staticData["dates"]; 
		HistoricalDataChart.inititialTimeArray = dateArray;
		HistoricalDataChart.cmfConfigurations = cmfConfigurations
		HistoricalDataChart.lineChartConfiguration = lineConfigurations
		HistoricalDataChart.powerGauageChartConfiguration = pgrConfiguration;
		//var ticksColor ="red";
		//(id,data,cmfConfigurations,lineChartConfiguration,powerGauageChartConfiguration)
		StockMarketChartManager.drawStockMarketCharts("chartArea",cmfConfigurations,lineConfigurations,pgrConfiguration,dateArray,cmfColorArray,hlcColorArray,powerGauageColorArray,ticksColor);
		//StockMarketChartManager.drawHLCChart(lineChartConfiguration)
		//mouseOver();
	},
	formatData:function(d){
		var prices = d.slices[0].indicators[0].data;
		var highBandData = d.slices[0].indicators[0].data;
		var lowBandData = d.slices[0].indicators[1].data;
		var bandData = d.slices[0].indicators[5].data;
		var signalData = d.slices[0].indicators[2].data;
		var trendData = d.slices[0].indicators[3].data;
		var moneyFlowData = d.slices[1].indicators[0].data;
		var overboughtOversoldData = d.slices[2].indicators[0].data;
		var obosReferenceLines = d.slices[2].referencelines;
		var relativeStrengthData = d.slices[3].indicators[0].data;
		var powerGaugeData = d.slices[4].indicators[0].data;
		
		var data = HistoricalDataChart.parseData({
			prices: prices,
			highBandData: highBandData,
			lowBandData: lowBandData,
			bandData: bandData,
			signalData: signalData,
			trendData: trendData,
			moneyFlowData: moneyFlowData,
			overboughtOversoldData: overboughtOversoldData,
			relativeStrengthData: relativeStrengthData,
			powerGaugeData: powerGaugeData
		}, d.dates);
		
		for (var i = 0; i < data.length; i++) {
			data[i].timeIndex = data[i].timeIndex;
			data[i].timestamp = (new Date(data[i].date).getTime());
		}
		data = data.sort(function (x, y) {
			return x.timeIndex - y.timeIndex;
		});
		
		return data;
	},
	parseData:function(data, dates) {
        var prices = data.prices.reverse();
        var highBandData = data.highBandData.reverse();
        var lowBandData = data.lowBandData.reverse();
        var bandData = data.bandData.reverse();
        var signalData = data.signalData.reverse();
        var trendData = data.trendData.reverse();
        var moneyFlowData = data.moneyFlowData.reverse();
        var overboughtOversoldData = data.overboughtOversoldData.reverse();
        var relativeStrengthData = data.relativeStrengthData.reverse();
        var powerGaugeData = data.powerGaugeData.reverse();
        var interval = data.interval;
        dates = dates.reverse();
		
        var parsedData = [];
        var marketDayCtr = 0;
		//alert(dates.length);
		
        for (var i = 0; i < prices.length; i++) {
            //(function (datum, index) {
			var datum=prices[i];
			//var split = datum.split(",");
			var index=i;
			parsedData.push({
				// High: parseFloat(split[0]),
				//Low: parseFloat(split[1]),
				//Close: parseFloat(split[2]),
				date: dates[i],//parseDate1(dates[i]),
				timeIndex: i,
				'DJIA': parseFloat(highBandData[index]),
				'S&P 500': parseFloat(lowBandData[index]),
				Band: parseFloat(bandData[index]),
				//Signal: SignalService.toInt(signalData[index]),
				//Signal: signalData[index],
				Trend: parseFloat(trendData[index]),
				'Prattle Data': parseFloat(moneyFlowData[index]),
				OverboughtOversold: parseFloat(overboughtOversoldData[index]),
				RelativeStrength: parseFloat(relativeStrengthData[index]),
				'S&P 500': parseFloat(powerGaugeData[index])
			});
		//})(prices[i], i);
	}
	
	return parsedData;
}

}










