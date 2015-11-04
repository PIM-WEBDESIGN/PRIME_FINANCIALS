angular.module('app').controller('loginController',['$scope','loginService','mainAppService',function($scope,loginService,mainAppService){
	
	
	$scope.init = function(){
		
		if(sessionStorage.isRemember =="true" && sessionStorage.login == "true"){
			console.log("sessionStorage.username  : " + sessionStorage.username + "sessionStorage.password : " + sessionStorage.password);
			$scope.username = sessionStorage.username;
			$scope.password = sessionStorage.password;
			$scope.rememberMeCheck = true;	
		}
		else{
			$scope.loginVal = mainAppService.loginVal;
			$scope.rememberMeCheck = false;
		}
		
		
	}
	
	$scope.checkLogin = function(){
		var username =  $scope.username;
		var password  = $scope.password;
		
		
		loginService.authenticate(username,password,function(){
			sessionStorage.login = true;
			// connecting client
			socketClient.createWebSocketViaStomp(function(){	
				mainAppService.setLoginValue(true);	
				$scope.$apply();
				sessionStorage.isRemember = $scope.rememberMeCheck;
				if(sessionStorage.isRemember == "true"){
					sessionStorage.username = username;
					sessionStorage.password = password;
				}
			});
		});
	};
	
}]);