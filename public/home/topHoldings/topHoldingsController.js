angular.module('app').controller('topHoldingsController',['$scope','topHoldingsService','mainAppService','tabService',function($scope,topHoldingsService,mainAppService,tabService){
	
	//$scope.companyNameMapping = {"AAPL" : "AAPL INC","GOOG" : "GOOGLE INC.","SPY" : "SPY INC." };  
	var symbolListDisplayed = ["AAPL","GOOG","IBM","C","F","CSCO","SPY"];
	var symbolList = "AAPL,GOOG,IBM,C,F,CSCO,SPY";
	var symbolRank = {};
	var  unsubsribe = [];
	$scope.data = [];
	
	var callback=function(message){
		
		var currentObject=JSON.parse(message);
		var symbol = currentObject.T;
		//console.log(currentObject);
		if(unsubsribe.indexOf(symbol) == -1){
			
			var json ={};
			if(currentObject.L){
				//  $scope.data[symbolRank[symbol]].LV=currentObject.L ;
				json[symbol]={"last" : currentObject.L  };
				displaySymbolInTopHoldings(json);
				
			}
			if(currentObject.C){
				//$scope.data[symbolRank[symbol]].LV=currentObject.L ;
				json[symbol]= {"chg" : currentObject.C };
				displaySymbolInTopHoldings(json);
				
			} 
			$scope.$apply();	
		}
	};
	
	var getValueBasedOnProperty=function(sym,property){
		
		return $scope.data[symbolRank[sym]][property];
		
		
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
	
	
	var displaySymbolInTopHoldings = function(symbolData){
		
		
		//		console.log($scope.data);
		
		for(var key in symbolData){
			
			var json = {symbol : key };
			
			//////////////////////////////////////////////////text color 
			if(symbolData[key]["chg"] === undefined){
				
			}
			else if(symbolRank[key] === undefined || symbolRank[key] == -1){
				
				json.CH = symbolData[key]["chg"];
				json.TextColor = getTextColorChange(symbolData[key]["chg"]);					
			}
			else{
				
				$scope.data[symbolRank[key]].CH = symbolData[key]["chg"];
				$scope.data[symbolRank[key]].TextColor = getTextColorChange(symbolData[key]["chg"]); 
				
			}
			
			
			
			//////////////////////////////////////////////////up down symbol
			if(symbolData[key]["last"] === undefined){
				
			}
			else if(symbolRank[key] === undefined || symbolRank[key] == -1){
				json.LV = symbolData[key]["last"];
				json.upDown = getUpDownImage(symbolData[key]["last"]);					
			}
			else{
				$scope.data[symbolRank[key]].upDown =  getUpDownImage(symbolData[key]["last"] - $scope.data[symbolRank[key]].LV);
				$scope.data[symbolRank[key]].LV = symbolData[key]["last"];
			}
			
			
			
			if(symbolRank[key] == -1 || symbolRank[key] === undefined){
				topHoldingsService.changeSymbolRank(symbolRank,function(symbolRankJson){
					symbolRank =  symbolRankJson ;
					symbolRank[key] = 0;
					$scope.data.unshift(json);
					
					
					if(mainAppService.subsribeSymbolIdMapping[key] === undefined){
						
					}
					else{
						console.log(key);
						mainAppService.unsubscribe(key);
					}
					
					id = socketClient.client.subscribe("/topic/E:"+key,callback);
					mainAppService.subsribeSymbolIdMapping[key] = id;
				});
			}	
		}
		
	};
	
	var addButtonSymbolsList = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('FIELD1'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		limit: 15,
		local : symbolsForList
	});
	
	
	$scope.init = function(){
		
		var i = 0;
		console.log(JSON.stringify(mainAppService.subsribeSymbolIdMapping));
		
		$(".top-holdings-module").niceScroll({cursorborder:"",cursorcolor:"grey"});
		
		addButtonSymbolsList.initialize();
		
		console.log("symbolList	:	"  + symbolList );
		
		topHoldingsService.getQoutes(symbolList,function(symbolData){
			//alert("top h");
			if(symbolData == "error"){
				
			}
			else{
				displaySymbolInTopHoldings(symbolData);	
			}
			mainAppService.loader++;	
		});
		
		$('.symbolDisplay .typeahead').typeahead(null, {
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
			}).on('typeahead:selected', function (obj, datum) {
			
			if(symbolListDisplayed.indexOf(datum.FIELD1) < 0){
				symbolList += "," + datum.FIELD1; 
				symbolListDisplayed.push(datum.FIELD1);
				topHoldingsService.returnTrimmedArray(unsubsribe,datum.FIELD1,function(array){
					
					unsubsribe = array;
					
					topHoldingsService.getQoutes(datum.FIELD1,function(symbolData){
						
						console.log(symbolData);
						displaySymbolInTopHoldings(symbolData);
						
					});
					
				});
				
				
			}
			
			$('.addSymbolButton').toggle();
		});
		
	};
	
	$scope.showSymbolList = function(){
		
		$('.addSymbolButton').toggle();
		$($('.symbolDisplay').find('.typeahead')).val("");
	}	
	
	$scope.getRowClass = function(index){
		
		if(index%2 == 0)
		{
			return "row even";
		} 
		else{ 		
			return "row odd";
		}
		
	}
	
	$scope.getTextColorClass = function(prevClass,value){
		
		return (prevClass + " " + value);
		
	};
	
	$scope.deleteSymbolFromList =  function(symbol){
		
		unsubsribe.push(symbol);
		
		mainAppService.unsubscribe(symbol);		
		
		topHoldingsService.deleteSymbolFromDataSource(symbol,symbolRank,$scope.data,function(array,syblRank){
			
			$scope.data =  array ; 	
			symbolRank  =  syblRank ;
			
			topHoldingsService.returnTrimmedArray(symbolListDisplayed,symbol,function(array){
				
				symbolListDisplayed = array;
				
				symbolList = symbolListDisplayed.toString();
				
			})
			
		});
	};
	
	
	$scope.$on('homeDivInit',function(){
		/*
		tabService.getSymbolsToSubscribeOnTabChange(function(symbolArray){
			
			for(var i = 0 ; i < symbolArray.length ; i++){
				if(mainAppService.subsribeSymbolIdMapping[symbolArray[i]] === undefined){
				}
				else{
					mainAppService.unsubscribe(symbolArray[i]);		
				}
				id = socketClient.client.subscribe("/topic/E:"+symbolArray[i],callback);
				
				mainAppService.subsribeSymbolIdMapping[symbolArray[i]] = id;
			}
		});
		
		tabService.getResearchTabSubscribedSymbol(function(symbolName){
			
			//alert(symbolName);
			mainAppService.unsubscribe(symbolName);
			
			id = socketClient.client.subscribe("/topic/E:"+symbolName, callback);
			
			mainAppService.subsribeSymbolIdMapping[symbolName] = id;
			
		});
		*/
		
	});
	
}]);