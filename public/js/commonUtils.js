var commonUtils = {

		setSnapQuoteDataForHome:function(sym,symbolData,orgSym)
		{
		
		var lp = symbolData.last;
		var ch = symbolData.chg;
		var perCh = symbolData.perChg;
		var ltt = symbolData.ltt;
		var vwap = symbolData.vwap;
		var high = symbolData.high;
		var low = symbolData.low;				
		var lc = symbolData.lastClosed;
		var lastTradeDate = symbolData.lastTradeDate;
		var nd = symbolData.nd;
		var ni = symbolData.ni;
		var ns = symbolData.ns;
		
			perCh=window.parseFloat((ch/lp)*100).toFixed(2);
			
			portfolioSnapDataHandler.assignRespectiveColorToComp(sym,window.parseFloat(ch),1);
			try{
			$("#"+sym+"_lp").parent().parent().css('opacity','1');
			$("#"+sym+"_lp").val(lp);
			if(window.parseFloat(ch)>0.0)
			{
		     $("#"+sym+"_ch").css('color','#03ea03');
			}
			else
			{
		    $("#"+sym+"_ch").css('color','red');
			}
			$("#"+sym+"_ch").val(ch);
			}
			catch(err){


			}
   //  alert(orgSym);
		if(PortfolioManager.scope_l.data[orgSym]==null){

				PortfolioManager.scope_l.data[orgSym]={LV:lp,CH:ch,PERCH:perCh,OPEN:'-',COLCLASS:'white',LTT:"",LTV:"",VOL:symbolData.vol,
					ASK:symbolData.ask,BID:symbolData.bid,VWAP:"",HIGH:high,LOW:low,ASKEXCHG:"",BIDEXCHG:"",ISHALT:symbolData.isHalt,UDCLS:'noClass',indiClass:'noClass'};
			}
				if(parseInt(lp)>1000000){
					lp = (parseInt(lp)/1000000).toFixed(2)+"M";
				}
				
				PortfolioManager.scope_l.data[orgSym].ASK_EXCHANGE=symbolData.askExchg;
				PortfolioManager.scope_l.data[orgSym].BID_EXCHANGE=symbolData.bidExchg;
				PortfolioManager.scope_l.data[orgSym].MARKET_CENTER=symbolData.marketCenter;
				PortfolioManager.scope_l.data[orgSym].LV=lp;
				
				
			    var chgSign;
				var chNum = Number(ch);
				//chgSign = (chNum>0)?"+":((chNum<0)?"":"");
				
				chgSign = (chNum>0)?"+":"";
				
				PortfolioManager.scope_l.data[orgSym].CH = chgSign+ch;
				PortfolioManager.scope_l.data[orgSym].CHG = chgSign+ch;
				
				var perChNum = Number(perCh);
				//chgSign = (perChNum>0)?'+':((perChNum<0)?'-':'');
				chgSign = (perChNum>0)?'+':'';
				
				/*
				PortfolioManager.scope_l.data[orgSym].CH = ch;
				PortfolioManager.scope_l.data[orgSym].CHG = ch;
				PortfolioManager.scope_l.data[orgSym].PERCH = perCh;
				*/
				PortfolioManager.scope_l.data[orgSym].PERCH = chgSign+perCh;
				PortfolioManager.scope_l.data[orgSym].OPEN=symbolData.open;
				PortfolioManager.scope_l.data[orgSym].COLCLASS=(ch==0)?'white':((ch>0)?'posGreen':'negRed');
				
				PortfolioManager.scope_l.data[orgSym].LTV=symbolData.ltv;
				PortfolioManager.scope_l.data[orgSym].VOL=symbolData.vol;
				PortfolioManager.scope_l.data[orgSym].ASK=symbolData.ask;
				PortfolioManager.scope_l.data[orgSym].BID=symbolData.bid;
				if(vwap!="null")
					PortfolioManager.scope_l.data[orgSym].VWAP=vwap;
				PortfolioManager.scope_l.data[orgSym].HIGH=high;
				PortfolioManager.scope_l.data[orgSym].LOW=low;
				PortfolioManager.scope_l.data[orgSym].S=symbolData.s;
				PortfolioManager.scope_l.data[orgSym].a=symbolData.s.split('x')[0];
				PortfolioManager.scope_l.data[orgSym].b=symbolData.s.split('x')[1];
				
				if(commonUtility.setDetailQuotes(orgSym)['symbolType'] == 'future' && lc>0){
					PortfolioManager.scope_l.data[orgSym].PC1=lc;
				}
				else{
					PortfolioManager.scope_l.data[orgSym].PC=lc;
				}
				
				PortfolioManager.scope_l.data[orgSym].SP=symbolData.settlementPrice;
				
				if(symbolData.isHalt == 'T')
				PortfolioManager.scope_l.data[orgSym].HALT='H';
				else
				PortfolioManager.scope_l.data[orgSym].HALT='';
				
				
				if(ch>0){
					PortfolioManager.scope_l.data[orgSym].UDCLS='upClass';
					PortfolioManager.scope_l.data[orgSym].indiClass='test_pos';			
				}
				else if(ch<0){
					PortfolioManager.scope_l.data[orgSym].UDCLS='downClass';
					PortfolioManager.scope_l.data[orgSym].indiClass='test_neg';
				}
				
				if(lastTradeDate!="null" && lastTradeDate.trim().length>0){
					var lastTradeDateString = lastTradeDate.substring(0,4)+"/"+lastTradeDate.substring(4,6)+"/"+lastTradeDate.substring(6,8);
					var date = commonUtility.getCurrentDateInEST();
						
					var todayDate = date.getFullYear() +'/'+ ("0" + (date.getMonth() + 1)).slice(-2) +'/'+ ("0" + date.getDate()).slice(-2);
					var lastTradeDateObj=new Date(lastTradeDateString);
					
					if(lastTradeDateString == todayDate && ltt.trim().length>0)
					{
						var lttStr = ltt.substring(0,2)+":"+ltt.substring(2,4)+":"+ltt.substring(4,6);
						PortfolioManager.scope_l.data[orgSym].LTT=lttStr;					
					}
					else
					{
						var lastTradeDateString1 = lastTradeDate.substring(4,6)+"/"+lastTradeDate.substring(6,8)+"/"+lastTradeDate.substring(2,4);					
						PortfolioManager.scope_l.data[orgSym].LTT=lastTradeDateString1;
					}
				}
				
				if(nd!=undefined && ni!=undefined && ns!=undefined){
						PortfolioManager.scope_l.data[orgSym].N='N';	
						PortfolioManager.scope_l.data[orgSym].ND=nd;		
						PortfolioManager.scope_l.data[orgSym].NID=ni;
						if(ns.length==0){
							//ns = "''";
							ns="N";
							PortfolioManager.scope_l.data[orgSym].NS=ns;	
						}
						else{
							PortfolioManager.scope_l.data[orgSym].NS=ns;	
						}	
						
			  }
			
			PortfolioManager.scope_l.$apply();
			if(snapObj.statusPer<90){
				snapObj.statusPer=window.parseInt(snapObj.statusPer)+2;
				$("#status").html("Portfolio loading process.."+snapObj.statusPer+"% completed...");
			}
			else
			{
				$("#status").hide("slide",{ direction: "up" },800);
			}
	
		},
		
setDetailQuoteDataForHome : function(symData, realSym){

	    //console.log("PortfolioManager.scope_dq :: "+PortfolioManager.scope_dq);
		var i=1;
		
	for (key in symData) {
			var newData=symData[key];
			for (key2 in newData) {
			try{
			
			PortfolioManager.scope_l.data[realSym][key2.toString().toUpperCase()] = newData[key2];
			switch(key2.toString().toUpperCase()){
				case 'SHOUT':
					eval('PortfolioManager.scope_l.data["'+realSym+'"].MCAP'+'="'+commaSeparateNumber(window.parseFloat(PortfolioManager.scope_l.data[realSym].LV*newData[key2]).toFixed(2))+'"');
				break;
				case 'EPS':
					eval('PortfolioManager.scope_l.data["'+realSym+'"].PE'+'="'+window.parseFloat(PortfolioManager.scope_l.data[realSym].LV/newData[key2]).toFixed(2)+'"');
				break;
				case 'DIV':
					eval('PortfolioManager.scope_l.data["'+realSym+'"].YIELD'+'="'+window.parseFloat(newData[key2]/PortfolioManager.scope_l.data[realSym].LV).toFixed(2)*100+'"');
				break;
				case 'AV30DAY':
				{
					if(newData[key2] != undefined && newData[key2]!="N/A"){
						
						var AV30DAYStrArray = newData[key2].split(",");
						var count = 0;
						var actualAV30DAY = 0;
						for(var j = AV30DAYStrArray.length-1;j>=0;j--){
						 actualAV30DAY = actualAV30DAY + parseInt(AV30DAYStrArray[j])*Math.pow(10,count);
						 count=count+3;
						}
						eval('PortfolioManager.scope_l.data["'+realSym+'"].AV30DAY'+'='+actualAV30DAY+'');
						
						// calculating vol pecentage
						var volValue = PortfolioManager.scope_l.data[realSym].VOL;
						var volString;
						var volInt;
						if(volValue!=null){
							volString = volValue.toString().replace(/,/g , "");
							volInt = parseInt(volString);
						}
						
						if(volInt != undefined && actualAV30DAY>0){
							eval('PortfolioManager.scope_l.data["'+realSym+'"].PERVOL'+'='+(volInt*100/actualAV30DAY).toFixed(2)+'');
						}

					}
				}
				break;
				
				case 'F.DIV':
				{
					var lastPrice = PortfolioManager.scope_l.data[realSym].LV;
					var yieldInString = getYieldValue(newData[key2], lastPrice); 
					if(yieldInString!=null && yieldInString.length>0)
					PortfolioManager.scope_l.data[realSym][key2.toString().toUpperCase()] = newData[key2]+"("+yieldInString+")"; 
				}
				break;
				
				case 'T.DIV':
				{
					var lastPrice = PortfolioManager.scope_l.data[realSym].LV;
					var yieldInString = getYieldValue(newData[key2], lastPrice);
					if(yieldInString!=null && yieldInString.length>0)
					PortfolioManager.scope_l.data[realSym][key2.toString().toUpperCase()] = newData[key2]+"("+yieldInString+")"; 
				}
				break;
			  }
			
			  PortfolioManager.scope_l.$apply();
			}
			catch(error){
				i=10;
			}
			
			$('#DQdiv').css('opacity',.1*i);
			i++;
			}
	}
},

/*
setDetailQuoteDataForHome : function(Symdata, realSym){

	    console.log("PortfolioManager.scope_dq :: "+PortfolioManager.scope_dq);
		var i=1;
		
	for (key in Symdata) {
			var newData=Symdata[key];
			for (key2 in newData) {
			try{
			
			PortfolioManager.scope_dq.dataDq[realSym][key2.toString().toUpperCase()] = newData[key2];
			switch(key2.toString().toUpperCase()){
				case 'SHOUT':
					eval('PortfolioManager.scope_dq.dataDq["'+realSym+'"].MCAP'+'="'+commaSeparateNumber(window.parseFloat(PortfolioManager.scope_dq.dataDq[realSym].LV*newData[key2]).toFixed(2))+'"');
				break;
				case 'EPS':
					eval('PortfolioManager.scope_dq.dataDq["'+realSym+'"].PE'+'="'+window.parseFloat(PortfolioManager.scope_dq.dataDq[realSym].LV/newData[key2]).toFixed(2)+'"');
				break;
				case 'DIV':
					eval('PortfolioManager.scope_dq.dataDq["'+realSym+'"].YIELD'+'="'+window.parseFloat(newData[key2]/PortfolioManager.scope_dq.dataDq[realSym].LV).toFixed(2)*100+'"');
				break;
				case 'AV30DAY':
				{
					if(newData[key2] != undefined && newData[key2]!="N/A"){
						
						var AV30DAYStrArray = newData[key2].split(",");
						var count = 0;
						var actualAV30DAY = 0;
						for(var j = AV30DAYStrArray.length-1;j>=0;j--){
						 actualAV30DAY = actualAV30DAY + parseInt(AV30DAYStrArray[j])*Math.pow(10,count);
						 count=count+3;
						}
						eval('PortfolioManager.scope_dq.dataDq["'+realSym+'"].AV30DAY'+'='+actualAV30DAY+'');
						
						// calculating vol pecentage
						var volValue = PortfolioManager.scope_dq.dataDq[realSym].VOL;
						var volString;
						var volInt;
						if(volValue!=null){
							volString = volValue.toString().replace(/,/g , "");
							volInt = parseInt(volString);
						}
						
						if(volInt != undefined && actualAV30DAY>0){
							eval('PortfolioManager.scope_dq.dataDq["'+realSym+'"].PERVOL'+'='+(volInt*100/actualAV30DAY).toFixed(2)+'');
						}

					}
				}
				break;
				
				case 'F.DIV':
				{
					var lastPrice = PortfolioManager.scope_dq.dataDq[realSym].LV;
					var yieldInString = getYieldValue(newData[key2], lastPrice); 
					if(yieldInString!=null && yieldInString.length>0)
					PortfolioManager.scope_dq.dataDq[realSym][key2.toString().toUpperCase()] = newData[key2]+"("+yieldInString+")"; 
				}
				break;
				
				case 'T.DIV':
				{
					var lastPrice = PortfolioManager.scope_dq.dataDq[realSym].LV;
					var yieldInString = getYieldValue(newData[key2], lastPrice);
					if(yieldInString!=null && yieldInString.length>0)
					PortfolioManager.scope_dq.dataDq[realSym][key2.toString().toUpperCase()] = newData[key2]+"("+yieldInString+")"; 
				}
				break;
			  }
			
			PortfolioManager.scope_dq.$apply();
			}
			catch(error){
				i=10;
			}
			
			$('#DQdiv').css('opacity',.1*i);
			i++;
			}
	}
},
*/
setSnapDataForOptionStream : function(sym, data1, orgSym){

					if(data1!= undefined){
					
					var perCh=window.parseFloat((data1.chg/data1.last)*100).toFixed(2);
				
					if(optionSnapObj.$scopeObj.data[orgSym]==null){
								optionSnapObj.$scopeObj.data[orgSym]={LV:data1.last,CH:data1.chg,PERCH:perCh,OPEN:'-',COLCLASS:'white',LTT:data1.ltt,LTV:data1.ltv,VOL:data1.vol,
								ASK:data1.ask,BID:data1.bid,VWAP:data1.vwap,HIGH:data1.high,LOW:data1.low,UDCLS:'noClass',indiClass:'noClass'};
								
							}
						optionSnapObj.$scopeObj.data[orgSym].ASK_EXCHANGE=data1.askExchg;
						optionSnapObj.$scopeObj.data[orgSym].BID_EXCHANGE=data1.bidExchg;
						optionSnapObj.$scopeObj.data[orgSym].MARKET_CENTER=data1.marketCenter;
						optionSnapObj.$scopeObj.data[orgSym].LV=data1.last;
						sessionStorage["lastValue"] = data1.last;
						
						var chgSign;
						var chNum = Number(data1.chg);
						//chgSign = (chNum>0)?"+":((chNum<0)?"-":"");
						chgSign = (chNum>0)?"+":"";
						optionSnapObj.$scopeObj.data[orgSym].CH = chgSign+(data1.chg);
						optionSnapObj.$scopeObj.data[orgSym].CHG = chgSign+(data1.chg);
						
						var perChNum = Number(perCh);
						//chgSign = (perChNum>0)?'+':((perChNum<0)?'-':'');
						
						chgSign = (perChNum>0)?'+':'';
						optionSnapObj.$scopeObj.data[orgSym].PERCH = chgSign+perCh;
						/*
						optionSnapObj.$scopeObj.data[orgSym].CH=data1.chg;
						optionSnapObj.$scopeObj.data[orgSym].CHG=data1.chg;
						optionSnapObj.$scopeObj.data[orgSym].PERCH=perCh;
						*/
						optionSnapObj.$scopeObj.data[orgSym].SP=data1.settlementPrice;
						optionSnapObj.$scopeObj.data[orgSym].OPEN=data1.open;
						optionSnapObj.$scopeObj.data[orgSym].COLCLASS=(data1.chg==0)?'white':((data1.chg>0)?'posGreen':'negRed');
						//SUBSCRIBE TO STOCK FOR STREAMING AFTER SANP HIT
						optionSnapObj.$scopeObj.data[orgSym].LTV=data1.ltv;
						optionSnapObj.$scopeObj.data[orgSym].VOL=data1.vol;
						optionSnapObj.$scopeObj.data[orgSym].ASK=data1.ask;
						optionSnapObj.$scopeObj.data[orgSym].BID=data1.bid;
						optionSnapObj.$scopeObj.data[orgSym].VWAP=data1.vwap;
						optionSnapObj.$scopeObj.data[orgSym].HIGH=data1.high;
						optionSnapObj.$scopeObj.data[orgSym].LOW=data1.low;
						optionSnapObj.$scopeObj.data[orgSym].S=data1.s;
						
						if(commonUtility.setDetailQuotes(sym)['symbolType'] == 'future' && data1.lastClosed>0){
							optionSnapObj.$scopeObj.data[orgSym].PC1=data1.lastClosed;
						}
						else{
							optionSnapObj.$scopeObj.data[orgSym].PC=data1.lastClosed;
						}
						
						var lastTradeDate = data1.lastTradeDate;
						var ltt = data1.ltt;
						// for last trade Date
					if(lastTradeDate!="null" && lastTradeDate.trim().length>0){
					var lastTradeDateString = lastTradeDate.substring(0,4)+"/"+lastTradeDate.substring(4,6)+"/"+lastTradeDate.substring(6,8);
					
					var date = commonUtility.getCurrentDateInEST();
						
					var todayDate = date.getFullYear() +'/'+ ("0" + (date.getMonth() + 1)).slice(-2) +'/'+ ("0" + date.getDate()).slice(-2);
					var lastTradeDateObj=new Date(lastTradeDateString);
					
					if(lastTradeDateString == todayDate && ltt.trim().length>0)
					{
						var lttStr = ltt.substring(0,2)+":"+ltt.substring(2,4)+":"+ltt.substring(4,6);
						optionSnapObj.$scopeObj.data[orgSym].LTT=lttStr;					
					}
					else
					{
						var lastTradeDateString1 = lastTradeDate.substring(4,6)+"/"+lastTradeDate.substring(6,8)+"/"+lastTradeDate.substring(2,4);					
						optionSnapObj.$scopeObj.data[orgSym].LTT=lastTradeDateString1;
					}
				}
				
				if(data1.isHalt == 'T')
					optionSnapObj.$scopeObj.data[orgSym].HALT='H';
				else
					optionSnapObj.$scopeObj.data[orgSym].HALT='';
				
				// for news field
				var nd = data1.nd;
				var ni = data1.ni;
				var ns = data1.ns;
				
				if(nd!=undefined && ni!=undefined && ns!=undefined){
					
						optionSnapObj.$scopeObj.data[orgSym].ND=nd;		
						optionSnapObj.$scopeObj.data[orgSym].NID=ni;
						if(ns.length==0){
							ns = "''";
							optionSnapObj.$scopeObj.data[orgSym].NS=ns;	
						}
						else{
							optionSnapObj.$scopeObj.data[orgSym].NS=ns;	
						}	
						
			  }
					optionSnapObj.$scopeObj.$apply();
					}

},

setDetailDataForOptionStream : function(data, orgSym){

				
				    var i=1;
					for(key in data) {
						
						var newData=data[key];
						
						for (key2 in newData) {
						
						try{
						
						optionSnapObj.$scopeObj.data[orgSym][key2.toString().toUpperCase()] = newData[key2];
						
						switch(key2.toString().toUpperCase()){
							case 'SHOUT':
							eval('optionSnapObj.$scopeObj.data["'+orgSym+'"].MCAP'+'="'+commaSeparateNumber(window.parseFloat(optionSnapObj.$scopeObj.data[orgSym].LV*newData[key2]).toFixed(2))+'"');
							break;
							case 'EPS':
							eval('optionSnapObj.$scopeObj.data["'+orgSym+'"].PE'+'="'+window.parseFloat(optionSnapObj.$scopeObj.data[orgSym].LV/newData[key2]).toFixed(2)+'"');
							break;
							case 'DIV':
							eval('optionSnapObj.$scopeObj.data["'+orgSym+'"].YIELD'+'="'+window.parseFloat(newData[key2]/optionSnapObj.$scopeObj.data[orgSym].LV).toFixed(2)*100+'"');
							break;
							
							case 'AV30DAY':
							{
								if(newData[key2] != undefined && newData[key2]!="N/A"){
									
									var AV30DAYStrArray = newData[key2].split(",");
									var count = 0;
									var actualAV30DAY = 0;
									for(var j = AV30DAYStrArray.length-1;j>=0;j--){
										actualAV30DAY = actualAV30DAY + parseInt(AV30DAYStrArray[j])*Math.pow(10,count);
										count=count+3;
									}
										eval('optionSnapObj.$scopeObj.data["'+orgSym+'"].AV30DAY'+'='+actualAV30DAY+'');
										
										// calculating vol pecentage
										var volValue = optionSnapObj.$scopeObj.data[orgSym].VOL;
										var volString;
										var volInt;
										if(volValue!=null){
											volString = volValue.toString().replace(/,/g , "");
											volInt = parseInt(volString);
										}
										
										if(volInt != undefined && actualAV30DAY>0){
											eval('optionSnapObj.$scopeObj.data["'+orgSym+'"].PERVOL'+'='+(volInt*100/actualAV30DAY).toFixed(2)+'');
										}
								}
							}
							break;
							
							case 'F.DIV':
							{
								var lastPrice = optionSnapObj.$scopeObj.data[orgSym].LV;
								var yieldInString = getYieldValue(newData[key2], lastPrice);
								if(yieldInString!=null && yieldInString.length>0)
								optionSnapObj.$scopeObj.data[orgSym][key2.toString().toUpperCase()] = newData[key2]+"("+yieldInString+")"; 
							}
							break;
							
							case 'T.DIV':
							{
								var lastPrice = optionSnapObj.$scopeObj.data[orgSym].LV;
								var yieldInString = getYieldValue(newData[key2], lastPrice);
								if(yieldInString!=null && yieldInString.length>0)
								optionSnapObj.$scopeObj.data[orgSym][key2.toString().toUpperCase()] = newData[key2]+"("+yieldInString+")"; 
							}
							break;
						}
						
					}
						catch(error){
							i=10;
						}
						optionSnapObj.$scopeObj.$apply();
						$('#DQdiv').css('opacity',1);
						
						i++;
					}
				
			}		  
},

setSnapAndDetailDataOptionStream : function(rootSym){

				var newSymbol;
				var symbolType;
				
				snapObj.fetchTickerStatus(rootSym,function(newTickerValue){
				  // if ticker value is updated
				  if (newTickerValue != null && (newTickerValue[0] != rootSym)) {
					 rootSym = newTickerValue[0];
				  }
			  
				   newSymbol = commonUtility.setDetailQuotes(rootSym)['symbol'];
				   symbolType = commonUtility.setDetailQuotes(rootSym)['symbolType'];
				   commonUtility.setShowOrHideQuotes(symbolType);
				  
				  eval('optionSnapObj.$scopeObj.'+'DQsym'+'="'+rootSym+'"');
				
				  networkAPI.fetchSnapDataViaAjaxCallForSymbolForPortFolio(newSymbol, function(data){
				  data=data[newSymbol];
					if(data!=undefined){
					commonUtils.setSnapDataForOptionStream(newSymbol, data, rootSym);
				   }
				});
				
				networkAPI.fetchDataViaAjaxCallForSymbol(newSymbol,function(detailData){
							 if(detailData!=null){
							   commonUtils.setDetailDataForOptionStream(detailData, rootSym);
							 }
					});
					
					//console.log("subscribe inside option page starttttttt");
					//PortfolioManager.scope_l.client1.subscribe("/topic/"+"E:"+rootSym, PortfolioManager.scope_l.callback);
					//console.log("subscribe inside option page enddddddddddd");
			   });
},

setSnapAndDetailDataHome : function(orgSym, newSymbol){
				
				  networkAPI.fetchSnapDataViaAjaxCallForSymbolForPortFolio(newSymbol, function(data){
				  data=data[newSymbol];
					if(data!=undefined){
						commonUtils.setSnapQuoteDataForHome(newSymbol, data, orgSym);
					}
				});
				networkAPI.fetchDataViaAjaxCallForSymbol(newSymbol,function(detailData){
							 if(detailData!=null){
							 commonUtils.setDetailQuoteDataForHome(detailData, orgSym);}
					});
					
					console.log("before subscribe");
					PortfolioManager.scope_l.client1.subscribe("/topic/"+"E:"+orgSym, PortfolioManager.scope_l.callback);
					console.log("after subscribe");
					
			   },
			   
setSnapAndDetailDataForSymList : function(symbolList, newSymArray, data){

		//PortfolioManager.scope_l.client1.subscribe("/topic/"+"E:.TIME", PortfolioManager.scope_l.callback);
		
		var perCount = symbolList.split(',').length;
		//alert(symbolList);
	    
				for(key in data){
						var symbolData=data[key];
						var sym=symbolData.ticker;
						//alert("dds"+sym);
							
						   if ($('#loaderStatus').length > 0) {
								//$('#loaderStatus').html('Setting Layout::symbol::'+sym+'........');
								draw(1/perCount*100);
						   }
						   
							var symbolType = commonUtility.setDetailQuotes(sym)['symbolType'];
							commonUtility.setShowOrHideQuotes(symbolType);
							 
							//eval('PortfolioManager.scope_l.'+'DQsym'+'="'+newSymArray[sym]+'"');
							/*
							var charWidth = 7;
							var str = newSymArray[sym];
							var dymStyle = "width:"+((str.length +1)*charWidth)+"px";
							eval('PortfolioManager.scope_l.dymStyle = "'+dymStyle+'"');
							*/
							commonUtils.setSnapQuoteDataForHome(sym,symbolData,newSymArray[sym]);
							//console.log("ds2 :: "+newSymArray[sym]);
							try{
								PortfolioManager.scope_l.client1.subscribe("/topic/"+"E:"+newSymArray[sym], PortfolioManager.scope_l.callback);
							}
							catch(exp){
							  console.error("EXCEPTION WHILE MAKING CONNECTION FOR STREAMING "+exp);
							}
							//console.log("ds2");
					}
				
					for(key1 in data){
						var symbolData1=data[key1];
						var sym1=symbolData1.ticker;
						
						optionSnapObj.fetchDetailedDataViaAjaxCallForSymbol(sym1, newSymArray[sym1]);
						 QuotesHandler.fetchDataViaAjaxCallForSymbol(sym1, newSymArray[sym1]);
						
						}
						


},
loader : 0
			   
}