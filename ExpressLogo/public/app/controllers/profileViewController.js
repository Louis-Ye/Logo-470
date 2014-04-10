ExpressLOGOApp.controller('profileViewController', function ($scope, $http) {

	$http({
		method: 'GET',
		url: '/profile'
	})
	.success(function (data) {
		$scope.user = data.user;
		$scope.posts = data.post;
		$scope.message = data.message;
		for (var post in $scope.posts){
			$scope.posts[post].create_time = new Date($scope.posts[post].create_at).toDateString();
		}
	})
	.error(function (data) {
		$scope.message = "Error";
	})
});
