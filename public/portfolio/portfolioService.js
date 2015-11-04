angular.module('app').service('portfolioService',['$http','mainAppService',function($http,mainAppService){
	
	this.portfoliosArray = [];
	this.portfoliosSymbolMapping = {};
	this.activePortfolio = "";
	this.subsribeSymbolIdMapping = {};
	this.portfolioIdMapping = {};
	
	this.addPortfolio = function(portfolioName,callback){
		$.ajax({
			type: "POST",
			headers : { "prime_user_id" : mainAppService.userID },
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/portfolio/add",  
			dataType:'json',
			data : {"portfolio_name" : portfolioName},
			success: function(data){
				
				console.log("data is : %o",data);
				if(data.statusCode == 1){
					if(data["portfolios"][0]["status"] == 0){
						alert(data["portfolios"][0]["message"]);
					}
					else if(data["portfolios"][0]["status"] == 1){
						callback(data["portfolios"][0]["portfolio_id"]);
					}
					else{
						
					}
				}
				else if(data.statusCode == 0){
					alert(data["reason"]);
				}
				else{
					
				}
			},
			error: function(){
				alert("ERROR");
			}
		});	
	};
	
	this.savePortfolioData = function(obj,callback){
		
		console.log(obj);
		
		$.ajax({
			type: "POST",
			headers : { "prime_user_id" : mainAppService.userID ,  "content-type" :"application/json; charset=utf-8"},
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/portfolio/update",  
			dataType:'json',
			data : JSON.stringify(obj),
			success: function(data){
				
				console.log("data is : %o",data);
				
				if(data.statusCode == 1){
					callback();
				}
			},
			error: function(){
				alert("ERROR");
			}
		});	
		
	};
	
	this.deletePortfolio = function(portfolioId,callback){
		$.ajax({
			type: "POST",
			headers : { "prime_user_id" : mainAppService.userID },
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/portfolio/delete",  
			dataType:'json',
			data : {  "portfolio_id": portfolioId},
			success: function(data){
				
				console.log("data is : %o",data);
				
				if(data.statusCode == 1){
					callback();
				}
			},
			error: function(){
				alert("ERROR");
			}
		});	
	};
	
	this.deleteTickerFromPortfolio = function(portfolioId,symbol,callback){
		
		$.ajax({
			type: "POST",
			headers : { "prime_user_id" : mainAppService.userID },
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/portfolio/ticker/delete",  
			dataType:'json',
			data : {
				"portfolio_id":portfolioId,
				"tickers_list":symbol
			},
			success: function(data){
				
				console.log("data is : %o",data);
				
				if(data.statusCode == 1){
					callback();
				}
			},
			error: function(){
				
			}
		});	
	};
	
	this.returnTrimmedArray = function(array,portfolioName,callback){
		
		if(array.length == 0){
			callback(array);		
		}
		else{
			//alert(array);
			var index = array.indexOf(portfolioName);
			//alert(index);	
			var prevArr = array.slice(0,index);
			//alert(prevArr);
			var frwdArr = array.splice(index+1,array.length);
			//alert(frwdArr);
			array = prevArr.concat(frwdArr); 
			callback(array);			
		}
		
	};
	
	this.unsubscribe = function(symbol){
		if(this.subsribeSymbolIdMapping[symbol] == ""){
			
		}
		else{
			socketClient.client.unsubscribe(this.subsribeSymbolIdMapping[symbol]);
			this.subsribeSymbolIdMapping[symbol] = "";
		}
	};
	
	// init  api hit , for tree map generation 
	
	this.getPortfolioAssetValues = function(callback){
		
		$.ajax({
			type: "GET",
			headers : { "prime_user_id" : mainAppService.userID },
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/portfolio/portfolios",  
			dataType:'json',
			success: function(data){
				
				//console.log("data is : %o",data);
				
				if(data.statusCode == 1){
					callback(data.portfolios);
				}
			},
			error: function(){
				
			}
		});	
		
		
	};
	
	this.addTickerToSpecificPortfolio = function(portfolioId,tickers,shares,callback){
		
		$.ajax({
			type: "POST",
			headers : { "prime_user_id" : mainAppService.userID },
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/portfolio/ticker/add",  
			dataType:'json',
			data : {
				"portfolio_id":portfolioId,
				"tickerslist": tickers,
				"shareslist": shares
			},
			success: function(data){
				
				console.log("data is : %o",data);
				
				if(data.statusCode == 1){
					callback(data.portfolios);
				}
			},
			error: function(){
				
			}
		});	
		
		
	};
	
	this.returnTrimmedJsonArray = function(array,id,value,callback){
		
		var tempArray = [];
		
		for(var i=0; i < array.length ; i++){
			
			if(array[i][id] == value){
				
			}	
			else{
				tempArray.push(array[i]);	
			}
		}	
		
		callback(tempArray);
	};
	
	
	this.getKeyFromValue =  function(json,value){
		
		for(var key in json)
		{
			if(json[key] == value)
			{
				return key;
			}
		}
	}
	
	this.setGradientRectangle = function(divId,rangeArray,colorCombination,color){ 
		var width =parseInt(d3.select("#"+divId).style("width"));
		var height=parseInt(d3.select("#"+divId).style("height")); 
		var gradientMargin={left:width*0.05,right:width*0.05,bottom:height*0.1,top:height*0.1};
		var scaleWidth=width-gradientMargin.left-gradientMargin.right;
		var scaleHeight=height-gradientMargin.top-gradientMargin.bottom; 
		var  svgElement = d3.select("#"+divId).append("svg").attr('width',width).attr('height',height);
		var gradientGroup = svgElement.append("g")
        .attr('class','main-group')
        .attr("transform", "translate(" +gradientMargin.left+ "," +gradientMargin.top+ ")");
        
		var minValue = rangeArray[0];
		var maxValue = rangeArray[1];
		var colorScale = d3.scale.linear()
		.domain([minValue,  maxValue])
		.range([colorCombination.colorLow,  colorCombination.colorHigh]); 
		
		var rectWidth = (scaleWidth);
		var rectHeight = 10;
		
		var midValue = (minValue+maxValue)/2;
		var colorValueArray = [];
		colorValueArray.push(minValue);
		colorValueArray.push(midValue);
		colorValueArray.push(maxValue);
		
		
		var gradient = gradientGroup.append("svg:defs")
		.append("svg:linearGradient")
		.attr("id", "gradient")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (scaleWidth))
		.attr("y2",rectHeight)
		.attr("gradientUnits", "userSpaceOnUse");
		
		gradient.append("svg:stop")
		.attr("offset", "0%")
		.attr("stop-color", colorScale(colorValueArray[0]))
		.attr("stop-opacity", 1);
		
		gradient.append("svg:stop")
		.attr("offset", "50%")
		.attr("stop-color", colorScale(colorValueArray[1]))
		.attr("stop-opacity", 1);
		
		
		gradient.append("svg:stop")
		.attr("offset", "100%")
		.attr("stop-color", colorScale(colorValueArray[2]))
		.attr("stop-opacity", 1);
		
		gradientGroup.append("rect")
		.attr("x", function(d,i) { return i*rectWidth;})
		.attr("rx",5)
		.attr("ry",5)
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.style("fill", "url(#gradient)"); 
		
		var textarray = [rangeArray[0]+"%",midValue+"%",rangeArray[1]+"%"]    
		
		gradientGroup.selectAll(".text")
		.data(textarray)
		.enter()
		.append("text")
		.attr("x", function(d,i) {var leftMargin = (d.toString().length*(3)); return (i*(rectWidth*.5))-leftMargin;})
		.attr("y", function(d,i) { return rectHeight;})
		.attr("dy", function(d,i) { return "1em"})
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.attr("fill", color)
		.attr("font-size",12)
		.text(function(d){return d;}); 
		
		
	};
	
	this.getColorAccordingTOvalue =  function(val,rangeArray,colorObj){
		var minValue = rangeArray[0];
		var maxValue = rangeArray[1];
		var colorScale = d3.scale.linear()
		.domain([minValue, maxValue])
		.range([colorObj.colorLow,colorObj.colorHigh]);
		
		return colorScale(val);   
	}
	
	this.getTickersListfromPortfolio = function(portfolioId,callback){
		
		
		$.ajax({
			type: "GET",
			headers : { "prime_user_id" : mainAppService.userID ,portfolio_id : portfolioId},
			crossDomain: true,
			async:true,
			url:apiManager.http + "services/prime/portfolio/ticker/tickers",  
			dataType:'json',
			success: function(data){
				
				console.log("data is : %o",data);
				
				if(data.statusCode == 1){
					console.log("data.tickers 	: %o ", data.tickers);
					callback(data.tickers);
				}
			},
			error: function(){
				
			}
		});	
		
	}
	
	
	//var csv is the CSV file with headers
	this.csvJSON = function(csv,callback){
		
		
		var obj = {};
			
		var lines=csv.split("\n");
		
		var result = [];
		var headLine = lines[0].trim();
		var headers = headLine.split(/[\s,]+/);
		
		console.log("headersis : ");
		console.log(headers);
		
		for(var i=1;i<lines.length;i++){
			
		//console.log("lines["+i+"] is : ");
		//console.log(lines[i].trim());
			
			//alert(lines[i].trim());
			
			if(lines[i] != undefined && lines[i] != " " && lines[i] != "\n" && lines[i] != "\r" && lines[i] != ""){

				var currentline=lines[i].split(/[\s,]+/);
				
				obj[currentline[0]] = currentline[1];
				
				/*for(var j=0;j<headers.length;j++){
					if(currentline[j] != undefined){
						//currentline[j] = currentline[j];
						obj[headers[j]] = currentline[j];	
					}
					else{
					}
					
				}*/
				//result.push(obj);
			}
			
		}
		
		if(Object.keys(obj).length == 0){
				alert("PLEASE TRY WITH DIFFERENT SYMBOLS");
		}
		//console.log(obj);
		//return result; //JavaScript object
		callback(obj); //JSON
	}
}])