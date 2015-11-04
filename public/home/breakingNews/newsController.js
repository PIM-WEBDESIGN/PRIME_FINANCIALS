angular.module('app').controller('newsController',['$scope','newsService','mainAppService',function($scope,newsService,mainAppService){
	
	var clientNews;
	$scope.breakingNews = [];
	$scope.newsSourceVal = "";
	$(".breaking-news-module").niceScroll({cursorborder:"",cursorcolor:"grey"});
	
	var newsClient ;
	
	$scope.getRowClass = function(index){		
		if(index%2 == 0)
		{
			return "breaking-news  row even";
		} 
		else{ 		
			return "breaking-news row odd";
		}
	}
	
	var callbackNews =  function(message){
		if (message) {
			var received_msg = JSON.parse(message);
			received_msg['ns']=received_msg.NS;
			displaySubscribedNews(received_msg);
		} 
		else {
			alert("got empty message");
		}
	};
	
	var displayNews = function(newNews){
		for(var key in newNews){
			displaySubscribedNews(newNews[key]);	
		}			
	}
	
	var displaySubscribedNews =  function(value){
		var json = {};
		json.source=value.source!=null?value.source:value.NS;
		json.newsSource=value.ns;
		json.news=value.headline!=null?value.headline:value.NHL;
		
		if(json.news === undefined){
		
		}
		else{
			if(json.news.length >  60){
				json.headLine = (json.news).substr(0,60);
			}	
			else{
				json.headLine = json.news ;	
			}
			
			json.newsId=value.id!=null?value.id:value.NID;
			json.date=value.date!=null?value.date:value.ND;	
			json.readClass = "grey";
			
			$scope.breakingNews.unshift(json);
			$scope.breakingNews = $scope.breakingNews.splice(0,20);
			$scope.$apply();
		}
		
	}
	
	$scope.init	= function(){
		newsService.getNews(function(news){
			if(news == "error"){
				
			}
			else{
				displayNews(news);	
				subscribeForNews();	
			}
			//alert("news h");
			mainAppService.loader++;
		});
	};
	
	var subscribeForNews = function(){		
		nid = socketClient.client.subscribe("/topic/E:"+"DJ.NEWS", callbackNews);
	};
	
	$scope.openFullNews =  function(index){
		$scope.breakingNews[index]["readClass"] = "read";
		newsService.fetchNewsDetailsForDJN(	$scope.breakingNews[index]["newsId"],$scope.breakingNews[index]["source"],function(newsSrc){
			$('#iframe').attr('src',newsSrc);
			$('.breaking-news').click(function(){
				$("#breakingNewPopup").modal('show');
			});
		});
	};
	
}]);