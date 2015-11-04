$.support.cors = true;
var AuthenticationManager={

	UID:"",
    sessionID:"",
	state:"",
	type:"OR",
	serverURL:Constants.TOMCAT_BASE_URL,
	hitState:true,
	getHeaders:function(){
		
		var headers = {
				"ENVIRONMENT": Constants.ENVIRONMENT,
				"VERSION":Constants.VERSION,
				"DEVICE":Constants.DEVICE,
				"DEVICEID":Constants.DEVICEID				
		};
		
		if(sessionStorage.getItem("UID") != undefined && sessionStorage.getItem("UID") != null){
			headers.USERID = sessionStorage.getItem("UID");
		}
		if(sessionStorage.getItem("TOKEN") != undefined && sessionStorage.getItem("TOKEN") != null){
			headers["TOKEN"] = sessionStorage.getItem("TOKEN");
		}
		console.log(headers);
		return headers;
	}
}