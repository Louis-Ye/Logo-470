ExpressLOGOApp.controller('notificationViewController', function ($scope, $http) {
	
	$scope.showUnreadComment = false;
	$scope.showLike = false;
	$scope.showAll = true;

	$scope.unReadNum = 0;

	$scope.getUnreadComment = function () {
		$http({
		method: 'GET',
		url: '/notification?q=comment'
		})
		.success(function (data) {
			$scope.comments = makeUnreadOrAllComments(data, true);;
		})
		.error(function (data) {
			$scope.message = "Error";		
		});

		$scope.showUnreadComment = true;
		$scope.showLike = false;
		$scope.showAll = false;
	};
	function makeUnreadOrAllComments(data, unread) {
		var result = [];
		var count = 0;
		for (var i=0; i<data.length; i++) {
			data[i].date = new Date(data[i].date).toDateString();
			if (unread) {
				if (!data[i].isRead) {
					result.push( data[i] );
					count += 1;
				}
			}
			else {
				result.push(data[i]);
				count += 1;
			}
		}
		$scope.unReadNum = count;
		return result;
	}








	$scope.getLike = function () {
		$http({
		method: 'GET',
		url: '/notification?q=like'
		})
		.success(function (data) {
			$scope.likes = makeLikes(data);
		})
		.error(function (data) {
			$scope.message = "Error";
		});

		$scope.showUnreadComment = false;
		$scope.showLike = true;
		$scope.showAll = false;
	};
	function makeLikes(data) {
		for (var i=0; i<data.length; i++) {
			data[i].date = new Date(data[i].date).toDateString();
		}
		return data;
	}










	$scope.getAll = function () {
		$http({
		method: 'GET',
		url: '/notification?q=all'
		})
		.success(function (data) {
			$scope.comments = makeUnreadOrAllComments(data.comment, false);
			$scope.likes = makeLikes(data.like);
		})
		.error(function (data) {
			$scope.message = "Error";
		});

		$scope.showUnreadComment = false;
		$scope.showLike = false;
		$scope.showAll = true;
	};
	$scope.getAll();
});