angular.module('app').controller('mainAppController',['$scope','$rootScope','mainAppService','$location',function($scope,$rootScope,mainAppService,$location){
		
	
		
	$scope.init =  function(){
		$rootScope.mainDataSource = {};	
		$rootScope.symbolsWithCompNames =  symbolsWithCompNames;
		mainAppService.setLoginValue(false);
		$location.path('/Home');
		
	};
	
	$scope.$watch(function() { return mainAppService.loginVal },
		function(newValue, oldValue) {
			$scope.loginVal = newValue;
		}
    );
	
	
	/*
	
	$scope.$on('$locationChangeStart', function(event) {
			//alert('routing changed');
			$('#textContainer').hide();
		//	$scope.$apply();
			mainAppService.unSubscribeAllSubscribedSymbols();
	});
	*/
	/**
	window.onbeforeunload=function(){
		alert('as');
		$route.reload();
		//return 'Are you sure you want to exit?';
	}*/
}]);