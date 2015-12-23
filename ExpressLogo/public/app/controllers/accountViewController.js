ExpressLOGOApp.controller('accountViewController', function ($scope, $http) {
	init();
	function init(){
		$scope.loginMessage = "";
		$scope.user = "";
		$scope.pwdMessage = "";
	}

	$http({
		method: 'GET',
		url: '/account'
	})
	.success(function (data) {
		$scope.loginMessage = data.message;
		$scope.user = data.user.local;
		$scope.name = data.user.local.name;
	})
	.error(function (data) {
		$scope.message = "Error";
	});

	$http({
		method: 'GET',
		url: '/account/change-password'
	})
	.success(function (data) {
		$scope.pwdMessage = data.pwdMessage[0];
	});
});
