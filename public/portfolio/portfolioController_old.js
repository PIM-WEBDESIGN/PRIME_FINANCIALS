angular.module('app').controller('portfolioController',['$scope','portfolioService','$rootScope','topHoldingsService','tabService','$timeout',function($scope,portfolioService,$rootScope,topHoldingsService,tabService,$timeout){
	
	var heatMapDataSource = {};
	var heatMapArray = [];
	var children = [];
	var activePortfolioId = "";
	var editActive = false;
	var minOfHeatMap,maxOfHeatMap;
	var assetValueJsonWithPortolioId = {};
	var treeData = {};
	var colorCombination = {};
	var flag = true;
	var treeMapAreaActive = true;
	var filesArray;
	$scope.portfolioListArray = {}; 		  // portfolios name array 	
	$scope.portfolioSymbolDataSource = {};	  // each portfolio symbols list 
	
	var  symbolDataArray = [];
	portfolioIdMapper = {};
	
	$scope.symbolDataSourceIndexMapping = {};
	symbolRank={};
	var symbolListDisplayed = ["AAPL","GOOG","IBM","C","F","CSCO","SPY"];
	//var symbolList = "AAPL,GOOG,IBM,C,F,CSCO,SPY";
	var  symbolList ;
	
	$scope.Industries = {};
	var dummyJson = {"Energy" : {D1 : 50 , D5 : 20 , M1:25 ,Y1 :30},"Materials" :{D1 : 1 , D5 : 2 , M1:5,Y1 :20},"Industrials" : {D1 : -14 , D5 : -20 , M1: -25 ,Y1 :40},"Consumer Discreationary" :{D1 : 1.42 , D5 : 2.3 , M1:22.5,Y1 :15.65} ,"Consumer Stapple" :{D1 : 2 , D5 : 8 , M1:25,Y1 :35}, "Health Care" : {D1 : 14.1 , D5 : 23 , M1:25.4,Y1 :35.4} ,"Fiancials" :{D1 : 19 , D5 : -20 , M1:29,Y1 :45} , "Information Technology" : {D1 : 1.2 , D5 : 1.6 , M1:4.6,Y1 :9.2},"Telecommunication":{D1 : 0.1 , D5 : 0.56 , M1:0.78,Y1 :1.3},"Services" :{D1 : 2.1 , D5 : 5.3 , M1:8.1,Y1 :15.9} , "Utilities" :{D1 :0.2 , D5 : 1.73 , M1:2.5,Y1 :10}};
	
	var portfolioAssetValueJson = {};
	var portfolioAssetValueArray = [];
	// Edit portfolio View 
	var symbolDataSourceArrayForPortfolioList = [];
	$scope.middlePortfolioView = true;
	// Pie chart data
	var dataPie = {
		dountData  :[231,123,184,155,55],
		dountKey   :["Energy","Materials","Fiancials","Utilities","Services"],
		colorArray : tabService.pieDonutColorArray[tabService.activeTheme],
		//colorArray :['#b9a44d','#f4d551','#8c7931','#bdbc84','#dec56a'],
		//colorArray :['#ecf600','#ecf600','#01f6ec','#bd62e4','#fb0e0e'],
		//colorArray :['#ecf600','#d4ee2b','#fc348d','#5697db','#fb0e0e'],
		unit : "%",
		factor :"Worth"
	};
	
	var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":tabService.ticksColor,"font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white"};
	
	var colorCombinationGrad = {
		colorLow: 'red',
		colorMed: '#eaea7e',
		colorHigh: 'green'
	}					   
	
	var rangeArrayGrad = [-50,50];
	
	var addButtonSymbolsList = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('FIELD1'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		limit: 15,
		local : symbolsForList
	});
	
	var callback=function(message){
		
		var currentObject=JSON.parse(message);
		var symbol = currentObject.T;
		
		var json ={};
		if(currentObject.L){
			currentObject.L =  round(currentObject.L,2);
			$rootScope.mainDataSource[symbol].upDown =  getUpDownImage(currentObject.L - $rootScope.mainDataSource[symbol].LV);
			$rootScope.mainDataSource[symbol].LV = currentObject.L;
			$scope.$apply();
			if($scope.portfolioSymbolDataSource.hasOwnProperty(symbol) && editActive ){
				//change = currentObject.L - $rootScope.mainDataSource[symbol].LV;
				addValueToTotalPortfolioAmout();		
			}
			
			
		}
		if(currentObject.C){
			currentObject.C =  round(currentObject.C,2);
			$rootScope.mainDataSource[symbol].CH = currentObject.C;
			$rootScope.mainDataSource[symbol].TextColor = getTextColorChange(currentObject.C);
			$scope.$apply();
		} 
		//$scope.$apply();		
	};
	
	
	$scope.init = function(){
		$('.holding-container-module').niceScroll({cursorborder:"",cursorcolor:"grey"});
		$('#portfolio_list').niceScroll({cursorborder:"",cursorcolor:"grey",horizrailenabled : false});
		addButtonSymbolsList.initialize();
		$(document).on('click','.treeMapNode',function(){
			var id = $(this).attr('id');		
			changeViewOfportfolio(id);
		});
		$scope.portfolioListArray = {};
		$scope.portfolioSymbolDataSource = {}; 
		flag = true;
		
		
	};	
	
	$("#importFile").on('change',function(e){
		
		var reader = new FileReader();
		reader.onload = function(evt){
			var csvval=evt.target.result;
			portfolioService.csvJSON(csvval,function(json){
				updatePortfolioWithCsv(json);
			});
		};
		reader.readAsText(e.target.files.item(0));
		
		//alert($("#importFile").val());
		$("#importFile").val("");
		//alert($("#importFile").val());
	});
	
	var updatePortfolioWithCsv = function(data){
		//console.log(data);
		var tickers = [];
		var shares = [];
		var tickersList = "";
		var sharesList = "";
		
		for(var key  in data){
			if(key != undefined && key!="" && typeof(key) == "string" && !(isNaN(data[key]))){
				tickers.push(key);
				shares.push(data[key]);
			}	
		}
		
		tickersList = tickers.toString();
		sharesList = shares.toString();
		
		
			
			topHoldingsService.getQoutes(tickersList,function(symbolData){
			
				if(Object.keys(symbolData).length == 0){
					
				}
				else{
				
				
				
				portfolioService.addTickerToSpecificPortfolio(activePortfolioId,tickersList,sharesList,function(){
				//$scope.portfolioListArray[activePortfolioId]["tickers"] = []; 
				
				displaySymbolInSymbolsDiv(symbolData);
				for(var i = 0 ; i < tickers.length ; i++){
					
					symbolDataSourceArrayForPortfolioList.push(tickers[i]);
					
					$scope.portfolioSymbolDataSource[tickers[i]] = shares[i];
					$scope.portfolioListArray[activePortfolioId]["tickers"].push({"ticker" : tickers[i] , "shares" : shares[i] });
					
				}
				
				symbolList = symbolDataSourceArrayForPortfolioList.toString();
				
				for(var i = 0 ; i < tickers.length ; i++){
					
					if(symbolData[tickers[i]] != undefined)
					{	
						total = ($scope.portfolioSymbolDataSource[tickers[i]] * round(symbolData[tickers[i]]["last"],2));	
						total = round(total,2);
					}
					assetValueJsonWithPortolioId[activePortfolioId] += total;				
					
				}
				
				assetValueJsonWithPortolioId[activePortfolioId] = round(assetValueJsonWithPortolioId[activePortfolioId],2);
				
				$scope.totalValue = round(assetValueJsonWithPortolioId[activePortfolioId],2);
				children = [];
				for(var key in $scope.portfolioListArray)
				{
					children.push({ name: $scope.portfolioListArray[key]["portfolio_name"] , size:assetValueJsonWithPortolioId[key] , portfolioId : key});
				}
				//console.log(children);
				
				$scope.$apply();
				
				//$timeout(function(){
				
			//},1000);
			
				});	
				
			}
	})
	
}


var changeViewOfportfolio = function(portfolioId){
	
	symbolDataSourceArrayForPortfolioList = [];
	$scope.portfolioSymbolDataSource = {};
	$scope.middlePortfolioView = true;
	editActive = false;
	treeMapAreaActive = false;
	$scope.headingName = $scope.portfolioListArray[portfolioId]["portfolio_name"];
	
	activePortfolioId = portfolioId;
	$('#treeContainer').css('display' , 'none');
	
	$('#portfoliosContainer').css('display' , 'block');		
	
	$('.portfolio-list ul li a.active').removeClass('active');
	
	$($($('.portfolio-list ul').find('#' + portfolioId)).find('a')).addClass('active');
	
	$("#pieChartContainer").empty();
	$("#gradientContainer").empty();
	
	symbolRank  =  {};
	
	$scope.Industries = {};
	
	var data  =  $scope.portfolioListArray[portfolioId]["tickers"];
	
	//console.log(data);
	
	if(data === undefined || data.length == 0){
		
	}
	else{
		
		for(var i=0 ; i < data.length ; i++){
			$scope.portfolioSymbolDataSource[data[i]["ticker"]] = data[i]["shares"];
			//alert(JSON.stringify(data[i]));
			symbolDataSourceArrayForPortfolioList.push(data[i]["ticker"]);
		}
		
		
		
		symbolList = symbolDataSourceArrayForPortfolioList.toString();
		
		//alert(symbolList);
		
		topHoldingsService.getQoutes(symbolList,function(symbolData){
			
			if(symbolData == "error"){
				
			}
			else{
				//alert(JSON.stringify(symbolData));
				displaySymbolInSymbolsDiv(symbolData);	
			}
		});
		
	};
	
	setTimeout(function(){
		var stocChart49=$("#pieChartContainer").stocCharts(textStyleConfg);
		stocChart49.threeDPieChartWithLegendAnalysis(dataPie);
		portfolioService.setGradientRectangle("gradientContainer",rangeArrayGrad,colorCombinationGrad,tabService.ticksColor);
	},100)
	
	$scope.Industries = dummyJson;
	
	// it's a calling method  	gradientContainer is a container id
};

$scope.changeViewOfportfolio = function(portfolioId){
	changeViewOfportfolio(portfolioId);		
};

$scope.addPortfolio = function(){
	var portfolioName = $scope.portfolioName; 
	if( portfolioName == "" || portfolioName == " " || portfolioName === undefined){		
		alert('Please Enter PORTFOLIO NAME');
	}
	else{
		portfolioService.addPortfolio(portfolioName,function(data){		
			$scope.portfolioListArray[data] =  {};
			$scope.portfolioListArray[data] = {"portfolio_name" : portfolioName}; 
			$scope.portfolioName = "";
			$scope.portfolioListArray[data]["tickers"] = [];
			$scope.$apply();
			/*
				var asset = random(-50,50);
				//console.log(asset);
				children.push({ name: portfolioName , size : 50  , portfolioId : data});
				
				$scope.portfolioName = "";
				
				makeTreeMap(children);
			*/
			
		});
	}
	
};	
/*
	$scope.$watch(function() { return portfolioService.portfoliosArray },
	function(newValue, oldValue) {
	$scope.portfolioListArray = newValue;
	}
	);
*/
$scope.$on('themeChanged',function(){
	
	$("#pieChartContainer").empty();
	$("#gradientContainer").empty();	
	$('#donutChartContainer').empty();
	
	dataPie = {
		dountData  :[231,123,184,155,55],
		dountKey   :["Energy","Materials","Fiancials","Utilities","Services"],
		colorArray : tabService.pieDonutColorArray[tabService.activeTheme],
		//colorArray :['#b9a44d','#f4d551','#8c7931','#bdbc84','#dec56a'],
		//colorArray :['#ecf600','#ecf600','#01f6ec','#bd62e4','#fb0e0e'],
		//colorArray :['#ecf600','#d4ee2b','#fc348d','#5697db','#fb0e0e'],
		unit : "%",
		factor :"Worth"
	};
	
	textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":tabService.ticksColor,"font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white"};
	if(treeMapAreaActive){
		makeTreeMap(children);			
	}
	
	setTimeout(function(){
		var stocChart49=$("#pieChartContainer").stocCharts(textStyleConfg);
		stocChart49.threeDPieChartWithLegendAnalysis(dataPie);
		portfolioService.setGradientRectangle("gradientContainer",rangeArrayGrad,colorCombinationGrad,tabService.ticksColor);
		
		var stocChart49=$("#donutChartContainer").stocCharts(textStyleConfg);
		stocChart49.threeDDountChartWithLegendAnalysis(dataPie);	
		//portfolioService.setGradientRectangle("gradientContainer",rangeArrayGrad,colorCombinationGrad,tabService.ticksColor);
		
	},100)
	
});

$scope.$on('portfolioDivInit',function(){	
	
	var max = 0;
	var min = 0;
	treeMapAreaActive = true;
	$scope.middlePortfolioView = true;
	editActive = false;
	$('#treeContainer').empty();
	$('#treeContainer').css('display' , 'block');
	$('#portfoliosContainer').css('display' , 'none');
	$('.portfolio-list ul li a.active').removeClass('active');
	$scope.Industries = {};
	
	
	
	portfolioService.portfoliosArray = [];
	portfolioService.getPortfolioAssetValues(function(data){
		//console.log(data);
		potfolioAssetValueArrayList = [];
		
		
		if(flag){
			for(var portfolio in data){
				$scope.portfolioListArray[portfolio] =  data[portfolio];			
				console.log($scope.portfolioListArray[portfolio]);
				for(var i=0 ; i< $scope.portfolioListArray[portfolio]["tickers"].length ; i++){
					if(portfolioAssetValueArray.indexOf($scope.portfolioListArray[portfolio]["tickers"][i]["ticker"])  == -1){
						portfolioAssetValueArray.push($scope.portfolioListArray[portfolio]["tickers"][i]["ticker"]);	
					}
				}
			}
			
			calculatetotalAssetValueForPortfolio();
			flag = false;
		}
		else{
			console.log($scope.portfolioListArray);
			makeTreeMap(children);
		}
		
	});	
	
	
});

var displaySymbolInSymbolsDiv = function(symbolData){
	
	for(var key in symbolData){	
		var json = {symbol : key };
		var symbol = key;
		//////////////////////////////////////////////////text color 
		if(symbolData[key]["chg"] === undefined){
			
		}
		/*	else if(symbolRank[key] === undefined || symbolRank[key] == -1){
			json.CH = round(symbolData[key]["chg"],2);
			json.TextColor = getTextColorChange(symbolData[key]["chg"]);					
		}*/
		else{	
			if($rootScope.mainDataSource[symbol] === undefined){
				//$rootScope.mainDataSource[symbol] = {};
				json.CH = round(symbolData[key]["chg"],2);
				json.TextColor = getTextColorChange(symbolData[key]["chg"]);
			}
			else{				
				$rootScope.mainDataSource[symbol].CH = round(symbolData[key]["chg"],2);
				$rootScope.mainDataSource[symbol].TextColor = getTextColorChange(symbolData[key]["chg"]); 	
			}
			
		}
		
		//////////////////////////////////////////////////up down symbol
		if(symbolData[key]["last"] === undefined){
			
		}
		/*	else if($rootScope.mainDataSource[symbol].LV === undefined){
			json.LV = round(symbolData[key]["last"],2);
			json.upDown = getUpDownImage(symbolData[key]["last"]);					
		}*/
		else{
			if($rootScope.mainDataSource[symbol] === undefined){
				json.LV = round(symbolData[key]["last"],2);
				json.upDown = getUpDownImage(symbolData[key]["last"]);		
				//$rootScope.mainDataSource[symbol].upDown =  getUpDownImage(symbolData[key]["last"]);	
			}
			else{
				$rootScope.mainDataSource[symbol].upDown =  getUpDownImage(symbolData[key]["last"] - $rootScope.mainDataSource[symbol].LV);
				$rootScope.mainDataSource[symbol].LV = round(symbolData[key]["last"],2);
			}
			
		}
		
		
		
		if($rootScope.mainDataSource[symbol] === undefined){
			
			$rootScope.mainDataSource[symbol] = {};
			$rootScope.mainDataSource[symbol] = json;
			
			if(portfolioService.subsribeSymbolIdMapping[key] === undefined){
				
			}
			else{
				portfolioService.unsubscribe(key);
			}
			
			id = socketClient.client.subscribe("/topic/E:"+key,callback);
			portfolioService.subsribeSymbolIdMapping[key] = id;
			
			if(symbolDataArray.indexOf(key) == -1){
				symbolDataArray.push(key);
			}
			
		}
	}
	
	if(editActive){
		addValueToTotalPortfolioAmout();	
	}
};

$scope.getTextColorClass = function(prevClass,value){
	
	return (prevClass + " " + value);
	
};

var getTextColorChange = function(value){
	
	if(value == 0){
		return "white";
	}
	else if(value > 0){
		return "green";
	}
	else{
		return  "red";
	}
	
}

var getUpDownImage =  function(value){
	
	if(value > 0 ){
		return "up";
	}
	else{
		return "down";
	}		
}


$scope.getRowClass = function(index){
	
	if(index%2 == 0)
	{
		return "row even";
	} 
	else{ 		
		return "row odd";
	}
	
};


$('.portfolioSymbolDisplay .typeahead').typeahead(null, {
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
			return '<p><strong>' +data.FIELD1 + '</strong> <span class = "companyNameinAddList"> '+ data.FIELD2 +'</span></p>';
		}	
	},
	engine: Hogan
})
.on('typeahead:selected', function (obj, datum) {
	var total = 0 ;
	if( symbolDataSourceArrayForPortfolioList.indexOf(datum.FIELD1) == -1){
		
		topHoldingsService.getQoutes(datum.FIELD1,function(symbolData){
			
			if(Object.keys(symbolData).length == 0){
				
				}
				else{
			
			portfolioService.addTickerToSpecificPortfolio(activePortfolioId,datum.FIELD1,"100",function(){
			
			
				
				//$scope.portfolioListArray[activePortfolioId]["tickers"] = []; 
				//alert(JSON.stringify(symbolData));
				
				displaySymbolInSymbolsDiv(symbolData);
				if(symbolData.status == "Failure"){
					
				}
				else{
					symbolDataSourceArrayForPortfolioList.push(datum.FIELD1);
					
					$scope.portfolioSymbolDataSource[datum.FIELD1] = 100;
					$scope.portfolioListArray[activePortfolioId]["tickers"].push({"ticker" : datum.FIELD1 , "shares" : 100 })
					
					symbolList = symbolDataSourceArrayForPortfolioList.toString();
					
					if(symbolData[datum.FIELD1] != undefined)
					{	
						total = ($scope.portfolioSymbolDataSource[datum.FIELD1] * round(symbolData[datum.FIELD1]["last"],2));	
						total = round(total,2);
					}
					
					assetValueJsonWithPortolioId[activePortfolioId] += total;				
					children = [];
					for(var key in $scope.portfolioListArray)
					{
						children.push({ name: $scope.portfolioListArray[key]["portfolio_name"] , size:assetValueJsonWithPortolioId[key] , portfolioId : key});
					}
					//console.log(children);
					
					$scope.$apply();
					
					//$timeout(function(){
					
				}
				$('#portfolioSymbolInput').val("");	
			//},1000);
			
				});	
				
			}
		});
}	
else{
	alert('SYMBOL ALREADY SUBSCRIBED');	
	setTimeout(function(){
		$('#portfolioSymbolInput').val("");		
	},100)
}
});

