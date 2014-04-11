ExpressLOGOApp.controller('notificationViewController', function ($scope, $http) {

	$scope.getlike = function () {
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
	};

	$scope.getcomment = function () {
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
	};

	//TODO
	// $scope.getall = function () {
	// 	$http({
	// 	method: 'GET',
	// 	url: '/notification?q=all'
	// 	})
	// 	.success(function (data) {
	// 		console.log(data);
	// 	})
	// 	.error(function (data) {
	// 		$scope.message = "Error";
	// 	});
	// };
});