ExpressLOGOApp.controller('signInViewController', function ($scope, $http) {
	$scope.message = [];
	$http({
		method: 'GET',
		url: '/login'
	})
	.success(function (data) {
		$scope.message = data.message;

		if ($scope.message[0] == "success") {

		};
	});
});