$scope.deleteSymbolFromList =  function(symbol){
	var total = 0 ;
	portfolioService.unsubscribe(symbol);		
	
	var tempArray = symbolDataSourceArrayForPortfolioList;
	
	portfolioService.deleteTickerFromPortfolio(activePortfolioId,symbol,function(){
		
		portfolioService.returnTrimmedArray(tempArray,symbol,function(array){
			
			symbolDataSourceArrayForPortfolioList = array;
			
			symbolList = symbolDataSourceArrayForPortfolioList.toString();
			
			if($rootScope.mainDataSource[symbol] != undefined){
				total = ($scope.portfolioSymbolDataSource[symbol] * $rootScope.mainDataSource[symbol].LV);					
			}
			
			delete $scope.portfolioSymbolDataSource[symbol];
			
			$scope.$apply();
			
			array =  $scope.portfolioListArray[activePortfolioId]["tickers"];
			
			portfolioService.returnTrimmedJsonArray(array,"ticker",symbol,function(returnedArray){
				$scope.portfolioListArray[activePortfolioId]["tickers"] = returnedArray;
			});
			
			assetValueJsonWithPortolioId[activePortfolioId] = assetValueJsonWithPortolioId[activePortfolioId] - total;
			//console.log("deleted val : "  +  assetValueJsonWithPortolioId[activePortfolioId]);
			children = [];
			for(var key in $scope.portfolioListArray)
			{
				children.push({ name: $scope.portfolioListArray[key]["portfolio_name"] , size:assetValueJsonWithPortolioId[key] , portfolioId : key});
			}
			//console.log(children);
			
		})
		
	});
};


