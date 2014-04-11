ExpressLOGOApp.controller('gallerylistViewController', function ($scope, $http, $routeParams) {
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
		$scope.photo = data;
		$scope.create_time = new Date($scope.photo.create_at).toDateString();
	})
	.error(function (data) {
		window.location.href='#/gallery';
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
			if (data.message === "not logged in") window.location.href="#/sign-in";
			else {
				window.location.reload(true);
			}
		})
		.error(function (data) {
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
