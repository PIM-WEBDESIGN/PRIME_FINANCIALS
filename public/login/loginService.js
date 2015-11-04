angular.module('app').service('loginService',['$http','mainAppService',function($http,mainAppService){
	
	//ipadtest2
	this.authenticate = function(username,password,callback){		
		
		//EMPTY THE OLD SESSION ID & TOKEN
		sessionStorage.removeItem("UID");
		sessionStorage.removeItem("TOKEN");
		$.ajax({
			type: "POST",
			crossDomain: true,
			async:false,
			url:apiManager.http + apiManager.authentication,  
			dataType:'json',
			data : {"email":username,"password":password},
			success: function(data){
				
				console.log("data is : %o",data);
				
				if(data.status == "SUCCESS"){
					var entitlements = data.entitlements;
					mainAppService.userID = data.prime_user_id;
					console.log(data);
					if(entitlements.isLogin && AuthenticationManager.hitState){
						AuthenticationManager.hitState=false;
						AuthenticationManager.UID=entitlements.userID;
						sessionStorage.setItem("UID",entitlements.userID);
						sessionStorage.setItem("TOKEN",entitlements.TOKEN);	
					}
					callback();
				}
			},
			error: function(request, status, error){
				alert("UNABLE TO AUTHENTICATE USER,TRY AGAIN");
			}
		});	
		
	};
	
	
}]);  



