ExpressLOGOApp.controller('learnViewController', function ($scope, $routeParams, $sce, $location) {
	init();
	function init() {
		var pageNumber = parseInt(8);
		var page_show = [false];
		var curPage = parseInt($routeParams.param);

		if (curPage > pageNumber || curPage < 0 || !curPage) {
			$location.path("/tutorial/1/");
		}

		for (var i = 1; i <= pageNumber; i++) {
			page_show.push(false);
		}
		page_show[curPage] = true;
		$scope.page_show = page_show;
		$scope.step = curPage;

		var nextPage = curPage + 1;
		if (nextPage > pageNumber) nextPage = pageNumber;
		var previousPage = curPage - 1;
		if (previousPage <= 0) previousPage = 1;
		$scope.nextPage = nextPage;
		$scope.previousPage = previousPage;
		var html = getprogressButtonHTML(curPage, pageNumber);
		$scope.progressButton = $sce.trustAsHtml( html );
	};

	function getprogressButtonHTML(curPage, pageNumber) {
		var result = "";
		var i = 1;
		for (i = 1; i<=curPage; i++) {
			result += getOKSignHTMLByNum(i) + " ";
		}
		for (; i <= pageNumber; i++) {
			result += getOKCircleHTMLByNum(i) + " ";
		}
		return result;
	}

	function getOKSignHTMLByNum(num){
		var str1 = "<a href='/#/tutorial/";
		var str2 = "/'><span class='glyphicon glyphicon-ok-sign'></span></a>";
		return str1 + num + str2;
	}
	function getOKCircleHTMLByNum(num){
		var str1 = "<a href='/#/tutorial/";
		var str2 = "/'><span class='glyphicon glyphicon-ok-circle'></span></a>";
		return str1 + num + str2;
	}
});
