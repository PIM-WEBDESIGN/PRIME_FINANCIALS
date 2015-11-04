angular.module('app').controller('majorIndicesController',['$scope','majorIndicesService','mainAppService',function($scope,majorIndicesService,mainAppService){
	
	var symbolRank = {};
    $scope.data1 = [];
	$scope.data2 = [];
	$scope.data3 = [];
	var majorIndicesListArray = [];
	
	var majorIndicesList = "I:FVX,I:TNX,I:IRX,I:TYX,I:DJT,I:DJU,I:DJI,I:XAU,I:IIX,I:MSH,I:NDX,I:COMP,I:NYA,I:OSX,I:RUI,I:RUT,I:OEX,I:SPX,I:SOX,I:VIX";
	
	$scope.init = function(){
		
		$('ul.tab-list li a').on('click', function(){
			$('ul.tab-list li a.active').removeClass('active');
			$(this).addClass('active');
			
		});	
		
		
		
		
		$scope.majorIndicesMapping = {
			"I:FVX"  : 	"5-year note",
			"I:TNX"  : 	"10-year note",
			"I:IRX"  : 	"13-Week T-Bill",
			"I:TYX"  : 	"30-year bond",
			"I:DJT"  : 	"DJ Transport Avg.",
			"I:DJU"  :  "DJ Utilities Avg.",
			"I:DJI"  : 	"DJIA",
			"I:XAU"  : 	"Gold & Silver Index",
			"I:IIX"  :  "Internet Index",
			"I:MSH"  : 	"MS Hi-Tech Index",
			"I:NDX"	 : 	"NASDAQ 100",
			"I:COMP" :  "NASDAQ Comp.",
			"I:NYA"	 :  "NYSE Comp.",
			"I:OSX"  :  "Oil Service Index",
			"I:RUI"  :  "Russell 1000",
			"I:RUT"  :  "Russell 2000",
			"I:OEX"	 :  "S & P 100",
			"I:SPX"	 :  "S & P 500",
			"I:SOX"  :  "Semi Index",
			"I:VIX"	 :  "Volatility Index"	
		};
		
		// uncomment this when node integration is done
		/*
		majorIndicesService.getindicesList(function(indicesList){
			
			if(indicesList === "error"){
				
			}
			else{
				for(var key in indicesList){
					majorIndicesListArray.push(indicesList[key]);
				}
				
				majorIndicesList =  majorIndicesListArray.toString();
				
				majorIndicesService.getIndices(majorIndicesList,function(symbolData){
					
					//console.log(symbolData);
					displaySymbolInMajorIndices(symbolData);
					
				});
			}
			
		});
		*/
		
		// comment this when node integration is done
		majorIndicesService.getIndices(majorIndicesList,function(symbolData){
			if(symbolData === "error"){
				alert("error");
			}
			else{
				displaySymbolInMajorIndices(symbolData);
			}
			//alert("indices h");
			mainAppService.loader++;
		});
		
		
		/*
			$.ajax({
			type: "POST",
			headers: AuthenticationManager.getHeaders(), 
			url:Constants.TOMCAT_BASE_URL+"marketIndicatorTickerList.jsp",
			dataType:'json',
			crossDomain: true,
			async: true,
			success: function(data,status){
			console.log("Market indicators Data :  " +  JSON.stringify(data));
			}
			});
		*/
		
	}
	
	var callback=function(message){
		
		var currentObject=JSON.parse(message);
		var symbol = currentObject.T;
		var json ={};
		
		if(currentObject.L){
			json[symbol]={"last" : currentObject.L  };
			displaySymbolInMajorIndices(json);
		}
		
		if(currentObject.C){
			json[symbol]= {"chg" : currentObject.C };
			displaySymbolInMajorIndices(json);
		} 
		
		$scope.$apply();
		
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
	
	var lastValBoundArray=[6,12,18];
	/*
		var getValueBasedOnProperty=function(sym,property){
		if(symbolRank[sym] < lastValBoundArray[0]){
		//console.log($scope.data1[symbolRank[key]]);
		return $scope.data1[symbolRank[sym]][property];
		}
		else if(symbolRank[sym] < lastValBoundArray[1] && symbolRank[sym]>=lastValBoundArray[0]){
		
		return $scope.data2[symbolRank[sym] - lastValBoundArray[0]][property];
		}
		else if(symbolRank[sym] < lastValBoundArray[2] && symbolRank[sym] >= lastValBoundArray[1]){
		
		return $scope.data3[symbolRank[sym] - lastValBoundArray[1]][property];
		
		}
		else{
		
		}
		
		};
		
		var setValueBasedOnProperty=function(sym,property,val){
		if(symbolRank[sym] < lastValBoundArray[0]){
		//console.log($scope.data1[symbolRank[key]]);
		$scope.data1[symbolRank[sym]][property]=val;
		}
		else if(symbolRank[sym] < lastValBoundArray[1] && symbolRank[sym]>=lastValBoundArray[0]){
		
		$scope.data2[symbolRank[sym] - lastValBoundArray[0]][property]=val;
		}
		else if(symbolRank[sym] < lastValBoundArray[2] && symbolRank[sym] >= lastValBoundArray[1]){
		
		$scope.data3[symbolRank[sym] - lastValBoundArray[1]][property]=val;
		
		}
		else{
		
		}
		
		};
	*/
	var displaySymbolInMajorIndices = function(symbolData){
		
		//console.log(symbolData);
		
		for(var key in symbolData){
			
			var json = {symbol : key };
			
			
			//////////////////////////////////////////////////text color 
			if(symbolData[key]["chg"] === undefined){
				
			}
			else if(symbolRank[key] === undefined){
				json.CH = symbolData[key]["chg"];
				json.TextColor = getTextColorChange(symbolData[key]["chg"]);					
			}
			else{
				if(symbolRank[key] < lastValBoundArray[0]){
					$scope.data1[symbolRank[key]].CH = symbolData[key]["chg"];
					$scope.data1[symbolRank[key]].TextColor = getTextColorChange(symbolData[key]["chg"]); 
				}
				else if(symbolRank[key] < lastValBoundArray[1]){
					$scope.data2[symbolRank[key]-lastValBoundArray[0]].CH = symbolData[key]["chg"];
					$scope.data2[symbolRank[key]-lastValBoundArray[0]].TextColor = getTextColorChange(symbolData[key]["chg"]); 
				}
				else if(symbolRank[key] < lastValBoundArray[2]){
					$scope.data3[symbolRank[key]-lastValBoundArray[1]].CH = symbolData[key]["chg"];
					$scope.data3[symbolRank[key]-lastValBoundArray[1]].TextColor = getTextColorChange(symbolData[key]["chg"]); 
				}
				else{
					
				}
			}
			
			
			//////////////////////////////////////////////////up down symbol
			if(symbolData[key]["last"] === undefined){
				
			}
			else if(symbolRank[key] === undefined){
				json.LV = symbolData[key]["last"];
				json.upDown = getUpDownImage(symbolData[key]["last"]);					
			}
			else{
				if(symbolRank[key] < lastValBoundArray[0]){
					$scope.data1[symbolRank[key]].upDown =  getUpDownImage(symbolData[key]["last"] - $scope.data1[symbolRank[key]].LV);
					$scope.data1[symbolRank[key]].LV = symbolData[key]["last"];
				}
				else if(symbolRank[key] < lastValBoundArray[1]){
					$scope.data2[symbolRank[key] - lastValBoundArray[0]].upDown =  getUpDownImage(symbolData[key]["last"] - $scope.data2[symbolRank[key] -lastValBoundArray[0]].LV);
					$scope.data2[symbolRank[key] - lastValBoundArray[0]].LV = symbolData[key]["last"];
				}
				else if(symbolRank[key] < lastValBoundArray[2] ){
					$scope.data3[symbolRank[key] -  lastValBoundArray[1]].upDown =  getUpDownImage(symbolData[key]["last"] - $scope.data3[symbolRank[key] - lastValBoundArray[1]].LV);
					$scope.data3[symbolRank[key] -  lastValBoundArray[1]].LV = symbolData[key]["last"];
				}
				else{
					
				}
			}
			
			////////////////////////////////////////push new json into data source
			
			if(symbolRank[key] == -1 || symbolRank[key] === undefined){
				
				if($scope.data1.length < lastValBoundArray[0]){
					
					majorIndicesService.changeSymbolRank(symbolRank,0,function(symbolRankNew){
						
						symbolRank =  symbolRankNew ;
						symbolRank[key] = 0;
						$scope.data1.unshift(json);
						
						id = socketClient.client.subscribe("/topic/E:"+key, callback);
					});
					
				}	
				else if($scope.data2.length < lastValBoundArray[0]){
					
					majorIndicesService.changeSymbolRank(symbolRank,5,function(symbolRankNew){
						
						symbolRank =  symbolRankNew ;
						symbolRank[key] = 6;
						$scope.data2.unshift(json);
						
						id = socketClient.client.subscribe("/topic/E:"+key, callback);
					});
				}
				else if($scope.data3.length < lastValBoundArray[0]){
					
					majorIndicesService.changeSymbolRank(symbolRank,11,function(symbolRankNew){
						
						symbolRank =  symbolRankNew ;
						symbolRank[key] = 12;
						$scope.data3.unshift(json);
						
						id = socketClient.client.subscribe("/topic/E:"+key, callback);
					});
				}
				else{
					
				}
			}	
			
		};
		
	};
	
	
	
	$scope.getRowClass = function(index){
		
		if(index%2 == 0)
		{
			return "row even";
		} 
		else{ 		
			return "row odd";
		}
		
	}
	
	$scope.getTextColorClassBtn = function(prevClass,value){
		
		return (prevClass + " " + "btn-" + value  + " " + "white");
		
	};
	
	$scope.getTextColorClass = function(prevClass,value){
		
		return (prevClass + " " + value );
		
	};
	
	
	
}]);