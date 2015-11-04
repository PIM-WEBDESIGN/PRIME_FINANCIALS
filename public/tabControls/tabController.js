angular.module('app').controller('tabController',['$scope','$timeout','tabService',function($scope,$timeout,tabService){
	
	$scope.init =  function(){
		$scope.homeDivViewer = true;
		$scope.researchDivViewer = false;
		$scope.theme = "Select Theme";	
		tabService.activeTheme = "black";	
		tabService.ticksColor = "white";
	//	tabService.pieColorArray = tabService.pieDonutColorArray[tabService.activeTheme]
		tabService.cmfColorArray = tabService.blackTheme["cmfColorArray"];
		tabService.hlcColorArray = tabService.blackTheme["hlcColorArray"];
		tabService.powerGauageColorArray = tabService.blackTheme["powerGauageColorArray"];
	};
	
	// $('.selectpicker').change(function(){
	  $scope.changeTheme = function(val,css){	
		if(val == "white"){
			$scope.theme = "Light Ray";
			tabService.activeTheme = "white";
			tabService.ticksColor = "black";
		//	tabService.pieColorArray = tabService.pieDonutColorArray[tabService.activeTheme]
			tabService.cmfColorArray = tabService.whiteTheme["cmfColorArray"];
			tabService.hlcColorArray = tabService.whiteTheme["hlcColorArray"];
			tabService.powerGauageColorArray = tabService.whiteTheme["powerGauageColorArray"];  	
		 }
		 else{
			$scope.theme = "Dark Horse";
			tabService.activeTheme = "black";	
			tabService.ticksColor = "white";
		//	tabService.pieColorArray = tabService.pieDonutColorArray[tabService.activeTheme]
			tabService.cmfColorArray = tabService.blackTheme["cmfColorArray"];
			tabService.hlcColorArray = tabService.blackTheme["hlcColorArray"];
			tabService.powerGauageColorArray = tabService.blackTheme["powerGauageColorArray"];		 
		}
		
		 $('#theme').attr('href',css);
		 $scope.$broadcast('researchDivInit');
		 $scope.$broadcast('themeChanged');
		 $scope.$apply();
	 };
	
	$scope.changeView = function(value){
		
		$('.nav-tabs li').removeClass('active');
			
		if(value == "homeDivViewer"){
			$scope.homeDivViewer = true;
			$scope.researchDivViewer = false;
			$scope.portfolioDivViewer = false;
			$scope.instrumentDetails =  false;
			$scope.screening =  false;
			$('#textContainer').css('display','none')
			
			$($('.nav-tabs').find('li')[0]).addClass('active');
				
			$timeout(function(){
				$scope.$broadcast('homeDivInit');	
			},100);	
			
		}
		else if(value == "researchDivViewer"){
			
			
			$scope.homeDivViewer = false;
			$scope.researchDivViewer = true;
			$scope.portfolioDivViewer = false;
			$scope.instrumentDetails =  false;
			$scope.screening =  false;
			$('#textContainer').css('display','block') // Its for safari 
			
			$($('.nav-tabs').find('li')[1]).addClass('active');
			
			$timeout(function(){
				$scope.$broadcast('researchDivInit');	
			},100);
		}
		else if(value == "portfolioDivViewer"){
			$scope.homeDivViewer = false;
			$scope.researchDivViewer = false;
			$scope.portfolioDivViewer = true;
			$scope.instrumentDetails =  false;
			$scope.screening =  false;
			$($('.nav-tabs').find('li')[2]).addClass('active');
			
			$timeout(function(){
				$scope.$broadcast('portfolioDivInit');	
			},100);
		}
		else if(value == "instrumentDetails"){
			$scope.homeDivViewer = false;
			$scope.researchDivViewer = false;
			$scope.portfolioDivViewer = false;
			$scope.instrumentDetails =  true;
			$scope.screening =  false;
			$($('.nav-tabs').find('li')[3]).addClass('active');
		}
		else if(value == "screening"){
			$scope.homeDivViewer = false;
			$scope.researchDivViewer = false;
			$scope.portfolioDivViewer = false;
			$scope.instrumentDetails =  false;
			$scope.screening =  true;
			$($('.nav-tabs').find('li')[4]).addClass('active');
		}
		else{
		
		}
	};
	
	
	
	
	
}]);