ExpressLOGOApp.controller('accountViewController', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/account'
	})
	.success(function (data) {
		$scope.user = data.local;
		$scope.name = data.local.name;
	})
	.error(function (data) {
		$scope.message = "Error";
	});
});
