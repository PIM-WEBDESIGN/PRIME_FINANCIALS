
var socketClient  = {
		client : "",
		createWebSocketViaStomp : function(callbackForLogin){
			
			var url = Constants.WEB_SOCKET_BASE_URL;
			//var url="ws://india.paxcel.net:7001/jms";
		    //var stompstring  = "ws://"+window.location.host+"/stomp";
            //var url = stompstring.replace("8787","61614");
			
			var un = Constants.WEB_SOCKET_USRENAME;
			var pw = Constants.WEB_SOCKET_PASSWORD;
			
			var onconnect = function(){
				callbackForLogin();
			};
			
			
			//id = client.subscribe("/topic/"+"AAPL", callback);
			//id = client.subscribe("/topic/"+"GOOG", callback);
			
			var onerror = function(e){
				alert("STOMP error while connecting : " + e.data);
			}
			
			socketClient.client = Stomp.client(url);
			//console.log("Creating Socket Channel" + JSON.stringify(client));
			socketClient.client.connect(un,pw,onconnect,onerror);
			//PortfolioManager.scope_l.client1 = client;
			
			socketClient.client.debug = function(str) {
				
			}
		},
		
		callback : function(message){
			
			console.log(message);	
		}
} 			