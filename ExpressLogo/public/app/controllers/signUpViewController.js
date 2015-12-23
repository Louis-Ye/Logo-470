ExpressLOGOApp.controller('signUpViewController', function ($scope, $http) {
	$scope.message = [];
	$http({
		method: 'GET',
		url: '/signup'
	})
	.success(function (data) {
		$scope.message = data.message;
		if ($scope.message[0] == "success") {

		}
	});
});
