ExpressLOGOApp.controller('profileViewController', function ($scope, $http, $route) {

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
	});

	$scope.post_delete = function(postId){
		console.log(postId);
		$http({
			method: 'DELETE',
			url: '/profile/' + postId
		})
		.success(function() {
			//success
		})
		.error(function() {});
		$route.reload();
	};
});