$scope.deletePortfolio = function(portfolioId,event){
	event.stopPropagation();
	//alert(portfolioId);
	editActive = false;
	portfolioService.deletePortfolio(portfolioId,function(){
		
		delete $scope.portfolioListArray[portfolioId];
		
		var temp = [];
		
		for(var i = 0 ;  i < children.length ; i++){
			
			if(  children[i].portfolioId == portfolioId	)
			{
				
			}
			else{
				temp.push(children[i]);
			}
		} 
		children = temp;
		//console.log($scope.portfolioListArray);
		$rootScope.$broadcast('portfolioDivInit');
		$scope.$apply();	
		
		
	});
	
};


$scope.getStyle = function(value){
	/*if(value < minOfHeatMap  || value > maxOfHeatMap){
		getNewColorRangeAndValue(value,minOfHeatMap,maxOfHeatMap,function(color){
		return  {background : color};		
		})
		}
		else{
		getColorFromValue(value,function(color){
		return  {background : color};			
		})			
		}
	*/
	var val = portfolioService.getColorAccordingTOvalue(value,rangeArrayGrad,colorCombinationGrad);
	return {background : val};
};

$scope.editPortfolio = function(portfolioId,event){
	
	editActive = true;
	
	//addValueToTotalPortfolioAmout();		
	
	event.stopPropagation();
	$scope.headingName = $scope.portfolioListArray[portfolioId]["portfolio_name"];
	$scope.middlePortfolioView = false;
	activePortfolioId = portfolioId;
	symbolRank = {};
	$scope.totalValue = 0;
	
	$('#donutChartContainer').empty();
	$scope.portfolioSymbolDataSource = {};
	
	var data  =  $scope.portfolioListArray[portfolioId]["tickers"];
	
	//console.log(data);
	
	if(data === undefined || data.length == 0){
		
	}
	else{
		for(var i=0 ; i < data.length ; i++){
			$scope.portfolioSymbolDataSource[data[i]["ticker"]] = data[i]["shares"];
			symbolDataSourceArrayForPortfolioList.push(data[i]["ticker"]);
		}
		
		symbolList = symbolDataSourceArrayForPortfolioList.toString();
		
		
		
		topHoldingsService.getQoutes(symbolList,function(symbolData){
			if(symbolData == "error"){
				
			}
			else{
				displaySymbolInSymbolsDiv(symbolData);	
			}
		});
		////////////////////////////////////////////////////////////////////////////////
	};
	setTimeout(function(){
		var stocChart49=$("#donutChartContainer").stocCharts(textStyleConfg);
		stocChart49.threeDDountChartWithLegendAnalysis(dataPie);	
	},100)
};

