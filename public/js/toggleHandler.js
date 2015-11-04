
    
	var divState = ["accordion-collapsed","accordion-mid","accordion-full"];
	var topCustomersState =  divState[1];
	var alertListState	 = 	divState[1];
	
	var topCustomerContainer = ('.top-customers-list');
	var alertListContainer = ('.alerts-list');
	
	
	$('#topCustomersBar').on('click',function(e){

		alert("hspace");
		if(alertListState == divState[0]){	
			//topCustomersState = divState[2];
			addClassToTopHoldings(divState[2]);
		}
		else if(alertListState == divState[1]){
			if(topCustomersState  == divState[0]){
				//topCustomersState = divState[1];
				addClassToTopHoldings(divState[1]);
			}
			else{
				//topCustomersState = divState[0];
				addClassToTopHoldings(divState[0]);
				
				//alertListState    = divState[2];
				addClassToAlerts(divState[2]);
			}
		}
		else{
			//topCustomersState == divState[1];
			addClassToTopHoldings(divState[1]);
		}
	});
	
	$('#alertsBar').on('click',function(){
		alert("hspacsasaae");
		if(alertListState == divState[0]){	
			//alertListState = divState[2];
			addClassToAlerts(divState[2]);
		}
		else if(alertListState == divState[1]){
			if(alertListState  == divState[0]){
				//alertListState = divState[1];
				addClassToAlerts(divState[1]);
			}
			else{
				//alertListState = divState[0];
				addClassToAlerts(divState[0]);
				
				//topCustomersState    = divState[2];
				addClassToTopHoldings(divState[2]);
			}
		}
		else{
			//alertListState == divState[1];
			addClassToAlerts(divState[1]);
		
		}
		
	});	
	
	var addClassToTopHoldings = function(addClass){
		
		$(topCustomerContainer).add('.' + addClass);
		topCustomersState =  addClass;
	}
	
	var addClassToAlerts = function(){
		
		$(alertListConatainer).add('.' + addClass);
		alertListState	= addClass;		
	}
	
