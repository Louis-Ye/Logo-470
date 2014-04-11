ExpressLOGOApp.controller('notificationViewController', function ($scope, $http) {
	

	$scope.showUnreadComment = false;
	$scope.showLike = false;
	$scope.showAll = true;


	$scope.getUnreadComment = function () {
		$http({
		method: 'GET',
		url: '/notification?q=comment'
		})
		.success(function (data) {
			console.log(data);
		})
		.error(function (data) {
			$scope.message = "Error";
		});

		$scope.showUnreadComment = true;
		$scope.showLike = false;
		$scope.showAll = false;
	};

	$scope.getLike = function () {
		$http({
		method: 'GET',
		url: '/notification?q=like'
		})
		.success(function (data) {
			console.log(data);
		})
		.error(function (data) {
			$scope.message = "Error";
		});

		$scope.showUnreadComment = false;
		$scope.showLike = true;
		$scope.showAll = false;

		var dic = {date: "!23", liker: {name: "BBB~~~"}};
		$scope.likes = [dic, dic];
	};

	$scope.getAll = function () {
		$http({
		method: 'GET',
		url: '/notification?q=all'
		})
		.success(function (data) {
			console.log(data);
		})
		.error(function (data) {
			$scope.message = "Error";
		});

		$scope.showUnreadComment = false;
		$scope.showLike = false;
		$scope.showAll = true;
	};
});