random = function(low, high) {
	return Math.random() * (high - low) + low;
}

$scope.resetView = function(){
	$rootScope.$broadcast('portfolioDivInit');
}

makeTreeMap = function(childrenNew){
	
	$('#treeContainer').empty();
	$('#treeContainer').css('display' , 'block');
	$('#portfoliosContainer').css('display' , 'none');
	$('.portfolio-list ul li a.active').removeClass('active');
	
	var max =0;
	var min =0;
	
	for(var i=0;i<childrenNew.length;i++){
		
		
		if(min > childrenNew[i].size ){
			min	= childrenNew[i].size;
		}
		
		if(max < childrenNew[i].size ){
			max = childrenNew[i].size;
		}
	}
	
	treeData = {
		factor : "Asset Value",
		unit : "$",
		range : [-50,50],
		name: "tree",
		children:childrenNew
	};
	if(tabService.activeTheme == "black"){
		colorCombination = {
			colorLow: 'red',
			colorMed: 'yellow',
			colorHigh: 'green'
		};	
	}
	else{
		colorCombination = {
			colorLow: '#D9544F',
			colorMed: '#FFC100',
			colorHigh: '#2F7E78'
		};	
	}
	
	var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":tabService.ticksColor,"font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":15};
	
	var stocChart53=$("#treeContainer").stocCharts(textStyleConfg);
	stocChart53.treeMapChartAnalysis(treeData,colorCombination);	
	
};

