angular.module('app').controller('marketIndicatorsController',['$scope','marketIndicatorsService','mainAppService',function($scope,marketIndicatorsService,mainAppService){
	
	/**
			
		Market indicators Data :  {"NYSE ONLY":{"Up Volume":".NUVOL","Down Volume":".NDVOL","CUM Volume":".NTVOL","Advancers":".NADV","Decliners":".NDEC","Unchanged":".NCHG","Issues Up/Down Ratio (NTICK)":".NTICK"},"NYSE Composite":{"Up Volume":".UVOL","Down Volume":".DVOL","CUM Volume":".VOL","Advancers":".ADV","Decliners":".DECL","Unchanged":".UCHG","Issues Up/Down Ratio (TICK)":".TICK","Short Term Trade Index (TRIN)":".TRIN"},"NASDAQ":{"Up Volume":".UVOLQ","Down Volume":".DVOLQ","CUM Volume":".VOLQ","Advancers":".ADVQ","Decliners":".DECLQ","Unchanged":".UCHGQ","Issues Up/Down Ratio (TIKQ)":".TICKQ","Short Term Trade Index (TRINQ)":".TRINQ"},"AMEX":{"UP Volume":".UVOLA","Down Volume":".DVOLA","CUM Volume":".VOLA","Advancers":".ADVA","Decliners":".DECLA","Unchanged":".UCHGA"},"DJIA":{"Issues Advance/Decline Ratio":".TICKI"}}	
	
	*/
	
		
	/**
	<tr ng-repeat="(key, value) in data">
		<td> {{key}} </td> <td> {{ value }} </td>	
	</tr>
	*/
	
	$scope.NYSE_ONLY={};
	$scope.NYSE_Composite={};
	$scope.NASDAQ={};
	$scope.AMEX ={};
	$scope.DJIA ={};
	var marketIndicatorsMappingJson = {};
	var marketIndicatorsMappingJsonWithLABEL = {};

	$scope.init = function(){
		
	//	$(".top-holdings-module").niceScroll({cursorborder:"",cursorcolor:"grey"});
		$(".market-data-module").niceScroll({cursorborder:"",cursorcolor:"grey",horizrailenabled:false});
		
		marketIndicatorsService.getIndicatorsList(function(indicatorsList){
			
			console.log(indicatorsList);
			
			for(var key in indicatorsList){
				
				setMappingForMarketIndicators(key,indicatorsList[key])
					
			}
			
			
		});
		
	};	
		
	var val = 0;		
	var callback=function(message){
		
		var currentObject=JSON.parse(message);
		//currentObject = {T:".NUVOL",L:123236}
		if(currentObject.T === undefined  || currentObject.L === undefined){
			
		}
		else{
			
			var symbol = currentObject.T;
			//  console.log(currentObject);
	
			if(currentObject.L){
				mainAppService.numberWithCommas(currentObject.L,function(value){
					displaySymbolInMarketIndicators(symbol,value);	
				})
			}
				
		}
		
	
		$scope.$apply();
		
	};
	
	
	
	
	var displaySymbolInMarketIndicators = function(key,value){
				
		switch(marketIndicatorsMappingJsonWithLABEL[key]){
			
			case "NYSE ONLY" : {
			
				$scope.NYSE_ONLY[marketIndicatorsMappingJson[key]] =  value;
				break;
			}
			case "NYSE Composite" : {
				
				$scope.NYSE_Composite[marketIndicatorsMappingJson[key]] =  value;	
				break;
			}
			case "NASDAQ" : {
				$scope.NASDAQ[marketIndicatorsMappingJson[key]] =  value;
				break;
			}
			case "AMEX"	: {
				$scope.AMEX[marketIndicatorsMappingJson[key]] =  value;
				break;
			}
			case "DJIA" : {
				$scope.DJIA[marketIndicatorsMappingJson[key]] =  value;
				break;
			}
			default : {
				
			} 
		
		}
				
	};
	
	
	var setMappingForMarketIndicators = function(key,indicatorsData){
		for(var id in indicatorsData){	
			marketIndicatorsMappingJson[indicatorsData[id]] 				= id;
			marketIndicatorsMappingJsonWithLABEL[indicatorsData[id]] 		= key;
			
			id = socketClient.client.subscribe("/topic/E:"+indicatorsData[id], callback);	
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
	
	}
	
	
}]);