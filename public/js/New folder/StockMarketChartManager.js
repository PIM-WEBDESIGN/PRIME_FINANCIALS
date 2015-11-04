StockMarketChartManager={
	initialYValue:'',
	initialTimeIndex:'',
	lastTimeIndex:'',
	showToolTipStatus:true,
	xScaleHistoricChart:'',
	data:'',
	cmfConfigurations:'',
	lineChartConfiguration:'',
	powerGauageChartConfiguration:'',
	selectorContainerId:'',
	chartHeightMap:{},
	margin:{top:10,left:20,right:20,bottom:10},
	scalableLimit:2,
	areaSubsetArray:[],
	area:'',
	textLabelDx:50,
	dateArray:[],
	chartStyleMap:{"hlcChart":"block","cmfChart":"block","powerGaugeChart":"block"},
	
	drawStockMarketCharts:function(id,cmfConfigurations,lineChartConfiguration,powerGauageChartConfiguration,dateArray){
	
		
		HistoricalDataChart.startDate = dateArray[0];
		HistoricalDataChart.endDate = dateArray[dateArray.length-1];
		HistoricalDataChart.updateMinMaxDateOfCalender();
		
		StockMarketChartManager.selectorContainerId=id;
		
		//d3.select("#"+id).style("background","#3A5568");
		
		StockMarketChartManager.emptyCharts();
		StockMarketChartManager.getHeightOfEachChart();
		
		StockMarketChartManager.cmfConfigurations=cmfConfigurations;
		StockMarketChartManager.lineChartConfiguration=lineChartConfiguration;
		StockMarketChartManager.powerGauageChartConfiguration=powerGauageChartConfiguration;
		
		StockMarketChartManager.dateArray=dateArray;
		
		StockMarketChartManager.drawHLCChart(lineChartConfiguration);
		StockMarketChartManager.drawCmfChart(cmfConfigurations);
		StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration);
		StockMarketChartManager.drawTimeScale(dateArray);
		StockMarketChartManager.attachHoveringEffect();
		StockMarketChartManager.listenWindowResize();	
		StockMarketChartManager.appendToolTip();	
		//StockMarketChartManager.attachPanningAndZooming(StockMarketChartManager.xScaleHistoricChart,id);
		
	},
	listenWindowResize:function(){
		$(window).resize(function () {
			StockMarketChartManager.updateChartOnResize();
		});
	},
	attachHoveringEffect:function(){
		
		var containerId=StockMarketChartManager.selectorContainerId;
		
		var margin=StockMarketChartManager.margin;
		
		var dateArray= StockMarketChartManager.dateArray;
		var hlcData=StockMarketChartManager.lineChartConfiguration.data;
		var cmfData=StockMarketChartManager.cmfConfigurations.data;
		var powerGauageData=StockMarketChartManager.powerGauageChartConfiguration.data;
		
		var hlcHighFieldName=StockMarketChartManager.lineChartConfiguration["highFieldName"];
		var hlcCloseFieldName=StockMarketChartManager.lineChartConfiguration["closeFieldName"];
		var hlcLowFieldName=StockMarketChartManager.lineChartConfiguration["lowFieldName"];
		
		
		var cmfFieldName=StockMarketChartManager.cmfConfigurations["fieldName"];
		var powerGaugeFieldName=StockMarketChartManager.powerGauageChartConfiguration["closeFieldName"];
		
		d3.select("#"+containerId)
		.on("mousedown",function(){
			StockMarketChartManager.hideToolTip();
			d3.select("#"+containerId)
				.selectAll(".drag-line")
				.style("display","none");
			StockMarketChartManager.showToolTipStatus = false;
			var xScale=StockMarketChartManager.xScaleHistoricChart;	
			var pageX=event.pageX-$("#"+containerId).offset().left;
			StockMarketChartManager.initialTimeIndex = parseInt(Math.round(xScale.invert(pageX)));
	
		})
		.on("mouseup",function(){
			StockMarketChartManager.showToolTipStatus = true;
			var xScale=StockMarketChartManager.xScaleHistoricChart;	
			var pageX=event.pageX-$("#"+containerId).offset().left;
			StockMarketChartManager.lastTimeIndex = parseInt(Math.round(xScale.invert(pageX)));
			

			
			if(Math.abs(StockMarketChartManager.lastTimeIndex - StockMarketChartManager.initialTimeIndex) > 10)
			{
				StockMarketChartManager.updateChartWithData();
			}
			
		})
		.on("mousemove",function(){
		  
			var xScale=StockMarketChartManager.xScaleHistoricChart;	
			var marginLeft=margin.left-margin.left*0.08;
			
			var pageX=event.pageX-$("#"+containerId).offset().left;
			var lineXPos=Math.round(xScale.invert(pageX));
			
			if(lineXPos<0 || lineXPos>(dateArray.length-1)){
				//console.log("out of bound");
				d3.select("#"+containerId)
				.selectAll(".drag-line")
				.style("display","none");
				
				StockMarketChartManager.hideToolTip();
			}
			else{
				d3.select("#"+containerId)
				.selectAll(".drag-line")
				.attr("x1",xScale(lineXPos))
				.attr("x2",xScale(lineXPos));
				
				var hlcHigh=hlcData[lineXPos][hlcHighFieldName];
				var hlcClose=hlcData[lineXPos][hlcCloseFieldName];
				var hlcLow=hlcData[lineXPos][hlcLowFieldName];
				
				var cmfValue=cmfData[lineXPos][cmfFieldName];
				var powerGaugeVal=powerGauageData[lineXPos][powerGaugeFieldName];
				
			//	console.log(hlcHigh+" :: "+"::"+hlcClose+" :: "+hlcLow+":: "+cmfValue +" :: "+powerGaugeVal + " :: "+dateArray[lineXPos]);
				
				 var yHeadingValueMap=[{"headingName":hlcCloseFieldName,"headingVal":hlcClose},
									   {"headingName":hlcHighFieldName,"headingVal":hlcHigh},
									   {"headingName":hlcLowFieldName,"headingVal":hlcLow},
									   {"headingName":cmfFieldName,"headingVal":cmfValue},
									   {"headingName":powerGaugeFieldName,"headingVal":powerGaugeVal}
									   
									  ];
				
				$('#'+containerId).disableSelection();
				
				if(StockMarketChartManager.showToolTipStatus == false)
				{
					d3.selectAll(".brushingRect").remove();
					var xValue = xScale(StockMarketChartManager.initialTimeIndex)<xScale(lineXPos)?xScale(StockMarketChartManager.initialTimeIndex):xScale(lineXPos);
					
					d3.select("#hlcChart").append("rect")
										  .attr("class","brushingRect")
										  .attr("x",xValue)
										  .attr("y",0)
										  .attr("width",Math.abs(xScale(lineXPos)-xScale(StockMarketChartManager.initialTimeIndex)))
										  .attr("height",StockMarketChartManager.chartHeightMap.hlc)
										  .attr("fill","black")
										  .style("opacity", 0.4);
										  
					d3.select("#cmfChart").append("rect")
										  .attr("class","brushingRect")
										  .attr("x",xValue)
										  .attr("y",0)
										  .attr("width",Math.abs(xScale(lineXPos)-xScale(StockMarketChartManager.initialTimeIndex)))
										  .attr("height",StockMarketChartManager.chartHeightMap.cmf)
										  .attr("fill","black")
										  .style("opacity", 0.4);
										  
					d3.select("#power-gauage").append("rect")
										  .attr("class","brushingRect")
										  .attr("x",xValue)
										  .attr("y",0)
										  .attr("width",Math.abs(xScale(lineXPos)-xScale(StockMarketChartManager.initialTimeIndex)))
										  .attr("height",StockMarketChartManager.chartHeightMap.powergauage-5)
										  .attr("fill","black")
										  .style("opacity", 0.4);
										
				}
				
				if(StockMarketChartManager.showToolTipStatus == true)
				{
					StockMarketChartManager.showToolTip(d3.event, "", dateArray[lineXPos],false,yHeadingValueMap ,"");
					d3.select("#"+containerId)
						.selectAll(".drag-line")
					.style("display","block");
				}	
			}
		})
		.on("mouseleave",function(){
		
				StockMarketChartManager.hideToolTip();
				d3.select("#"+containerId)
				.selectAll(".drag-line")
				.style("display","none");
			
		})
	},
	updateChartOnResize:function(){
	
		var cmfConfigurations=StockMarketChartManager.cmfConfigurations;
		var lineChartConfiguration=StockMarketChartManager.lineChartConfiguration;
		var powerGauageChartConfiguration=StockMarketChartManager.powerGauageChartConfiguration;
		
		StockMarketChartManager.emptyCharts();
		
		//StockMarketChartManager.chartStyleMap[chartName]="none";
		
		var isShowHlC=StockMarketChartManager.chartStyleMap["hlcChart"];
		var isShowCMF=StockMarketChartManager.chartStyleMap["cmfChart"];
		var isShowPowerGauage=StockMarketChartManager.chartStyleMap["powerGaugeChart"];
		
		StockMarketChartManager.getHeightOfEachChart();
		//var data=StockMarketChartManager.data;
		if(isShowHlC == "block"){
			StockMarketChartManager.drawHLCChart(lineChartConfiguration);
		}
		
		if(isShowCMF == "block"){
			StockMarketChartManager.drawCmfChart(cmfConfigurations);
		}
		
		if(isShowPowerGauage == "block"){
			StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration);
		}
		
		var dateArray=StockMarketChartManager.dateArray;
		StockMarketChartManager.drawTimeScale(dateArray);
	},
	updateChartWithData:function(){
		
		var id=StockMarketChartManager.selectorContainerId;
		var cmfConfigurations=StockMarketChartManager.cmfConfigurations;
		var lineChartConfiguration=StockMarketChartManager.lineChartConfiguration;
		var powerGauageChartConfiguration=StockMarketChartManager.powerGauageChartConfiguration;
		var dateArray = StockMarketChartManager.dateArray
		
		var initialX = StockMarketChartManager.initialTimeIndex;
		var lastX = StockMarketChartManager.lastTimeIndex;
		var temp;
		if(initialX>=lastX)
		{
			temp = initialX;
			initialX = lastX;
			lastX = temp;
		}
		dateArray = dateArray.slice(initialX,lastX);
		var powerGauageData = powerGauageChartConfiguration["data"].slice(initialX,lastX);
		powerGauageChartConfiguration["data"] = powerGauageData;
		var lineChartData = lineChartConfiguration["data"].slice(initialX,lastX);
		lineChartConfiguration["data"] = lineChartData;
		var cmfData =cmfConfigurations["data"].slice(initialX,lastX);
		cmfConfigurations["data"] = cmfData;
		StockMarketChartManager.drawStockMarketCharts(id,cmfConfigurations,lineChartConfiguration,powerGauageChartConfiguration,dateArray);
	},
	hideChart:function(chartName,display){
		var id=StockMarketChartManager.selectorContainerId;
		//d3.select("#"+id).select("."+chartName).style("display",'none');
		
		var cmfConfigurations=StockMarketChartManager.cmfConfigurations;
		var lineChartConfiguration=StockMarketChartManager.lineChartConfiguration;
		var powerGauageChartConfiguration=StockMarketChartManager.powerGauageChartConfiguration;
		
		
		
		StockMarketChartManager.emptyCharts();
		
		StockMarketChartManager.chartStyleMap[chartName]=display;
		
		var isShowHlC=StockMarketChartManager.chartStyleMap["hlcChart"];
		var isShowCMF=StockMarketChartManager.chartStyleMap["cmfChart"];
		var isShowPowerGauage=StockMarketChartManager.chartStyleMap["powerGaugeChart"];
		
		StockMarketChartManager.getHeightOfEachChart();
		//var data=StockMarketChartManager.data;
		if(isShowHlC == "block"){
			StockMarketChartManager.drawHLCChart(lineChartConfiguration);
		}
		
		if(isShowCMF == "block"){
			StockMarketChartManager.drawCmfChart(cmfConfigurations);
		}
		
		if(isShowPowerGauage == "block"){
			StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration);
		}
		
		var dateArray=StockMarketChartManager.dateArray;
		StockMarketChartManager.drawTimeScale(dateArray);
		
		
	},
	showChart:function(chartName){
		var id=StockMarketChartManager.selectorContainerId;
		//d3.select("#"+id).select("."+chartName).style("display",'block');
		
		StockMarketChartManager.chartStyleMap[chartName]="block";
		
		var isShowHlC=StockMarketChartManager.chartStyleMap["hlcChart"];
		var isShowCMF=StockMarketChartManager.chartStyleMap["cmfChart"];
		var isShowPowerGauage=StockMarketChartManager.chartStyleMap["powerGaugeChart"];
		
		var cmfConfigurations=StockMarketChartManager.cmfConfigurations;
		var lineChartConfiguration=StockMarketChartManager.lineChartConfiguration;
		var powerGauageChartConfiguration=StockMarketChartManager.powerGauageChartConfiguration;
		
		StockMarketChartManager.emptyCharts();
		
		StockMarketChartManager.getHeightOfEachChart();
		//var data=StockMarketChartManager.data;
		if(isShowHlC == "block"){
			StockMarketChartManager.drawHLCChart(lineChartConfiguration);
		}
		
		if(isShowCMF == "block"){
			StockMarketChartManager.drawCmfChart(cmfConfigurations);
		}
		
		if(isShowPowerGauage == "block"){
			StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration);
		}
		
		var dateArray=StockMarketChartManager.dateArray;
		StockMarketChartManager.drawTimeScale(dateArray);
		
	},
	attachPanningAndZooming:function(xScale,id){
		var panningAndZooming=d3.behavior.zoom().x(xScale).scaleExtent([1, 8]).on("zoom", zoom);					
		d3.select('#'+id).call(panningAndZooming);
		var scalableLimit=StockMarketChartManager.scalableLimit;
		
		var width=d3.select('#'+id).style("width").replace("px","");
		
		function zoom() {
			
			var t = panningAndZooming.translate(),
			tx = t[0],
			ty = t[1];

			tx = Math.min(tx, 0);
			tx = Math.max(tx, width -( scalableLimit*width) );
			panningAndZooming.translate([tx, ty]);
			/* 
			d3.select("#xAxisCloseDifference").call(xAxisHistoricCharts);
			
			historicChartSvg.select(".historicLineDema").attr('d',demaLine(historicChartData));
			d3.selectAll('.closePriceDifferenceRect').data(historicChartData)
			.attr('x',function(d){ //console.log("update rect");
			return xScaleHistoricChart(parseDate.parse(d.timeIndex));})
			.attr('y',function(d){ return yScaleCloseDifference(d.close);});
			
			d3.selectAll('.closeBar').data(historicChartData)
						.attr('x',function(d){
							return xScaleHistoricChart(parseDate.parse(d.timeIndex));
						})
						.attr('y',function(d){
							return yScaleHistoricChart(d.close);
						});
			*/	
			
			var datRef=d3.selectAll('.money-flow-area ').data([StockMarketChartManager.areaSubsetArray])
			.attr('d',function(d){return StockMarketChartManager.area(d);});
			
			
		} 
	},
	emptyCharts:function(){
		var id=StockMarketChartManager.selectorContainerId;
		document.getElementById(""+id).innerHTML="";
		
	},
	getHeightOfEachChart:function(){
		var id=StockMarketChartManager.selectorContainerId;
		
		var containerHeight=d3.select("#"+id).style("height");
		
		containerHeight=parseInt(containerHeight.replace("px",""));
		
		var  chartHeightMap={"cmf":'',"hlc":"","powergauage":""};
		
		var cmfChartDisplay=StockMarketChartManager.chartStyleMap["cmfChart"];
		var lineChartDisplay=StockMarketChartManager.chartStyleMap["hlcChart"];
		var powerGauageChartDisplay=StockMarketChartManager.chartStyleMap["powerGaugeChart"];
		
		/*
		try{
			cmfChartDisplay=d3.select("#"+id).select(".cmfChart").style("display");
		}
		catch(err){
			console.log("cmf chart not exist");
		}
		
		try{
			lineChartDisplay=d3.select("#"+id).select(".hlcChart").style("display");
		}
		catch(err){
			console.log("line chart not exist");
		}
		
		try{
			powerGauageChartDisplay=d3.select("#"+id).select(".powerGaugeChart").style("display")
		}
		catch(err){
			console.log("gauage chart not exist");
		}
		*/
		
		/*var midHeight= containerHeight/2;	
		//height of hlc
		var hlcHeight=containerHeight;
		if(powerGauageChartDisplay == 'block'){
			hlcHeight=hlcHeight-midHeight/3;
		}
		
		if(cmfChartDisplay == "block"){
			hlcHeight=hlcHeight-midHeight/1.5;
		}
		
		
		//cmf height
		var cmfHeight=containerHeight;
		if(powerGauageChartDisplay == "block"){
			cmfHeight=cmfHeight-midHeight/3;
			//console.log("********cmf height removed ****");
		}
		
		if(lineChartDisplay == "block"){
			cmfHeight=cmfHeight-midHeight;
		}
		
		var powerGauageHeight=midHeight/6;
		*/
		var hlcHeight = 0;
		var cmfHeight = 0;
		var powerGauageHeight = 0 ;
		if(lineChartDisplay == "block" && cmfChartDisplay == "block" && powerGauageChartDisplay == 'block')
		{
			hlcHeight = containerHeight*.4
			cmfHeight = containerHeight*.3
			powerGauageHeight = containerHeight*.25;
		}
		else if(lineChartDisplay == "block" && cmfChartDisplay == "none" && powerGauageChartDisplay == 'none')
		{
			hlcHeight = containerHeight*.95;
			cmfHeight = 0
			powerGauageHeight = 0;
		}
		else if(lineChartDisplay == "none" && cmfChartDisplay == "block" && powerGauageChartDisplay == 'none')
		{
			hlcHeight = 0;
			cmfHeight = containerHeight*.95
			powerGauageHeight = 0;
		}
		else if(lineChartDisplay == "none" && cmfChartDisplay == "none" && powerGauageChartDisplay == 'block')
		{
			hlcHeight = 0;
			cmfHeight = 0;
			powerGauageHeight = containerHeight*.95;
		}
		else if(lineChartDisplay == "block" && cmfChartDisplay == "block" && powerGauageChartDisplay == 'none')
		{
			hlcHeight = containerHeight*.55
			cmfHeight = containerHeight*.4
			powerGauageHeight = 0;
		}
		else if(lineChartDisplay == "block" && cmfChartDisplay == "none" && powerGauageChartDisplay == 'block')
		{
			hlcHeight = containerHeight*.65
			cmfHeight = 0 ;
			powerGauageHeight = containerHeight*.3;
		}
		else if(lineChartDisplay == "none" && cmfChartDisplay == "block" && powerGauageChartDisplay == 'block')
		{
			hlcHeight = 0;
			cmfHeight = containerHeight*.55
			powerGauageHeight = containerHeight*.4;
		}
	/*		powerGauageHeight = containerHeight
			if(lineChartDisplay == "block"){
				powerGauageHeight=powerGauageHeight*.;
			}
			if(cmfChartDisplay == 'block'){
				powerGauageHeight=powerGauageHeight*.35;
			}
		}
		else{
			powerGauageHeight = 0;
		}*/
		chartHeightMap.cmf=cmfHeight;
		chartHeightMap.hlc=hlcHeight;
		chartHeightMap.powergauage=powerGauageHeight;
		
		StockMarketChartManager.chartHeightMap=chartHeightMap;
		
	},
	generateXScale:function(){
		var xMin=d3.min(dateArray.map( function(d) { return parseDate.parse(d);}));
		var xMax=d3.max(dateArray.map(function(d) { return parseDate.parse(d);}));
		xScaleHistoricChart=d3.time.scale().range([0, (historicalChartWidth*scalableLimit)]).domain([xMin,xMax]);
		
	},
	drawCmfChart:function(cmfChartConfigration){	
		var id=StockMarketChartManager.selectorContainerId;
		var margin=StockMarketChartManager.margin;
		var scalableLimit=StockMarketChartManager.scalableLimit;
		
		var data=cmfChartConfigration.data;
		var cmfFieldName=cmfChartConfigration.fieldName;
		var chartHeightMap=StockMarketChartManager.chartHeightMap;
		
		
		var width=d3.select("#"+id).style("width");
		var height=chartHeightMap.cmf;
		
		width=parseInt(width.replace("px",""));
		
		var widthDomain=width-margin.left-margin.right;
		var heightDomain=height-margin.top-margin.bottom;
		
		
		
		var chart = d3.select("#"+id)
            .append("svg:svg")
            .attr("class", "cmfChart")
			.attr("id","cmfChart")
            .attr("width",width)
            .attr("height",height);
			
		
		var clipCMF = chart.append("defs").append("svg:clipPath")
		.attr("id", "clip1")
		.append("svg:rect")
		.attr("id", "clip-rect")
		.attr("x", "0")
		.attr("y", "0")
		.attr("width", width)
		.attr("height",height);	
		
		var cmfClipGrouping=chart.append('g').attr("clip-path", "url(#clip1)")
		
        if (data == undefined || data.length == 0) return;
		
		for (var i=0; i < data.length; i++) {
			var e=data[i];
			for (var k in e) {
				if (isNaN(e[k]) || e[k] == null){
					//console.log("value befor "+e[k]);
					e[k]="N/A";
					// console.log("value after "+e[k]);
				}
			}
			data[i]=e;
					
		}
		
		var moneyFlowArray=new Array();
		for(var i=0;i<data.length;i++){
			if(data[i][cmfFieldName] != "N/A"){
				moneyFlowArray.push(data[i][cmfFieldName]);
			}
			//data[i].timeIndex=data[i].timeIndex1;
		}
		
		moneyFlowArray.sort(function(a,b){
			if(a>b){
				return 1; 
			}
			else if(b>a){
				return -1;
			}
			else{
				return 0;
			}
		});
		
		var min=moneyFlowArray[0];
		var max=moneyFlowArray[moneyFlowArray.length-1];
		
		var midPoint=0;//(min+max)/2;
		
		
		var yScale = d3.scale.linear()
		.domain([min,max])
		.range([heightDomain-margin.bottom, margin.top]);
		
		var xScale = d3.scale.linear()
            .domain([d3.min(data.map(function (d) {
                return d.timeIndex;
            })), d3.max(data.map(function (d) {
                return d.timeIndex;
            }))])
			.range([margin.left, (widthDomain-margin.left)]);	
            //.range([margin.left, (widthDomain)*scalableLimit]);
		
		StockMarketChartManager.xScaleHistoricChart=xScale;
		
		// console.log("money flow min "+min +" max Money flow "+max);
		
		var textLabelDx=StockMarketChartManager.textLabelDx;
		
        cmfClipGrouping.append("line")
            .attr("class", "divider")
            .attr("x1", xScale(data[0].timeIndex))
            .attr("y1", yScale(midPoint))
            .attr("x2", xScale(data[data.length - 1].timeIndex))
            .attr("y2", yScale(midPoint));
		
		cmfClipGrouping.append("text")
            .attr("class", "yrule")
            .attr("x", widthDomain - margin.right+textLabelDx)
            .attr("y", yScale(midPoint))
            .attr("dy", 0)
            .attr("dx","-1.2em")
            .attr("text-anchor", "end")
            .text(parseFloat(midPoint).toFixed(2))
			.style("color","#FFFFFF")
			.attr("fill","white");
		
		
		var turningPoints = [0];

        $(data).each(function (index, datum) {
            if (index > 0) {
				if(!isNaN(data[index - 1][cmfFieldName]) && !isNaN(datum[cmfFieldName])){
					if (sign(data[index - 1][cmfFieldName]) != sign(datum[cmfFieldName]) && datum[cmfFieldName] != 0) {
						turningPoints.push(index);
					}
				}
				else{
					turningPoints.push(index);
				}
            }
        });
		
		/*
		$(data).each(function(i,obj){
			console.error("obj "+obj[cmfFieldName]);
		});
		*/
		
        turningPoints.push(data.length - 1);
		
		var alternatingStyle = data[0][cmfFieldName] > midPoint;
        var lastMidPointTimeStamp;
        $(turningPoints).each(function (index, tp0) {
            var subset;
            if (index != turningPoints.length - 1) {
                var tp1 = turningPoints[index + 1];
				//console.log("INDEX "+index + "index next  "+(index+1));
                subset = data.slice(tp0, tp1);
                if (lastMidPointTimeStamp != undefined) {
                    subset.unshift({
                        timeIndex: lastMidPointTimeStamp,
                        MoneyFlow: midPoint
                    });
                }
                lastMidPointTimeStamp = Math.round((data[tp1 - 1].timeIndex + data[tp1].timeIndex) / 2);
				
                
				var mFlow;
				if(tp1!=tp0 && tp1!=data.length-1){
					// < data.length - 1){
					mFlow=midPoint;
				}
				else{
					if(data[tp1][cmfFieldName]=="N/A"){
						mFlow=midPoint;
					}
					else{
						mFlow=data[tp1][cmfFieldName];
					}
				}
				

				subset.push({
					timeIndex: (tp1 + 1 <= data.length - 1) ? lastMidPointTimeStamp : data[data.length - 1].timeIndex+1,
					MoneyFlow:mFlow 
				});
				//console.log(data.length-1);
				if(data[data.length-1][cmfFieldName]>0 && data[data.length-2][cmfFieldName]<0 && tp1== (data.length-1) && tp1!=tp0 ){
					// console.log('splice');
					subset.splice(-1,1);
					subset.push({
						timeIndex: (tp1 + 1 <= data.length - 1) ? lastMidPointTimeStamp : data[data.length - 1].timeIndex+1,
						MoneyFlow:midPoint
					});
				}
				else if((data[data.length-1][cmfFieldName]<0 && data[data.length-2][cmfFieldName]>0) && tp1==data.length-1  && tp1!=tp0){
					// console.log('splice');
					subset.splice(-1,1);
					subset.push({
						timeIndex: (tp1 + 1 <= data.length - 1) ? lastMidPointTimeStamp : data[data.length - 1].timeIndex+1,
						MoneyFlow:midPoint
					});
				}
				
				else if((tp1!=tp0 && tp1==data.length-1)){
					subset.push({
						timeIndex: (tp1 + 1 <= data.length - 1) ? lastMidPointTimeStamp : data[data.length - 1].timeIndex+1,
						MoneyFlow:midPoint
					});
				}
				
				if(data[tp0].cmfFieldName == "N/A"){
					alternatingStyle=(data[tp1][cmfFieldName] >= midPoint);
				}
				else{	
              	
                  alternatingStyle=(data[tp0][cmfFieldName] >= midPoint);
				}
                
				//StockMarketChartManager.area = d3.svg.area()
				var area = d3.svg.area()
                    .x(function (d) {
						//console.log("time indewx "+xScale(d.timeIndex))
                        return xScale(d.timeIndex);
                    })
                    .y0(yScale(midPoint))
                    .y1(function (d) {
						
						if(d[cmfFieldName]!="N/A"){
							//console.log("cmf "+d[cmfFieldName] +" y "+yScale(d[cmfFieldName]));
							if(d[cmfFieldName] !=undefined){
								return yScale(d[cmfFieldName]);
							}else{
								//console.log("undefined");
								return yScale(midPoint);
							}
							
						}else{
							console.log("0 "+yScale(midPoint));
							return yScale(midPoint);
						}
                        
                    })
                    .interpolate("basis");
				
				$(subset).each(function(i,obj){
					//console.log("cmfsss "+obj[cmfFieldName] +" y "+yScale(obj[cmfFieldName]));
					if(obj[cmfFieldName] === undefined){
						//console.log("undeifne condi");
						obj[cmfFieldName]="N/A";
					}
					StockMarketChartManager.areaSubsetArray.push(obj);
				});
				
				
                cmfClipGrouping.append("path")
                    .datum(subset)
                    .attr("class", "money-flow-area " + ((alternatingStyle) ? "positive" : "negative"))
					.attr('fill',function(){
						if(alternatingStyle){
							return "#2C6266"
						}else{
							return "#9C9C9C";
						}
						
					})
                    .attr("d", area(subset));
				
            }
        });

		function sign(x) {
            return x > midPoint ? 1 : x < midPoint ? -1 : 0;
        }
		
		//append tool tip
		chart
		.append("line")
		.attr("x1",5)
		.attr("x2",5)
		.attr("y1",0)
		.attr("y2",height)
		.attr("class","drag-line")
		.style("display","none")
		.style("stroke","#282B2E")
		.style("stroke-width","2px");
	
	},
	drawHLCChart:function(lineChartConfiguration){
		var id=StockMarketChartManager.selectorContainerId;
		var margin=StockMarketChartManager.margin;
		var scalableLimit=StockMarketChartManager.scalableLimit;
		
		var data=lineChartConfiguration.data;
		var highFieldName=lineChartConfiguration.highFieldName;
		var closeFieldName=lineChartConfiguration.closeFieldName;
		var lowFieldName=lineChartConfiguration.lowFieldName;
		var highBand=lineChartConfiguration.HighBand;
		var lowBand=lineChartConfiguration.LowBand;
		var band=lineChartConfiguration.Band;
		var trend=lineChartConfiguration.Trend;
		
		var chartHeightMap=StockMarketChartManager.chartHeightMap;
		
		for (var i=0; i < data.length; i++) {
			var e=data[i];
			for (var k in e) {
				if (isNaN(e[k]) || e[k] == null){
					//console.log("value befor "+e[k]);
					e[k]="N/A";
					// console.log("value after "+e[k]);
				}
			}
			data[i]=e;
					
		}
		
		var width=d3.select("#"+id).style("width");
		var height=chartHeightMap.hlc;
		
		width=parseInt(width.replace("px",""));
		
		var widthDomain=width-margin.left-margin.right;
		var heightDomain=height-margin.top-margin.bottom;
		
	  
		
		var chart = d3.select("#"+id)
            .append("svg:svg")
            .attr("class", "hlcChart")
			.attr("id","hlcChart")
            .attr("width",width)
            .attr("height",height);
		
		var min = getMinRange(data);

        var max = getMaxRange(data);
		
		var yScale = d3.scale.linear()
		.domain([min,max])
		.range([heightDomain-margin.bottom, margin.top]);
		
	var xScale = d3.scale.linear()
            .domain([d3.min(data.map(function (d) {
                return d.timeIndex;
            })), d3.max(data.map(function (d) {
                return d.timeIndex;
            }))])
			.range([margin.left, (widthDomain-margin.left)]);
			
            //.range([margin.left, (widthDomain)*scalableLimit]);
		
		StockMarketChartManager.xScaleHistoricChart=xScale;	
		
		
		/*
       chart.selectAll("line.x")
            .data(xScale.ticks(10))
            .enter().append("svg:line")
            .attr("class", "x")
            .attr("x1", xScale)
            .attr("x2", xScale)
            .attr("y1", marginBottom)
            .attr("y2", chartHeight - marginTop)
            .attr("stroke", "#ccc");

        chart.selectAll("line.y")
            .data(yScale.ticks(10))
            .enter().append("svg:line")
            .attr("class", "y")
            .attr("x1", marginLeft)
            .attr("x2", width - marginRight)
            .attr("y1", yScale)
            .attr("y2", yScale)
            .attr("stroke", "#ccc");
		*/
		var textLabelDx=StockMarketChartManager.textLabelDx;
		
        chart.selectAll("text.yrule")
            .data(yScale.ticks(10))
            .enter().append("svg:text")
            .attr("class", "yrule")
            .attr("x", widthDomain - margin.right + textLabelDx)
            .attr("y", yScale)
            .attr("dy", 0)
            .attr("dx", 0)
            .attr("text-anchor", "end")
			.style("color","#FFFFFF")
			.style("font-size","12px")
            .attr("fill","#FFFFFF")
			.append("tspan")
			.text(function (d) {
                return (new Number(d)).toFixed(2) + "";
            })
			
			
			
		
        chart.selectAll("line.close")
            .data(data)
            .enter().append("svg:line")
            .attr("class", "close")
            .attr("x1", function (d) {
                return xScale(d.timeIndex) + 0.25 * (widthDomain) / data.length - 0.5;
            })
            .attr("y1", function (d) {
				//console.log("d.close "+d.Close +"scale  "+yScale(d.Close));
				if(d[closeFieldName]!="N/A"){
					return yScale(d[closeFieldName]);
				}else{
					$(this).select("line.close").attr('class','NA');
					return yScale(0);
				}
            })
            .attr("x2", function (d) {
                return xScale(d.timeIndex) + 0.25 * (widthDomain - (margin.left + margin.right)) / data.length + 2;
            })
            .attr("y2", function (d) {
                if(d[closeFieldName]!="N/A"){
                return yScale(d[closeFieldName]);
				}else{
					$(this).select("line.close").attr('class','NA');
					return yScale(0);
				}
            })
			.style("stroke","#2c6266")
			.attr("stroke-width",'1px');
		
        chart.selectAll("line.stem")
            .data(data)
            .enter().append("svg:line")
            .attr("class", "stem")
            .attr("x1", function (d) {
                return xScale(d.timeIndex) + 0.25 * (widthDomain - (margin.left + margin.right)) / data.length;
            })
            .attr("x2", function (d) {
                return xScale(d.timeIndex) + 0.25 * (widthDomain - (margin.left + margin.right)) / data.length;
            })
            .attr("y1", function (d) {
				if(d[highFieldName]!="N/A"){
					//chart.select("line.stem").attr('class','NA');
                return yScale(d[highFieldName]);
				}else{
					$(this).select("line.stem").attr('class','NA');
					return yScale(0);
				}
                
            })
            .attr("y2", function (d) {
				
				if(d[lowFieldName]!="N/A"){
					return yScale(d[lowFieldName]);
				}else{
					$(this).select("line.stem").attr('class','NA');
					return yScale(0);
				}
            })
			.attr("stroke",'#2c6266')
			.attr("stroke-width","1px");
		
		
        var highBandFunction = d3.svg.line()
            .x(function (d) {
                return xScale(d.timeIndex);
            })
            .y(function (d) {
                return yScale(d[highBand]);
            })
            .interpolate("linear").defined(function (d) {
                return d[highBand] != 0;
            }).defined(function (d) {
                return (d[highBand] != "N/A" && d[highBand]!=0);
            });

        var lowBandFunction = d3.svg.line()
            .x(function (d) {
                return xScale(d.timeIndex);
            })
            .y(function (d) {
                return yScale(d[lowBand]);
            })
            .interpolate("linear").defined(function (d) {
                return d[lowBand] != 0;
            })
			.defined(function (d) {
                return (d[lowBand] != "N/A" && d[lowBand]!=0);
            });
		
        var bandFunction = d3.svg.line()
            .x(function (d) {
                return xScale(d.timeIndex);
            })
            .y(function (d) {
                return yScale(d[band]);
            })
            .interpolate("linear").defined(function (d) {
                return d[band] != 0;
            })
			.defined(function (d) {
                return (d[band] != "N/A" && d[band]!=0);
            });

        var trendFunction = d3.svg.line()
            .x(function (d) {
                return xScale(d.timeIndex);
            })
            .y(function (d) {
                return yScale(d[trend]);
            })
            .interpolate("linear")
            .defined(function (d) {
                return (d[trend] != 0 && d[trend]!="N/A");
            });
		

        chart.selectAll("path.high-band")
            .data([data])
            .enter()
            .append("path")
            .attr("class", "high-band band")
            .style("stroke-dasharray", ("1, 4"))
            .attr("d", highBandFunction)
            .attr("stroke-width", 2)
            .attr("fill", "none")
			.attr("stroke-dasharray","1px, 4px")
			.attr("stroke",'#fcfcfc');

        chart.selectAll("path.low-band")
            .data([data])
            .enter()
            .append("path")
            .attr("class", "low-band band")
            .style("stroke-dasharray", ("1, 4"))
            .attr("d", lowBandFunction)
            .attr("stroke-width", 2)
            .attr("fill", "none")
			.attr("stroke-dasharray","1px, 4px")
			.attr("stroke",'#fcfcfc');
		
        chart.selectAll("path.mid-band")
            .data([data])
            .enter()
            .append("path")
            .attr("class", "band mid-band")
            .style("stroke-dasharray", ("1, 4"))
            .attr("d", bandFunction)
			.attr("stroke-width", 1)
            .attr("fill", "none")
			.attr("stroke",'#fcfcfc');

        chart.selectAll("path.trend")
            .data([data])
            .enter()
            .append("path")
            .attr("class", "trend")
            .attr("d", trendFunction)
            .attr("fill", "none")
			.attr("stroke","#e38502")
			.attr("stroke-width","1px");
		
		//append tool tip
		chart
		.append("line")
		.attr("x1",5)
		.attr("x2",5)
		.attr("y1",0)
		.attr("y2",height)
		.attr("class","drag-line")
		.style("display","none")
		.style("stroke","#282B2E")
		.style("stroke-width","2px");
		
		
	},
	drawPowerGauageChart:function(powerGauageConfiguration){
		
		var id=StockMarketChartManager.selectorContainerId;
		var textLabelDx=StockMarketChartManager.textLabelDx;
		var margin=StockMarketChartManager.margin;
		var scalableLimit=StockMarketChartManager.scalableLimit;
		
		var data=powerGauageConfiguration.data;
	//	console.log(JSON.stringify(powerGauageConfiguration));
		var powerGauageFieldName=powerGauageConfiguration.closeFieldName;
		
		var chartHeightMap=StockMarketChartManager.chartHeightMap;
		
		
		for (var i=0; i < data.length; i++) {
			var e=data[i];
			for (var k in e) {
				if (isNaN(e[k]) || e[k] == null){
					//console.log("value befor "+e[k]);
					e[k]="N/A";
					// console.log("value after "+e[k]);
				}
			}
			data[i]=e;
					
		}
		
		var width=d3.select("#"+id).style("width");
		var height=chartHeightMap.powergauage;
		
		width=parseInt(width.replace("px",""));
		
		var widthDomain=width-margin.left-margin.right;
		var heightDomain=height-margin.top-margin.bottom;
		
		var chart = d3.select("#"+id)
            .append("svg:svg")
            .attr("class", "power-gauage")
			.attr("id","power-gauage")
            .attr("width",width)
            .attr("height",height);
		
		
		var max = d3.max(data.map(function (x) {
            return x[powerGauageFieldName];
        }));

        var min = d3.min(data.map(function (x) {
            return x[powerGauageFieldName];
        }));

		if(min == 0){
			min =min - 2;
		}
		else{
			if(min<0){
				min =min* 1.3;
			}else{
				min =min * .7;
			}
		}
		if(max == 0){
			max =max +  2;
		}
		else{
			if(max>0){
				max =max* 1.3;
			}else{
				max =max * 0.7;
			}
		}
		
		var yScale = d3.scale.linear()
		.domain([min,max])
		.range([heightDomain-margin.bottom, margin.top]);
		
		var rectwidth = (widthDomain/(data.length))*.5;
		
		var xScale = d3.scale.linear()
            .domain([0,data.length-1])
			.range([(margin.left+(rectwidth*.5)), (widthDomain-margin.left-(rectwidth*.5))]);
			
			
		var yAxis = d3.svg.axis()
								.scale(yScale)
								.orient("left")
								.ticks(8);
		
		chart.append("g")
						.attr('id','yAxis')
						.attr("class", "y axis")
						.attr('fill',"none")
						.attr("transform", "translate("+(widthDomain-margin.right+textLabelDx)+"," + 0 + ")")
						.call(yAxis)
						.selectAll('text')
						.attr("text-anchor", "end")
			            .style("font-size","12px")
						.attr("fill","#FFFFFF")
						.text(function(d){return d.toFixed(2)});	
	
		StockMarketChartManager.xScaleHistoricChart=xScale;	
		
		

        chart.selectAll("rect.rel-strength")
            .data(data)
            .enter()
            .append("svg:rect")
            .attr("class", "rel-strength")
            .attr("x", function (d,i) {
                return (xScale(i)-(rectwidth*.5));
            })
            .attr("y", function (d,i) {
				if(d[powerGauageFieldName]!="N/A")
				{
					return yScale(d[powerGauageFieldName]);
				}else{ return yScale(min);}})
            .attr("width", rectwidth)
            .attr("height",function(d,i){if(d[powerGauageFieldName]!="N/A"){return yScale(min)-yScale(d[powerGauageFieldName])}else{return 0} })
            .attr("fill",function(d,i){
				if(i==0){
					return "#2C6266";
				}else{
					if(data[i][powerGauageFieldName]>=data[i-1][powerGauageFieldName]){
						return "#2C6266";
					}else{
						return "#9C9C9C";
					}					
				}
			});

		//append tool tip
		chart
		.append("line")
		.attr("x1",5)
		.attr("x2",5)
		.attr("y1",0)
		.attr("y2",height)
		.attr("class","drag-line")
		.style("display","none")
		.style("stroke","#282B2E")
		.style("stroke-width","2px");
		
	},
	drawTimeScale:function(dateArray){
	
		var xScale=StockMarketChartManager.xScaleHistoricChart;	
		var id=StockMarketChartManager.selectorContainerId;
		var margin=StockMarketChartManager.margin;
		
		var width=d3.select("#"+id).style("width");
		var height=30;
		
		width=parseInt(width.replace("px",""));
		
		var widthDomain=width-margin.left-margin.right;
		var heightDomain=20;
		
		var shown = {};
		var ticks=[];
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		
		var tickArray={};
		$(dateArray).each(function (i, d) {
			var date = new Date(d);
			if (shown[date.getMonth() + "-" + date.getYear()] == undefined
				&& date.getDate() < 15) {
				ticks.push(d);
				tickArray[d]=i;
				shown[date.getMonth() + "-" + date.getYear()] = true;
			}
         });
		
		
		for(var key in tickArray){
			console.log("keys    "+key +" value "+tickArray[key]);
		}
		var initialDate=new Date(ticks[0]);
		var counter=0;
		

		var svgSelection=d3.select("#"+id)
							.append("svg:svg")
							.attr("class", "time-axis")
							.attr("id","time-axis")
							.attr("width",width)
							.attr("height",height);
	
			
		var tickGrouping=svgSelection.selectAll("div.tick")
		.data(ticks)
		.enter()
		.append("g")
		.attr("class", "tick")
		.attr("transform",function(d){
			console.log("xScale  "+xScale(tickArray[d]));
			var left= xScale(tickArray[d]);		
			return "translate("+left+"," + (margin.top) + ")";
		});
		
		tickGrouping
		.append("text")
		.style("color","#FFFFFF")
		.style("font-size","12px")
		.attr("fill","#FFFFFF")
		.text(function (d, i) {
			var date = new Date(d);

			if(i==0){
				// console.error("'" + (initialDate.getFullYear() + "").substr(2,3));
				return "'" + (initialDate.getFullYear() + "").substr(2,3);
			}

			return months[date.getMonth()];
		});
		/*
		.attr("x",function(d){
			console.log("xScale  "+xScale(tickArray[d]));
			return xScale(tickArray[d]);
		});
		
		.style("left", function (d) {
			return Math.round(xScale(d)) - 30 + "px";
		});
		*/
		
		//append tool tip
		svgSelection
		.append("line")
		.attr("x1",5)
		.attr("x2",5)
		.attr("y1",0)
		.attr("y2",height)
		.attr("class","drag-line")
		.style("display","none")
		.style("stroke","#282B2E")
		.style("stroke-width","2px");
	},
	appendToolTip:function(){
		var tootTipTemplate ='<div id="tooltipChart-stock-market" style="z-index:99999;float:none;display:none; box-shadow:2px 2px 2px #5d5d5d; margin:0px; padding:0px; position:absolute; width:150px;">'+
				'<div id="textContainer" style="width:150px;  background-color: #0D0D0D; font-family:calibri; float:left; font-size:11px; padding:10px; opacity: 0.7;color: #ffffff !important;">'+
				'	<div class="xVal" style="text-align:center; font-size:13px; background-color: #313538; margin-top:-10px; margin-left:-10px;  margin-right:-10px; padding:5px 10px;">14 jan</div>'+
					'<div id="y-label" class="y-label label1" style="width:60%;display:none; float:left; text-align:left; padding:3px 0;">Auto Loans</div>'+
					'<div  class="yVal label1" style="width:40%; float:right;display:none; text-align:right;  padding:3px 0;">$ 400</div>'+
			'		<div class="y-label label2" style="width:60%; float:left;display:none; text-align:left; padding:3px 0;">Auto Loans</div>'+
			'		<div class="yVal label2" style="width:40%;display:none; float:right; text-align:right;  padding:3px 0;">$ 400</div>'+
			'		<div class="y-label label3" style="width:60%; float:left; text-align:left; padding:3px 0;">Auto Loans</div>'+
			
			'		<div class="yVal label3" style="width:40%; float:right; text-align:right;  padding:3px 0;">$ 400</div>'+
			'		<div class="y-label label4" style="width:60%; float:left; text-align:left; padding:3px 0;">Auto Loans</div>'+
			
			'		<div class="yVal label4" style="width:40%; float:right; text-align:right;  padding:3px 0;">$ 400</div>'+
			'		<div class="y-label label5" style="width:60%; float:left; text-align:left; padding:3px 0;">Auto Loans</div>'+
			
			'		<div class="yVal label5" style="width:40%; float:right; text-align:right;  padding:3px 0;">$ 400</div>'+
			'	</div>'+
			//'	<div id="handIcon" style="position: relative; bottom:1px; height:40px; width:36px; '+
			//'	 background:url(http://www.stocinn.com/stoccharts/img/toolTips-arrow.png) no-repeat; clear:both; float:right; margin-bottom:-2px; right:-27px;">'+
			//'	 </div>'+
			'</div>';
		
		var id=StockMarketChartManager.selectorContainerId;	
		$('body').append(tootTipTemplate);
				
	},
	showToolTip: function (e, yValArg, xValArg, hideXVal, yHeadingMap) {

		var x = e.pageX;
		
		var y; 
		
		y=e.pageY;
		


		var yVal;
		yVal = yValArg;


		var timeVal;

		timeVal = xValArg;
		$('#tooltipChart-stock-market').find('.xVal').html("");
		
		$('#tooltipChart-stock-market').find('.xVal').html(timeVal);
		 
		//blank yLabel	
		$('#tooltipChart-stock-market').find('.y-label').html("");
		
		//blank yVal
		$('#tooltipChart-stock-market').find('.yVal').html("");
		
		//hide all  yLabel and yVal
		$('#tooltipChart-stock-market').find('.yVal').hide();
		$('#tooltipChart-stock-market').find('.y-label').hide();
		
		var toolTipRef=$('#tooltipChart-stock-market');
		//get YHeadingNames width Values and iterate to update yLabel and YVal 
		for(var i=0;i<yHeadingMap.length;i++){
			var headingObj=yHeadingMap[i];
			var counter=i+1;
			var yLabelClass=".y-label.label"+counter;
			var yValClass=".yVal.label"+counter;
			$(toolTipRef).find(yLabelClass).html(headingObj.headingName);
			$(toolTipRef).find(yValClass).html(headingObj.headingVal);
			
			$(toolTipRef).find(yValClass).show();
			$(toolTipRef).find(yLabelClass).show();
		}
		
		
		var marginLeft = x;
		if ($(".ps-scrollbar-x-rail")) {
			try {
				marginLeft += parseInt($(".ps-scrollbar-x-rail").css('left').replace("px", ''));
			} catch (err) {

			}
		}

		var tooTipElem = $('body').find("#tooltipChart-stock-market");
		var toolTipTextContainer = $(tooTipElem).find("#textContainer");
		
		var divContainer = StockMarketChartManager.selectorContainerId
		
		var divWidth =  parseInt(d3.select("#"+divContainer).style("width"));
		
		var marginTop = y - ($("body").find("#tooltipChart-stock-market").height()*0.9);
//		marginLeft=marginLeft-($("body").find("#tooltipChart-stock-market").width()*.5);
		
		if(marginLeft<(divWidth*.5)){
			$('body').find("#tooltipChart-stock-market").css("left", marginLeft);
		//	marginLeft=marginLeft*0.+$(tooTipElem).width();
			
		//	$(tooTipElem).find("#handIcon").css("right","94px");
		}else{
			marginLeft = marginLeft - 150;
			$('body').find("#tooltipChart-stock-market").css("left", marginLeft);
			//$(tooTipElem).find("#handIcon").css("right","-14px");
		}
		
	//	console.log("page y "+marginTop +"y "+y);
		
		$('body').find("#tooltipChart-stock-market").css("left", marginLeft);
		
		//keep margintop fixed for stock market chart
		var id=StockMarketChartManager.selectorContainerId;	
		
		var heightOfContainer=parseInt(d3.select("#"+id).style("height").replace("px",""));
		
		$('body').find("#tooltipChart-stock-market").css("top",heightOfContainer/2);
		//console.log("sss");
		$('body').find("#tooltipChart-stock-market").show();

	},
	hideToolTip: function () {
			$('#tooltipChart-stock-market').find('.yVal').html("");
			d3.select("#tooltipChart-stock-market").style('display', 'none');
	}
}

	function getMinRange(data) {
		//return Math.min(Math.min(getMinFromArray(data, "Trend"), getMinFromArray(data, "LowBand")), getMinFromArray(data, "Low"));
        return Math.min(Math.min(getMinFromArray(data, "Trend"), getMinFromArray(data, "LowBand")), getMinFromArray(data, "Low"),getMinFromArray(data, "Close"));
    }

    function getMaxRange(data) {
        //return Math.max(Math.max(getMaxFromArray(data, "Trend"), getMaxFromArray(data, "HighBand")), getMaxFromArray(data, "High"));
		return Math.max(Math.max(getMaxFromArray(data, "Trend"), getMaxFromArray(data, "HighBand")), getMaxFromArray(data, "High"),getMaxFromArray(data, "Close"));
    }

    function getMinFromArray(array, field) {
        var min = Number.MAX_VALUE;

       /* angular.forEach(array, function (d) {
            if (d[field] < min && d[field] != 0)
                min = d[field];
        });*/
		
		for(var i = 0 ; i< array.length ; i++)
		{
			if (array[i][field] < min && array[i][field] != 0)
                min = array[i][field];
		}

        /*if (min == Number.MAX_VALUE)
            return undefined;*/

        return min;
    }

    function getMaxFromArray(array, field) {
        var max = -Number.MAX_VALUE;

      /*  angular.forEach(array, function (d) {
            if (d[field] > max && d[field] != 0)
                max = d[field];
        });*/
		
		for(var i = 0 ; i< array.length ; i++)
		{
			if (array[i][field] > max && array[i][field] != 0)
                max = array[i][field];
		}


        if (max == Number.MIN_VALUE)
            return undefined;

        return max;
    }
	
	