$scope.savePortfolioData = function(){
	
	var total = 0;
	var array = [];
	var tickerList = [];
	var i = 0;
	var json = {};
	for(var key in $scope.portfolioSymbolDataSource){
		array.push({"ticker" : key  , "shares" : $scope.portfolioSymbolDataSource[key]});		
		tickerList.push(key);
	}
	
	var id = activePortfolioId.toString();
	
	json["portfolio_data"] = {};
	
	json["portfolio_data"][id] = {};
	
	json["portfolio_data"][id]["portfolio_name"]  = $scope.headingName;
	json["portfolio_data"][id]["tickers"]  = array;
	
	
	portfolioService.savePortfolioData(json,function(){
		$scope.portfolioListArray[id]["tickers"] = array;
		$scope.portfolioListArray[id]["portfolio_name"] = $scope.headingName;
		
		//topHoldingsService.getQoutes(tickerList.toString(),function(symbolData){
		
		
		
		for(var key in $scope.portfolioSymbolDataSource){
			if( $rootScope.mainDataSource[key] != undefined){
				total +=  ($scope.portfolioSymbolDataSource[key] * $rootScope.mainDataSource[key].LV);	
			}
		}
		
		total = round(total,2);
		
		assetValueJsonWithPortolioId[id] = total;				
		children = [];
		for(var key in $scope.portfolioListArray)
		{
			children.push({ name: $scope.portfolioListArray[key]["portfolio_name"] , size:assetValueJsonWithPortolioId[key] , portfolioId : key});
		}
	//});
	
	
	
}); 

};


