$.support.cors = true;

angular.module('app').controller('topCustomersController',['$scope','topCustomersService',function($scope,topCustomersService){
	
	$scope.init = function(){
		
		$(".top-customers-list").niceScroll({cursorborder:"",cursorcolor:"grey"});
		
	//	$scope.topCustomers = ["Pepsi","Coke","Apple","Google","Sony"]; 
		$scope.topCustomers = [{"name" : "John Dodd Family" , "value" : "$15,130,000"} ,{"name" : "Kimberly Williams" , "value" : "$13,350,000"},{"name" : "Michael Cohan" , "value" : "$12,500,000"} ]; 

		/*
		  $.ajax({
		  
            crossDomain: true,
            type:"GET",
            contentType: "application/json",
           	url: 'https://na1.salesforce.com/services/data/',                
			success: function() { alert("Success"); },
			error: function() { alert('Failed!'); }
        });
		*/
	}

}]);