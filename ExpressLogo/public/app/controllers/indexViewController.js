ExpressLOGOApp.controller('indexViewController', function ($scope, $element, $http) {
	init();
	function init() {
		$http({
			method: 'GET',
			url: '/user'
		})
		.success(function (data) {
			if (data.name) {
				$scope.isLoggedIn = true;
				console.log($scope.isLoggedIn);
				$scope.username = data.name;
				$scope.avatar = data.avatar;
				$scope.top_right_button_href = "logout";
				$scope.top_right_button_name = "Log out";
			}
			else {
				$scope.isLoggedIn = false;
				$scope.top_right_button_href = "#/sign-in";
				$scope.top_right_button_name = "Sign in";
			}
		});
		// $scope.top_right_button_href = "#/sign-in";
		// $scope.top_right_button_name = "Sign in";
	};
});