addValueToTotalPortfolioAmout = function(symbol,change){
	
	$scope.totalValue = 0;
	
	for(var key in $scope.portfolioSymbolDataSource){
		if($rootScope.mainDataSource[key] === undefined){
			
		}
		else{
			if($rootScope.mainDataSource[key].LV === undefined){
				
			}	
			else{
				$scope.totalValue += round(($scope.portfolioSymbolDataSource[key] * $rootScope.mainDataSource[key].LV),2);	
			}	
		}
		
	}
	$scope.totalValue = numberWithCommas($scope.totalValue);		
} 

var numberWithCommas = function(x){

	return(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

}

$scope.checkUndefinedvalue = function(val){
	if(val === undefined){
		return false;	
	}
	else{
		return true;
	}
};

var calculatetotalAssetValueForPortfolio = function(){
	
	var tickersList =  portfolioAssetValueArray.toString(); 
	assetValueJsonWithPortolioId = {};
	children = [];
	topHoldingsService.getQoutes(tickersList,function(symbolData){
		
		//console.log("$scope.portfolioListArray 	: " + JSON.stringify($scope.portfolioListArray));
		
		//console.log("symbolData	: "	+ JSON.stringify(symbolData));
		
		for(var key in $scope.portfolioListArray){
			//console.log(key);
			portfolioAssetValueJson[key] = {};
			
			assetValueJsonWithPortolioId[key] = 0;
			
			for(var i=0;i<$scope.portfolioListArray[key]["tickers"].length;i++){
				////console.log("$scope.portfolioListArray[key]['tickers']	: " + JSON.stringify($scope.portfolioListArray[key]["tickers"]));
				if(symbolData[$scope.portfolioListArray[key]["tickers"][i]["ticker"]] != undefined){
					if(symbolData[$scope.portfolioListArray[key]["tickers"][i]["ticker"]]["last"] != undefined){
						portfolioAssetValueJson[key][$scope.portfolioListArray[key]["tickers"][i]["ticker"]] = { shares : $scope.portfolioListArray[key]["tickers"][i]["shares"], 
						value : round(symbolData[$scope.portfolioListArray[key]["tickers"][i]["ticker"]]["last"],2) };	
					}	
				}
			};
			
			for( var symbol in portfolioAssetValueJson[key]){
				
				assetValueJsonWithPortolioId[key] = assetValueJsonWithPortolioId[key] +  ((portfolioAssetValueJson[key][symbol].value) * (portfolioAssetValueJson[key][symbol].shares));
				assetValueJsonWithPortolioId[key] = round(assetValueJsonWithPortolioId[key],2);
				//console.log(assetValueJsonWithPortolioId[key]);
			}
			
			children.push({ name: $scope.portfolioListArray[key]["portfolio_name"] , size:assetValueJsonWithPortolioId[key] , portfolioId : key});
			console.log("children	: " + children );
			
		};
		makeTreeMap(children);
		$scope.$apply();
	});
};

var round = function(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

$scope.parseFloatMultiplication = function(value,secondValue){
	
	if(value === undefined ){
		return 	
	}
	else{
		var mul = value * secondValue ;
		
		var val = round(mul,2);
		
		return val;	
	}
	
}
/*
	
	//$scope.importCSVfile = function(){
	$("#importFile").on('change',(function(e){
	var files=this.files;
	alert(files);
	};
	//});
	//};
	// onchange="angular.element(this).scope().importCSVfile()" 
	
	//round(1.005, 2); // 1.01
*/
}]);
