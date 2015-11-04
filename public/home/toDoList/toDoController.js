angular.module('app').controller('toDoController',['$scope',function($scope){
	
	var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	var weekDayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	
	
	$scope.init = function(){
			
		
		var date = new Date();
		var day = date.getDate();
		var dayName = weekDayNames[date.getDay()];
		var month =  monthNames[date.getMonth()];
		
		
		$scope.monthName 	= month;
		$scope.monthDay 	= day ;
		$scope.weekDayName  = dayName;
		
	}
	
}])	