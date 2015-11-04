StockMarketChartManager={
	initialYValue:'',
	initialTimeIndex:'',
	lastTimeIndex:'',
	showToolTipStatus:true,
	xScaleHistoricChart:'',
	cmfColorArray:[],
	hlcColorArray:[],
	powerGauageColorArray:[],
	data:'',
	ticksColor:'',
	cmfConfigurations:'',
	lineChartConfiguration:'',
	hlcChartYScale:'',
	powerGauageChartConfiguration:'',
	selectorContainerId:'',
	chartHeightMap:{},
	margin:{top:10,left:70,right:0,bottom:10},
	scalableLimit:2,
	areaSubsetArray:[],
	fontFamily : "arial",
	area:'',
	textLabelDx:50,
	dateArray:[],
	chartStyleMap:{"hlcChart":"block","cmfChart":"block","powerGaugeChart":"none"},
	
	drawStockMarketCharts:function(id,cmfConfigurations,lineChartConfiguration,powerGauageChartConfiguration,dateArray,cmfColorArray,hlcColorArray,powerGauageColorArray,ticksColor){
		
		HistoricalDataChart.startDate = dateArray[0];
		HistoricalDataChart.endDate = dateArray[dateArray.length-1];
		HistoricalDataChart.updateMinMaxDateOfCalender();
		
		StockMarketChartManager.selectorContainerId=id;
		
		//d3.select("#"+id).style("background","#3A5568");
		
		StockMarketChartManager.emptyCharts();
		StockMarketChartManager.getHeightOfEachChart();
		StockMarketChartManager.cmfColorArray = cmfColorArray;
		StockMarketChartManager.powerGauageColorArray = powerGauageColorArray;
		StockMarketChartManager.hlcColorArray = hlcColorArray;
		StockMarketChartManager.ticksColor=ticksColor;
		
		StockMarketChartManager.cmfConfigurations=cmfConfigurations;
		StockMarketChartManager.lineChartConfiguration=lineChartConfiguration;
		StockMarketChartManager.powerGauageChartConfiguration=powerGauageChartConfiguration;
		
		StockMarketChartManager.dateArray=dateArray;
		
		StockMarketChartManager.drawHLCChart(lineChartConfiguration,hlcColorArray);
		StockMarketChartManager.drawCmfChart(cmfConfigurations,cmfColorArray);
		//	StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration,powerGauageColorArray);
		StockMarketChartManager.drawTimeScale(dateArray);
		StockMarketChartManager.attachHoveringEffect();
		StockMarketChartManager.listenWindowResize();	
		StockMarketChartManager.appendToolTip();	
		
		//	StockMarketChartManager.showLiveDataLine(44,"green");
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
			var event = d3.event; 
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
			var event = d3.event; 
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
			//alert(d3.event   + "window  ");
			var event = d3.event; 
			var xScale=StockMarketChartManager.xScaleHistoricChart;	
			var marginLeft=margin.left-margin.left*0.08;
			//	if(evt.offsetX === undefined)
			//			evt.originalEvent.layerX : evt.offsetX);
			//	var event
			
			var pageX=event.pageX-$("#"+containerId).offset().left;
			var lineXPos=Math.round(xScale.invert(pageX));
			
			if(lineXPos<0 || lineXPos>=(dateArray.length-1)){
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
				
				var yHeadingValueMap=[//{"headingName":hlcCloseFieldName,"headingVal":hlcClose},
					{"headingName":hlcHighFieldName,"headingVal":hlcHigh},
					{"headingName":hlcLowFieldName,"headingVal":hlcLow},
					{"headingName":cmfFieldName,"headingVal":cmfValue}
					//{"headingName":powerGaugeFieldName,"headingVal":powerGaugeVal}
						
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
				var hlcColorArray = StockMarketChartManager.hlcColorArray;
				var powerGauageColorArray = StockMarketChartManager.powerGauageColorArray;
				var cmfColorArray = StockMarketChartManager.cmfColorArray;
				
				
				StockMarketChartManager.getHeightOfEachChart();
				//var data=StockMarketChartManager.data;
				if(isShowHlC == "block"){
					StockMarketChartManager.drawHLCChart(lineChartConfiguration,hlcColorArray);
				}
				
				if(isShowCMF == "block"){
					StockMarketChartManager.drawCmfChart(cmfConfigurations,cmfColorArray);
				}
				
				if(isShowPowerGauage == "block"){
					//	StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration,powerGauageColorArray);
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
				StockMarketChartManager.drawStockMarketCharts(id,cmfConfigurations,lineChartConfiguration,powerGauageChartConfiguration,dateArray,StockMarketChartManager.cmfColorArray,StockMarketChartManager.hlcColorArray,StockMarketChartManager.powerGauageColorArray,StockMarketChartManager.ticksColor);
			},
			hideChart:function(chartName,display){
				var id=StockMarketChartManager.selectorContainerId;
				//d3.select("#"+id).select("."+chartName).style("display",'none');
				
				var cmfConfigurations=StockMarketChartManager.cmfConfigurations;
				var lineChartConfiguration=StockMarketChartManager.lineChartConfiguration;
				var powerGauageChartConfiguration=StockMarketChartManager.powerGauageChartConfiguration;
				var hlcColorArray = StockMarketChartManager.hlcColorArray;
				var powerGauageColorArray = StockMarketChartManager.powerGauageColorArray;
				var cmfColorArray = StockMarketChartManager.cmfColorArray;
				
				
				StockMarketChartManager.emptyCharts();
				
				StockMarketChartManager.chartStyleMap[chartName]=display;
				
				var isShowHlC=StockMarketChartManager.chartStyleMap["hlcChart"];
				var isShowCMF=StockMarketChartManager.chartStyleMap["cmfChart"];
				var isShowPowerGauage=StockMarketChartManager.chartStyleMap["powerGaugeChart"];
				
				StockMarketChartManager.getHeightOfEachChart();
				//var data=StockMarketChartManager.data;
				if(isShowHlC == "block"){
					StockMarketChartManager.drawHLCChart(lineChartConfiguration,hlcColorArray);
				}
				
				if(isShowCMF == "block"){
					StockMarketChartManager.drawCmfChart(cmfConfigurations,cmfColorArray);
				}
				
				if(isShowPowerGauage == "block"){
					//	StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration,powerGauageColorArray);
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
				var powerGauageColorArray = StockMarketChartManager.powerGauageColorArray;
				var cmfColorArray = StockMarketChartManager.cmfColorArray;
				var hlcColorArray=StockMarketChartManager.hlcColorArray;
				
				StockMarketChartManager.emptyCharts();
				
				StockMarketChartManager.getHeightOfEachChart();
				//var data=StockMarketChartManager.data;
				if(isShowHlC == "block"){
					StockMarketChartManager.drawHLCChart(lineChartConfiguration,hlcColorArray);
				}
				
				if(isShowCMF == "block"){
					StockMarketChartManager.drawCmfChart(cmfConfigurations,cmfColorArray);
				}
				
				if(isShowPowerGauage == "block"){
					//	StockMarketChartManager.drawPowerGauageChart(powerGauageChartConfiguration,powerGauageColorArray);
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
			getTickArray: function (minVal, maxVal, noOfTicksRequired) {
                var tickArray = [];
                var factor = Math.round((maxVal - minVal) / (noOfTicksRequired - 1));
                var curval = minVal;
                tickArray.push(curval);
                noOfTicksRequired--;
                for (var i = 1; i < noOfTicksRequired; i++) {
                    curval += factor;
                    tickArray.push(curval);
                    if (i == noOfTicksRequired - 1) tickArray.push(maxVal);
				}
                return tickArray;
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
			drawCmfChart:function(cmfChartConfigration,cmfColorArray){	
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
				.range([margin.left, (widthDomain-10)]);	
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
				.attr("x", widthDomain - margin.right+textLabelDx+10)
				.attr("y", yScale(midPoint))
				.attr("dy", 0)
				.attr("dx","-1.2em")
				.attr("text-anchor", "end")
				.style("font-family",StockMarketChartManager.fontFamily)
				.text(parseFloat(midPoint).toFixed(2))
				.attr("fill",StockMarketChartManager.ticksColor);
				
				
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
								//						console.log("0 "+yScale(midPoint));
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
								return cmfColorArray[0];
								}else{
								return cmfColorArray[1];
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
			drawHLCChart:function(lineChartConfiguration,hlcColorArray)
			{
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
				
				var totalPathLengthJSON = {};	
				
				var chart = d3.select("#"+id)
				.append("svg:svg")
				.attr("class", "hlcChart")
				.attr("id","hlcChart")
				.attr("width",width)
				.attr("height",height);
				
				
				
				
				var xScale = d3.scale.linear()
				.domain([0,data.length-1])
				.range([margin.left, (widthDomain-10)]);
				
				//.range([margin.left, (widthDomain)*scalableLimit]);
				
				StockMarketChartManager.xScaleHistoricChart=xScale;	
				
				
				var rightMax = getMaxFromArray(data, "S&P 500");
				var rightMin = getMinFromArray(data, "S&P 500");
				
				rightMax = rightMax*1.1;
				rightMin = rightMin*0.9;
				
				var rightYScale = d3.scale.linear()
				.domain([rightMin,rightMax])
				.range([heightDomain-margin.bottom, margin.top]);	
				
				var textLabelDx=StockMarketChartManager.textLabelDx;
				var rightYAxis = d3.svg.axis()
				.scale(rightYScale)
				.orient("left")
				.tickValues(StockMarketChartManager.getTickArray(rightMin,rightMax,10));
				
				chart.append("g")
				.attr('id','yAxis')
				.attr("class", "yAxis")
				.attr('fill',"none")
				.attr("transform", "translate("+( widthDomain - margin.right + textLabelDx+10)+"," + 0 + ")")
				.call(rightYAxis)
				.selectAll('text')
				.style("font-family",StockMarketChartManager.fontFamily)
				.style("font-size","11px")
				.attr("fill",hlcColorArray[1])
				.text(function (d) {
					return (new Number(d)).toFixed(2) + "";
				})	
				
				/*	
					
					chart.selectAll("text.yrule1")
					.data(rightYScale)
					.enter().append("svg:text")
					.attr("class", "yrule1")
					.attr("x", widthDomain - margin.right + textLabelDx)
					.attr("y", rightYScale)
					.attr("dy", 0)
					.attr("dx", 0)
					.attr("text-anchor", "end")
					.style("font-family","calibri")
					.style("font-size","12px")
					.attr("fill",hlcColorArray[1])
					.append("tspan")
					.text(function (d) {
					return (new Number(d)).toFixed(2) + "";
					})	
					
				*/
				
				var lowBandPath = d3.svg.line()
				.x(function(d,i) {return xScale(i); })
				.y(function(d,i) {return rightYScale(d[lowBand]); })
				.interpolate("cardinal").defined(function (d) {
					return d[lowBand] != 0;
				})
				.defined(function (d) {
					return (d[lowBand] != "N/A" && d[lowBand]!=0);
				});;
				
				var lowBandPathRef = chart.append("path")
				.data([data])
				.attr("class", "path1")
				.attr("d", lowBandPath)
				.attr("stroke",hlcColorArray[1])
				.attr("stroke-width", 2)
				.attr("value","show")
				.attr("fill", "none");		
				showPathTransition(lowBandPathRef,"path1");						
				
				
				
				
				var max = getMaxFromArray(data, "DJIA");
				var min = getMinFromArray(data, "DJIA");
				//		alert(min);
				max = max*1.05;
				min = min*0.95;
				//		alert(min);
				var yScale = d3.scale.linear()
				.domain([min,max])
				.range([heightDomain-margin.bottom, margin.top]);
				
				StockMarketChartManager.hlcChartYScale = yScale;
				
				var leftYAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.tickValues(StockMarketChartManager.getTickArray(min,max,10));
				
				chart.append("g")
				.attr('id','leftYAxis')
				.attr("class", "leftYAxis")
				.attr('fill',"none")
				.attr("transform", "translate("+(margin.left)+"," + 0 + ")")
				.call(leftYAxis)
				.selectAll('text')
				.style("font-family",StockMarketChartManager.fontFamily)
				.style("font-size","11px")
				.attr("fill",hlcColorArray[0])
				.text(function (d) {
					return (new Number(d)).toFixed(2) + "";
				})	
				
				
				/*chart.selectAll("text.yrule")
					.data(yScale.ticks(10))
					.enter().append("svg:text")
					.attr("class", "yrule")
					.attr("x", margin.left-5)
					.attr("y", yScale)
					.attr("dy", 0)
					.attr("dx", 0)
					.attr("text-anchor", "end")
					.style("font-family","calibri")
					.style("font-size","12px")
					.attr("fill",hlcColorArray[0])
					.append("tspan")
					.text(function (d) {
					return (new Number(d)).toFixed(2) + "";
					})
					
				*/	
				
				var highBandPath = d3.svg.line()
				.x(function(d,i) {return xScale(i); })
				.y(function(d,i) {return yScale(d[highBand]); })
				.interpolate("cardinal").defined(function (d) {
					return d[highBand] != 0;
					}).defined(function (d) {
					return (d[highBand] != "N/A" && d[highBand]!=0);
				});
				
				var highBandPathRef = chart.append("path")
				.data([data])
				.attr("class", "path0")
				.attr("d", highBandPath)
				.attr("stroke",hlcColorArray[0])
				.attr("stroke-width", 2)
				.attr("value","show")
				.attr("fill", "none");		
				showPathTransition(highBandPathRef,"path0");					
				
				
				
				
				var yPositionOfLegend = 10;
				var legendSize = 30;
				var legentHeight = 10;
				var legendNameArray = [highBand,lowBand];
				var legendColor = ["#00ff7e","orange"];
				var legendPositionArray = StockMarketChartManager.showHorizontalLegend(width,yPositionOfLegend,legendNameArray,legendSize);
				
				var legendRef = chart.selectAll('.rect')
				.data(legendPositionArray)
				.enter()
				.append('rect')
				.attr('width',legendSize)
				.attr('height',legentHeight)
				.attr("value",function(d,i){return i})
				.attr('x',function(d,i){ return legendPositionArray[i].x;})
				.attr('y',function(d,i){return legendPositionArray[i].y;})
				.attr("rx",4)
				.attr("ry",4)
				.attr('fill',function(d,i){return hlcColorArray[i]})
				.on("click",function(){
					var val = d3.select(this).attr("value");
					if(d3.select(".path"+val).attr("value") == "hide")
					{
						d3.select(".path"+val).attr("value","show");
						var selectedPath = d3.select(".path"+val);
						selectedPath.transition()
						.duration(1500)
						.ease("linear")
						.attr("stroke-dashoffset", 0);	
						d3.select(".text"+val).style("text-decoration", "none");		
					}
					else
					{
						d3.select(".path"+val).attr("value","hide");
						var selectedPath = d3.select(".path"+val);
						selectedPath.transition()
						.duration(1500)
						.ease("linear")
						.attr("stroke-dashoffset", totalPathLengthJSON["path"+val]);
						d3.select(".text"+val).style("text-decoration", "line-through");
						
					}
					
					
					
					
					
				});
				
				chart.selectAll('.text')
				.data(legendPositionArray)
				.enter()
				.append('text')
				.attr("class",function(d,i){return "text"+i})
				.attr('x',function(d,i){return legendPositionArray[i].textXPos;})
				.attr('y',function(d,i){return legendPositionArray[i].y + legentHeight;})
				.style("font-family",StockMarketChartManager.fontFamily)
				.style("fill",StockMarketChartManager.ticksColor)
				.text(function(d,i){return legendNameArray[i];}); 				
				
				/*      chart.selectAll("line.close")
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
					.style("stroke","#19A319")
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
					.attr("stroke",'#19A319')
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
				*/
				function showPathTransition(pathRef,key)
				{
					pathTotalLength = pathRef.node().getTotalLength();
					totalPathLengthJSON[key] = pathTotalLength;
					
					pathRef.attr("stroke-dasharray", function (d) {
						
						
						return pathTotalLength + "," + pathTotalLength;
					})
					.attr("stroke-dashoffset", pathTotalLength)
					.transition()
					.duration(2000)
					.ease("linear")
					.attr("stroke-dashoffset", 0);
				}
				
				function showDashedPathTransition(pathRef,key)
				{
					var pathTotalLength = pathRef.node().getTotalLength();
					totalPathLengthJSON[key] = pathTotalLength;
					
					pathRef.attr("stroke-dasharray", function (d) {
						var dashLen = 3;
						var ddLen = dashLen * 2;
						var darray = dashLen;
						while (ddLen < pathTotalLength) {
							darray += "," + dashLen + "," + dashLen;
							ddLen += dashLen * 2;
						}
						
						return darray + "," + pathTotalLength;
					})
					.attr("stroke-dashoffset", pathTotalLength)
					.transition()
					.duration(2000)
					.ease("linear")
					.attr("stroke-dashoffset", 0);
				}
				
				//append tool tip
				chart
				.append("line")
				.attr("x1",5)
				.attr("x2",5)
				.attr("y1",30)
				.attr("y2",height)
				.attr("class","drag-line")
				.style("display","none")
				.style("stroke","#282B2E")
				.style("stroke-width","2px");
				
				
				
			},
			drawPowerGauageChart:function(powerGauageConfiguration,powerGauageColorArray){
				
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
				
				var rectwidth = (widthDomain/(data.length))*.9;
				
				var xScale = d3.scale.linear()
				.domain([0,data.length-1])
				.range([(margin.left+(rectwidth*.5)), (widthDomain-margin.left-(rectwidth*.5)-10)]);
				
				var rectangleGradient = chart.append("svg:defs")
				.append("svg:linearGradient")
				.attr("id", "rectangleGradient")
				.attr("x1", "0")
				.attr("y1", "0")
				.attr("x2", "100%")
				.attr("y2", "100%")
				.attr("spreadMethod", "pad")
				.attr("gradientTransform","rotate(0)");
				
				rectangleGradient.append("stop")
				.attr("offset", "0")
				.attr("stop-color", function(){return ColorLuminance(powerGauageColorArray[0], -0.5)});
				rectangleGradient
				.append("stop")
				.attr("offset", "1")
				.attr("stop-color",function(){return ColorLuminance(powerGauageColorArray[0], 0.5)});	
				
				/*		var rectangleGradient2 = chart.append("svg:defs")
					.append("svg:linearGradient")
					.attr("id", "rectangleGradient2")
					.attr("x1", "0")
					.attr("y1", "0")
					.attr("x2", "100%")
					.attr("y2", "100%")
					.attr("spreadMethod", "pad")
					.attr("gradientTransform","rotate(0)");
					
					rectangleGradient2.append("stop")
					.attr("offset", "0")
					.attr("stop-color", function(){return ColorLuminance(legendArrayColor[0], -0.5)});
					rectangleGradient2
					.append("stop")
					.attr("offset", "1")
					.attr("stop-color",function(){return ColorLuminance(legendArrayColor[0], 0.5)});	
					
				*/	
				
				// legend here
				
				/*		var startPositionOfPolygon = 10;
					var legrndRef = chart.selectAll(".polygon")
					.data(legendArrayColor)
					.enter()
					.append('polygon')
					.attr("class","legend")
					.style('fill',function(d,i){return legendArrayColor[i]})
					.attr('points',function(d,i)
					{
					var x = 50;
					var y  = startPositionOfPolygon;
					if(i==0)
					{
					return ''+(x)+','+(y)+','+(x-9)+','+(y+9)+','+(x+9)+','+(y+9)+''
					}
					else
					{
					x = 70
					return ''+(x)+','+(y+9)+','+(x-9)+','+(y)+','+(x+9)+','+(y)+''
					}
					});
					
				*/		
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
				.style("font-size","11px")
				.attr("fill",StockMarketChartManager.ticksColor)
				.text(function(d){return d.toFixed(2)});	
				
				//		StockMarketChartManager.xScaleHistoricChart=xScale;	
				
				
				
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
					.style("fill",function(d,i){
						return "url(#rectangleGradient)";
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
					
					function ColorLuminance(hex, lum) {
						
						// validate hex string
						hex = String(hex).replace(/[^0-9a-f]/gi, '');
						if (hex.length < 6) {
							hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
						}
						lum = lum || 0;
						
						// convert to decimal and change luminosity
						var rgb = "#", c, i;
						for (i = 0; i < 3; i++) {
							c = parseInt(hex.substr(i*2,2), 16);
							c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
							rgb += ("00"+c).substr(c.length);
						}
						
						return rgb;
					}
					
			},
			parseDate : function(input, format) {
				format = format || 'yyyy-mm-dd'; // default format
				var parts = input.match(/(\d+)/g), 
				i = 0, fmt = {};
				// extract date-part indexes from the format
				format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });
				
				return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
			},
			drawTimeScale:function(dateArray){
				
				//	var xScale=StockMarketChartManager.xScaleHistoricChart;	
				var id=StockMarketChartManager.selectorContainerId;
				var margin=StockMarketChartManager.margin;
				
				
				
				var width=d3.select("#"+id).style("width");
				var height=30;
				
				width=parseInt(width.replace("px",""));
				
				var widthDomain=width-margin.left-margin.right;
				var heightDomain=20;
				var xScale = d3.scale.linear()
				.domain([0,dateArray.length-1])
				.range([margin.left, (widthDomain-10)]);
				StockMarketChartManager.xScaleHistoricChart=xScale;		
				/*	
					var shown = {};
					var ticks=[];
					var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					
					var tickArray={};
					$(dateArray).each(function (i, d) {
					//var date = new StockMarketChartManager.parseDate(d,"yyyy/mm/dd");
					var date =  new Date(d.replace(/-/g, "/"));
					//console.log(date +"  " + new Date(d) + " " + date.getMonth() + "-" + date.getYear());
					if (shown[date.getMonth() + "-" + date.getYear()] == undefined
					&& date.getDate() < 15) {
					//alert(d);
					ticks.push(d);
					tickArray[d]=i;
					shown[date.getMonth() + "-" + date.getYear()] = true;
					}
					});
					
					
					for(var key in tickArray){
					//			console.log("keys    "+key +" value "+tickArray[key]);
					}
					var initialDate=new Date(ticks[0].replace(/-/g, "/"));
					var counter=0;
				*/
				
				var svgSelection=d3.select("#"+id)
				.append("svg:svg")
				.attr("class", "time-axis")
				.attr("id","time-axis")
				.attr("width",width)
				.attr("height",height);
				
				
				var tickGrouping=svgSelection
				.append("g")
				.attr("class", "tick")
				.attr("transform",function(d){
					//   console.log("xScale  "+xScale(tickArray[d]));
					
					return "translate("+(margin.left-45)+"," + (margin.top) + ")";
				});
				
				
				var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.tickValues(StockMarketChartManager.getXTickArray(0,(dateArray.length),10, (widthDomain)));
				
				var xAxisTextRef = tickGrouping.append("g")
				.attr('id','xAxis')
				.attr("class", "x axis")
				.attr('fill',"none")
				.attr("transform", "translate("+0+"," + 0 + ")")
				.call(xAxis);
				xAxisTextRef.selectAll('text')
				.text(function(d){return dateArray[d];})
				.style("font-size","11px")
				.style("font-family",StockMarketChartManager.fontFamily)
				.attr("fill",StockMarketChartManager.ticksColor);
				
				/*
					var tickGrouping=svgSelection.selectAll("div.tick")
					.data(ticks)
					.enter()
					.append("g")
					.attr("class", "tick")
					.attr("transform",function(d){
					//alert(xScale(tickArray[d]));
					//console.log("xScale  "+xScale(tickArray[d]));
					var left= xScale(tickArray[d]);		
					return "translate("+left+"," + (margin.top) + ")";
					});
					
					//alert("ticks texting");
					tickGrouping
					.append("text")
					.style("font-size","11px")
					.style("font-family",StockMarketChartManager.fontFamily)
					.attr("fill",StockMarketChartManager.ticksColor)
					.text(function (d, i) {
					var date = new Date(d.replace(/-/g, "/"));
					//	alert("'" + (initialDate.getFullYear() + "").substr(2,3));
					if(i==0){
					
					return "'" + (initialDate.getFullYear() + "").substr(2,3);
					}
					//alert("'" + (initialDate.getFullYear() + "").substr(2,3));
					return months[date.getMonth()];
					});
				*/
				//alert("ticks texting DONE");
				
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
			getXTickArray: function (minVal, maxVal, maxCharacterLength, svgWidth) {
                var tickArray = [];
                var maxTickWidth = 2*4.5*maxCharacterLength;
                var totalTicks = Math.round(svgWidth / maxTickWidth);
				
                var curval = minVal;
                tickArray.push(curval);
                var factor = (maxVal - minVal) / totalTicks;
				
                while (curval < maxVal) {
					//alert(curval+"::"+maxVal+"::"+factor);
                    curval = Math.floor(curval + factor);
                    if (tickArray.indexOf(curval) == -1 && curval <= maxVal) 
					tickArray.push(curval);
					else
					curval++;
					
				}
				
                return tickArray;
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
			},
			showLiveDataLine : function(value,color) {
				
				d3.selectAll(".liveDataLine").remove();	
				var margin=StockMarketChartManager.margin;
				var width=d3.select("#chartArea").style("width");
				width=parseInt(width.replace("px",""));
				var yScale = StockMarketChartManager.hlcChartYScale;	
				var lineWidth = width-margin.right-35;
				var y = yScale(value);
				xCoord = [lineWidth,lineWidth+10,lineWidth+50,lineWidth+50,lineWidth+10];
				YCoord = [y,y-12,y-12,y+12,y+12,y];
				
				var path = d3.svg.line()
				.x(function(d,i) { return xCoord[i]; })
				.y(function(d,i) {return YCoord[i]; })
				
				d3.select("#hlcChart").append("path")
				.data([xCoord])
				.attr("class", "liveDataLine")
				.attr("d", path)
				.attr("stroke","black")
				.attr("stroke-width", 1)
				.attr("fill", color)
				//	.attr("opacity",0.6);
				
				d3.select("#hlcChart").append("text")
				.attr("class","liveDataLine")			  
				.attr("x",lineWidth+12)
				.attr("y",y+5)
				.attr("fill","white")
				.style("font-size","11px","important")
				.text(value.toFixed(2));
				
				d3.select("#hlcChart").append("line")
				.attr("class","liveDataLine")
				.attr("x1",margin.left)
				.attr("y1",yScale(value))
				.attr("x2",lineWidth)
				.attr("y2",yScale(value))
				.attr("stroke",color);
			},
			showHorizontalLegend:function(scaleWidth,yPositionOfLegend,legendArray,legendSize)
			{			
				var largestStringLngth=0;
				for(var counter =0 ;counter<legendArray.length;counter++)
				{
					if(largestStringLngth<(legendArray[counter].toString()).length)
					{
						largestStringLngth = (legendArray[counter].toString()).length;
					}
				}		
				largestStringLngth = largestStringLngth * 7.5;
				var legendPositionArray = [];
				var obj={"x":0,"y":0,"textXPos":0};
				var seprator = 5;	
				var xPositionOfLegend;
				var temp,flag = scaleWidth*.1;
				var legendRow = Math.round((scaleWidth*.9)/(seprator+legendSize+largestStringLngth));
				
				for(var counter = 0 ; counter<legendArray.length ; counter++)
				{
					var obj={};
					if(counter%legendRow == 0)
					{
						xPositionOfLegend = scaleWidth*.09;
					}
					else
					{
						xPositionOfLegend = xPositionOfLegend+seprator+legendSize+largestStringLngth;
					}
					obj.x = xPositionOfLegend+3;
					
					if(counter%legendRow == 0  && counter!=0)
					{
						yPositionOfLegend = (yPositionOfLegend)+(1.5*legendSize);
					}
					obj.y = yPositionOfLegend;
					
					obj.textXPos = xPositionOfLegend+seprator + legendSize;
					
					legendPositionArray.push(obj);
					
				}	
				return legendPositionArray;
			}, 
			/*
				treeMapChart : function (divId,treeData,colorCombination)
				{
				
				var width =parseInt(d3.select("#"+divId).style("width"));
				var height=parseInt(d3.select("#"+divId).style("height")); 
				
				var treeMapMargin={left:width*0.05,right:width*0.05,bottom:height*0.1,top:height*0.05,chartSeparator:5,xScalePaddingTop:height*0.2,yScalePaddingLeft:width*0.1};
				var scaleWidth=width-treeMapMargin.left-treeMapMargin.right;
				var scaleHeight=height-treeMapMargin.top-treeMapMargin.bottom;
				
				
				var  svgElement = d3.select("#"+divId).append("svg").attr('width',width).attr('height',height);
				
				
				var treeMainGroup = svgElement.append("g")
				.attr('class','main-group')
				.attr("transform", "translate(" +treeMapMargin.left+ "," +treeMapMargin.top+ ")")
				
				var gradientGroup = treeMainGroup.append("g")
				.attr('class','gradientGroup')
				.attr("transform", "translate(" +(scaleWidth*.1)+ "," +(scaleHeight +(10))+ ")");
				
				
				var minColorValue = d3.min(treeData.children, function (d) {
				return d.size;
				})
				var maxColorValue = d3.max(treeData.children, function (d) {
				return d.size;
				});
				
				var yScale  = d3.scale.linear()
				.domain([minColorValue,maxColorValue])
				.range([0,scaleWidth*.78]);       
				
				var colorScale = d3.scale.linear()
				.domain([minColorValue, (minColorValue + maxColorValue) / 2, maxColorValue])
				.range([colorCombination.colorLow, colorCombination.colorMed, colorCombination.colorHigh]);
				
				var treemap = d3.layout.treemap()
				.size([scaleWidth, scaleHeight])
				.sticky(true)
				.value(function(d) { return d.size; });
				
				var node = treeMainGroup.datum(treeData).selectAll(".rect")
				.data(treemap.nodes)
				.enter().append("rect")
				.attr("class", "node")
				.attr("value",function(d){return d.size;})
				.attr("x", function(d) { return d.x;})
				.attr("y", function(d) { return d.y;})
				.attr("width", 0)
				.attr("height", 0)
				.attr("fill", function(d) {
				return d.name == 'tree' ? 'none' :  colorScale(d.size); })
				.on("mousemove",function(){
				var value = parseInt(d3.select(this).attr("value"));
				d3.select(".gradientRepresentIcon").attr("display","block")
				.attr("x",yScale(value));
				
				})
				.on("mouseleave",function(){
				d3.select(".gradientRepresentIcon").attr("display","none");
				});
				
				node.transition().duration(2000)
				.attr("width", function(d) { return Math.max(0, d.dx - 1); })
				.attr("height", function(d) { return Math.max(0, d.dy - 1); })
				
				var textRef = treeMainGroup.datum(treeData).selectAll(".text")
				.data(treemap.nodes)
				.enter().append("text")
				.attr("x", function(d) { return d.x + 3;})
				.attr("y", function(d) { var ey = Math.min(16, 0.1*Math.sqrt(d.area));return d.y+(ey*2);})
				.attr("fill","white")
				.style("font-size", function(d) {
				return Math.min(16, 0.18*Math.sqrt(d.area))+'px'; })
				.text("");
				textRef.transition().delay(1500).text(function(d) { return d.children ? null : d.name; });    
				
				
				var midValue = (minColorValue+maxColorValue)/2;
				var colorValueArray = [];
				colorValueArray.push(minColorValue);
				var avg = (minColorValue+midValue)/2;
				colorValueArray.push(avg)
				colorValueArray.push(midValue);
				var avg = (maxColorValue+midValue)/2;
				colorValueArray.push(avg);
				colorValueArray.push(maxColorValue);
				
				
				var textarray = [];
				var startRange = treeData.range[0];
				var endRange = treeData.range[1];
				textarray.push("< "+startRange+"%");
				textarray.push((startRange/2)+"%");
				textarray.push((startRange+endRange)+"%");
				textarray.push((endRange/2)+"%");
				textarray.push(">"+endRange+"%"); 
				
				var rectWidth = (scaleWidth*.8)/5;
				var rectHeight = (treeMapMargin.bottom*.2);
				
				var gradient = gradientGroup.append("svg:defs")
				.append("svg:linearGradient")
				.attr("id", "gradient")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", (scaleWidth*.8))
				.attr("y2",rectHeight)
				.attr("gradientUnits", "userSpaceOnUse");
				
				gradient.append("svg:stop")
				.attr("offset", "0%")
				.attr("stop-color", colorScale(colorValueArray[0]))
				.attr("stop-opacity", 1);
				
				gradient.append("svg:stop")
				.attr("offset", "25%")
				.attr("stop-color", colorScale(colorValueArray[1]))
				.attr("stop-opacity", 1);
				
				gradient.append("svg:stop")
				.attr("offset", "50%")
				.attr("stop-color", colorScale(colorValueArray[2]))
				.attr("stop-opacity", 1);
				
				gradient.append("svg:stop")
				.attr("offset", "75%")
				.attr("stop-color", colorScale(colorValueArray[3]))
				.attr("stop-opacity", 1);
				
				
				gradient.append("svg:stop")
				.attr("offset", "100%")
				.attr("stop-color", colorScale(colorValueArray[4]))
				.attr("stop-opacity", 1);
				
				
				
				
				
				gradientGroup.append("rect")
				.attr("x", function(d,i) { return i*rectWidth;})
				.attr("width", scaleWidth*.8)
				.attr("height", rectHeight)
				.style("fill", "url(#gradient)");
				
				
				gradientGroup.selectAll(".text")
				.data(textarray)
				.enter()
				.append("text")
				.attr("x", function(d,i) {var leftMargin = (d.toString().length*(3.5)); return (i*rectWidth+(rectWidth*.5))-leftMargin;})
				.attr("y", function(d,i) { return rectHeight;})
				.attr("dy", function(d,i) { return "1em"})
				.attr("width", rectWidth)
				.attr("height", rectHeight)
				.attr("fill", "white")
				.text(function(d){return d;}); 
				
				gradientGroup.append("svg:image")
				.attr("class","gradientRepresentIcon")
				.attr("xlink:href",function(){ return "arrow-up.png"})
				.attr("y", rectHeight)
				.attr("width", 15)
				.attr("height",15)
				.attr("display","none");     
				
				
				
			}*/
			treeMapChart : function(divId,treeData,colorCombination)
			{
				
				
				
				var width =parseInt(d3.select("#"+divId).style("width"));
				var height=parseInt(d3.select("#"+divId).style("height")); 
				
				var treeMapMargin={left:width*0.05,right:width*0.05,bottom:height*0.1,top:height*0.05,chartSeparator:5,xScalePaddingTop:height*0.2,yScalePaddingLeft:width*0.1};
				var scaleWidth=width-treeMapMargin.left-treeMapMargin.right;
				var scaleHeight=height-treeMapMargin.top-treeMapMargin.bottom;
				
				
				var  svgElement = d3.select("#"+divId).append("svg").attr('width',width).attr('height',height);
				
				
				var treeMainGroup = svgElement.append("g")
				.attr('class','main-group')
				.attr("transform", "translate(" +treeMapMargin.left+ "," +treeMapMargin.top+ ")")
				
				var gradientGroup = treeMainGroup.append("g")
				.attr('class','gradientGroup')
				.attr("transform", "translate(" +(scaleWidth*.1)+ "," +(scaleHeight +(10))+ ")");
				
				
				var minColorValue = d3.min(treeData.children, function (d) {
					return d.size;
				})
				var maxColorValue = d3.max(treeData.children, function (d) {
					return d.size;
				});
				
				var yScale  = d3.scale.linear()
				.domain([minColorValue,maxColorValue])
				.range([0,scaleWidth*.78]);				   
				
				var colorScale = d3.scale.linear()
				.domain([minColorValue, (minColorValue + maxColorValue) / 2, maxColorValue])
				.range([colorCombination.colorLow, colorCombination.colorMed, colorCombination.colorHigh]);
				
				var treemap = d3.layout.treemap()
				.size([scaleWidth, scaleHeight])
				.sticky(true)
				.value(function(d) { return d.size; });
				
				var node = treeMainGroup.datum(treeData).selectAll(".rect")
				.data(treemap.nodes)
				.enter().append("rect")
				.attr("class", "node")
				.attr("value",function(d){return d.size;})
				.attr("porfolioId",function(d){return d.portfolioId;})
				.attr("x", function(d) { return d.x;})
				.attr("y", function(d) { return d.y;})
				.attr("width", 0)
				.attr("height", 0)
				.attr("fill", function(d,i) {
					if(d.name == 'tree')
					{
						return "none";
					}
					else
					{
						var rectangleGradient = treeMainGroup.append("svg:defs")
						.append("svg:linearGradient")
						.attr("id", "rectangleGradient"+i)
						.attr("spreadMethod", "pad")
						.attr("gradientTransform","rotate(0)");
						
						rectangleGradient.append("stop")
						.attr("offset", "0")
						.attr("stop-color", function(){return ColorLuminance(colorScale(d.size), -0.2)});
						rectangleGradient.append("stop")
						.attr("offset", ".05")
						.attr("stop-color", function(){return ColorLuminance(colorScale(d.size), 0.2)});			
						rectangleGradient.append("stop")
						.attr("offset", ".95")
						.attr("stop-color", function(){return ColorLuminance(colorScale(d.size), 0.2)});						
						rectangleGradient
						.append("stop")
						.attr("offset", "1")
						.attr("stop-color",function(){return ColorLuminance(colorScale(d.size), -0.2)});
						
						return "url(#rectangleGradient"+i+")"
					}  
					
				})
				.on("mousemove",function(){
					var value = parseInt(d3.select(this).attr("value"));
					d3.select(".gradientRepresentIcon").attr("display","block").transition().duration(1000)
					.attr("x",yScale(value));
					
				})
				.on("mouseleave",function(){
					d3.select(".gradientRepresentIcon").attr("display","none");
				});
				
				node.transition().duration(2000)
				.attr("width", function(d) { return Math.max(0, d.dx - 1); })
				.attr("height", function(d) { return Math.max(0, d.dy - 1); })
				
				var textRef	= treeMainGroup.datum(treeData).selectAll(".text")
				.data(treemap.nodes)
				.enter().append("text")
				.attr("x", function(d) { return d.x + 3;})
				.attr("y", function(d) { var ey = Math.min(16, 0.1*Math.sqrt(d.area));return d.y+(ey*2);})
				.attr("fill","white")
				.style("font-size", function(d) {
				return Math.min(16, 0.18*Math.sqrt(d.area))+'px'; })
				.text("");
				textRef.transition().delay(1500).text(function(d) { return d.children ? null : d.name; });				
				
				
				var midValue = (minColorValue+maxColorValue)/2;
				var colorValueArray = [];
				colorValueArray.push(minColorValue);
				var avg = (minColorValue+midValue)/2;
				colorValueArray.push(avg)
				colorValueArray.push(midValue);
				var avg = (maxColorValue+midValue)/2;
				colorValueArray.push(avg);
				colorValueArray.push(maxColorValue);
				
				
				var textarray = [];
				var startRange = treeData.range[0];
				var endRange = treeData.range[1];
				textarray.push(startRange+"%");
				textarray.push((startRange/2)+"%");
				textarray.push((startRange+endRange)+"%");
				textarray.push((endRange/2)+"%");
				textarray.push(endRange+"%");	
				
				var rectWidth = (scaleWidth*.8)/5;
				var rectHeight = (treeMapMargin.bottom*.2);
				
				var gradient = gradientGroup.append("svg:defs")
				.append("svg:linearGradient")
				.attr("id", "gradient")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", (scaleWidth*.8))
				.attr("y2",rectHeight)
				.attr("gradientUnits", "userSpaceOnUse");
				
				gradient.append("svg:stop")
				.attr("offset", "0%")
				.attr("stop-color", colorScale(colorValueArray[0]))
				.attr("stop-opacity", 1);
				
				gradient.append("svg:stop")
				.attr("offset", "25%")
				.attr("stop-color", colorScale(colorValueArray[1]))
				.attr("stop-opacity", 1);
				
				gradient.append("svg:stop")
				.attr("offset", "50%")
				.attr("stop-color", colorScale(colorValueArray[2]))
				.attr("stop-opacity", 1);
				
				gradient.append("svg:stop")
				.attr("offset", "75%")
				.attr("stop-color", colorScale(colorValueArray[3]))
				.attr("stop-opacity", 1);
				
				
				gradient.append("svg:stop")
				.attr("offset", "100%")
				.attr("stop-color", colorScale(colorValueArray[4]))
				.attr("stop-opacity", 1);
				
				
				
				
				
				gradientGroup.append("rect")
				.attr("x", function(d,i) { return i*rectWidth;})
				.attr("width", scaleWidth*.8)
				.attr("height", rectHeight)
				.style("fill", "url(#gradient)");
				
				
				gradientGroup.selectAll(".text")
				.data(textarray)
				.enter()
				.append("text")
				.attr("x", function(d,i) {var leftMargin = (d.toString().length*(3.5)); return (i*(rectWidth*1.2));})
				.attr("y", function(d,i) { return rectHeight;})
				.attr("dy", function(d,i) { return "1em"})
				.attr("width", rectWidth)
				.attr("height", rectHeight)
				.attr("fill", "black")
				.text(function(d){return d;});	
				
				gradientGroup.append("svg:image")
				.attr("class","gradientRepresentIcon")
				.attr("xlink:href",function(){ return "arrow-up.png"})
				.attr("y", rectHeight)
				.attr("width", 15)
				.attr("height",15)
				.attr("display","none");				 
				
				function ColorLuminance(hex, lum){
					
					// validate hex string
					hex = String(hex).replace(/[^0-9a-f]/gi, '');
					if (hex.length < 6) {
						hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
					}
					lum = lum || 0;
					
					// convert to decimal and change luminosity
					var rgb = "#", c, i;
					for (i = 0; i < 3; i++) {
						c = parseInt(hex.substr(i*2,2), 16);
						c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
						rgb += ("00"+c).substr(c.length);
					}
					
					return rgb;
				}
				
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
		
		