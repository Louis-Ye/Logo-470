ExpressLOGOApp.controller('accountViewController', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/account'
	})
	.success(function (data) {
		$scope.message = data.message;
		console.log($scope.message);
		$scope.user = data.user.local;
		$scope.name = data.user.local.name;
	})
	.error(function (data) {
		$scope.message = "Error";
	});
});
