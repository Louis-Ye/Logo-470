ExpressLOGOApp.controller('gallerylistViewController', function ($scope, $http, $routeParams) {
	var str = $routeParams.param;
	$http({
		method: 'GET',
		url: '/gallery/' + str
	})
	.success(function (data) {
		$scope.photo = data;
	});

	function submit_comment(_id, content)
	{
		var xsrf = $.param({co: content});
		$http({
			method: 'POST',
			url: '/gallery/'+ _id + '/comments',
			data: xsrf,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function (data) {
			//success
		})
		.error(function (data) {
			//failed
		});
	}

	$scope.submit = function(){
		var text = document.getElementById('cm').value;
		document.getElementById('cm').value = "";
		submit_comment($scope.photo._id,text);
		window.location.reload(true);
	}

	$scope.back = function(){
		document.getElementById('cm').value = "";
		window.location.href='#/gallery';
	}
});
