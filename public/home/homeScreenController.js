angular.module('app').controller('homeScreenController',['$scope','mainAppService',function($scope,mainAppService){
	
	$scope.init = function(){
		//$('#spinner').show();
		$scope.view = "majorIndices";
		
		mainAppService.loader = 0;
		$('#spinner').show();
	};
	 
	$scope.changeViewVal = function(val){
		$scope.view = val;
	}; 
	 
	$('ul.tab-list li').on('click', function(){
		$('ul.tab-list li.active').removeClass('active');
		$(this).addClass('active');
	}); 
	 
	$scope.$watch(function() { return mainAppService.loader },
		function(newValue, oldValue) {
			//alert(newValue);
			
			if(newValue%3 == 0){
				$('#spinner').css('display','none');
				console.log("all set");							
			}				
		}
    );
	
}]);