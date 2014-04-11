ExpressLOGOApp.controller('gallerylistViewController', function ($scope, $http, $routeParams, $route) {
	var str = $routeParams.param;

	function gettime(date){
		var str = new Date(date).toDateString();
		return str;
	}
	
	$http({
		method: 'GET',
		url: '/gallery/' + str
	})
	.success(function (data) {
		if (data.message === "failed") window.location.href='#/gallery';
		else {
			$scope.photo = data;
			$scope.create_time = new Date($scope.photo.create_at).toDateString();
		}
	})
	.error(function (data) {
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
		})
		.error(function (data) {
		});


		$http({
			method: 'GET',
			url: '/user/'
		}).success(function (data) {

			if (data.email) {
				$route.reload();
			}
			else {
				window.location.href="/#/sign-in";
			}
		}).error(function (data) {
		});
	}

	$scope.submit = function(){
		var text = document.getElementById('cm').value;
		document.getElementById('cm').value = "";
		submit_comment($scope.photo._id,text);
	}

	$scope.back = function(){
		document.getElementById('cm').value = "";
		window.location.href='#/gallery';
	}	

});
