var HistoricalDataChart = {
	startDate : "",
	endDate : "",
	init:function(data){
		//HistoricalDataChart.dataStore = data;
		HistoricalDataChart.bindEvents();
		HistoricalDataChart.initialiseChart(data);
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
			var dateArray = StockMarketChartManager.dateArray;
			var container = $(".select-date");
			var startDate = $(container).find( ".startDate" ).val();
			var endDate = $(container).find( ".endDate" ).val();
			var initialIndex = dateArray.indexOf(startDate);
			var lastIndex = dateArray.indexOf(endDate);
			StockMarketChartManager.initialTimeIndex = initialIndex;
			StockMarketChartManager.lastTimeIndex = lastIndex;
			
			var err = HistoricalDataChart.checkValidationOfCalender(startDate,endDate,initialIndex,lastIndex);
			if(err == "")
			{
				StockMarketChartManager.updateChartWithData();	
				HistoricalDataChart.updateMinMaxDateOfCalender();
			}
			else
			{
				alert(err);
			}
		})  

		$(function() {

			$(".select-date").find( ".startDate" ).datepicker({
				dateFormat: 'yy-mm-dd',
				minDate: new Date(HistoricalDataChart.startDate),
				maxDate: new Date(HistoricalDataChart.endDate),
				setDate:new Date(HistoricalDataChart.startDate)
			});
			
			$(".select-date").find( ".endDate" ).datepicker({
				dateFormat: 'yy-mm-dd',
				setDate:new Date(HistoricalDataChart.endDate),
				minDate: new Date(HistoricalDataChart.startDate),
				maxDate: new Date(HistoricalDataChart.endDate)
			});
		});
		
	},
	updateMinMaxDateOfCalender()
	{
			$(".select-date").find( ".startDate" ).datepicker( "option" , {
				dateFormat: 'yy-mm-dd',
				minDate: new Date(HistoricalDataChart.startDate),
				maxDate: new Date(HistoricalDataChart.endDate),
				setDate:new Date(HistoricalDataChart.startDate)
			} );
			
			$(".select-date").find( ".startDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
			$(".select-date").find( ".startDate" ).datepicker('setDate',HistoricalDataChart.startDate);
			
			$(".select-date").find( ".endDate" ).datepicker( "option" , {
				dateFormat: 'yy-mm-dd',
				minDate: new Date(HistoricalDataChart.startDate),
				maxDate: new Date(HistoricalDataChart.endDate),
				setDate:new Date(HistoricalDataChart.endDate)
			});
			$(".select-date").find( ".endDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
			$(".select-date").find( ".endDate" ).datepicker('setDate',HistoricalDataChart.endDate);
			
	},
	checkValidationOfCalender:function(startDate,endDate,initialIndex,lastIndex){

			var err = "";
			if(startDate == "")
			{
				err = ERR_MSG.SELECT_START_DATE;
			}
			else if(endDate == "")
			{
				err = ERR_MSG.SELECT_END_DATE;
			}
			else if(initialIndex == -1)
			{
				err = ERR_MSG.START_DATA_NOT_AVAILABLE;
			}
			else if(lastIndex == -1)
			{
				err = ERR_MSG.END_DATA_NOT_AVAILABLE;
			}
			else if(lastIndex < initialIndex)
			{
				err = ERR_MSG.DATE_CONDITION;
			}
			
			return err;
			
	},
	initialiseChart:function(staticData){
		var historicChartData123=HistoricalDataChart.formatData(staticData);
		var cmfConfigurations={"fieldName":"cmf",'data':historicChartData123};
		var lineConfigurations={'data':historicChartData123,"highFieldName":"High","closeFieldName":"Close","lowFieldName":"Low","Trend":"Trend","LowBand":"LowBand","HighBand":"HighBand","Band":"Band"};
		var pgrColorMap={"-1": "grey",
		"0":"white",
		"1": "#b41923",
        "2": "#b41923",
        "3": "#fed833",
        "4": "#15b328",
        "5": "#15b328"};
		
		var pgrConfiguration={'data':historicChartData123,'pgrColorMap':pgrColorMap,'closeFieldName':'Close'};
	
		
		var dateArray=[];
		$(historicChartData123).each(function(i,obj){
			dateArray.push(obj.date);
		})
		//(id,data,cmfConfigurations,lineChartConfiguration,powerGauageChartConfiguration)
		StockMarketChartManager.drawStockMarketCharts("chartArea",cmfConfigurations,lineConfigurations,pgrConfiguration,dateArray);
		//StockMarketChartManager.drawHLCChart(lineChartConfiguration)
		//mouseOver();
	},
	formatData:function(d){
		 var prices = d.slices[0].indicators[4].data;
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
        for (var i = 0; i < prices.length; i++) {
            //(function (datum, index) {
				var datum=prices[i];
                var split = datum.split(",");
				var index=i;
                parsedData.push({
                    High: parseFloat(split[0]),
                    Low: parseFloat(split[1]),
                    Close: parseFloat(split[2]),
                    date: dates[i],//parseDate1(dates[i]),
                    timeIndex: i,
                    HighBand: parseFloat(highBandData[index]),
                    LowBand: parseFloat(lowBandData[index]),
                    Band: parseFloat(bandData[index]),
                    //Signal: SignalService.toInt(signalData[index]),
                    //Signal: signalData[index],
                    Trend: parseFloat(trendData[index]),
                    cmf: parseFloat(moneyFlowData[index]),
                    OverboughtOversold: parseFloat(overboughtOversoldData[index]),
                    RelativeStrength: parseFloat(relativeStrengthData[index]),
                    PowerGauge: parseFloat(powerGaugeData[index])
                });
            //})(prices[i], i);
        }

        return parsedData;
    }

}





	
	
	
	
		
