ExpressLOGOApp.filter('offset', function() {
		return function(input, start) {
			start = parseInt(start, 10);
			return input.slice(start);};
	});

ExpressLOGOApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total+1; i++)
      input.push(i);
    return input;
  };
});

ExpressLOGOApp.controller('galleryViewController', function ($scope, $http, $filter, $route) {
	$http({
		method: 'GET',
		url: '/gallery'
	})
	.success(function (data) {
		$scope.count = data.count;
		$scope.items = data.post;
	});

		$scope.itemsPerPage = 6;
		$scope.currentPage = 0;
		$scope.all = 0;

		$scope.prevPage = function() {
		if ($scope.currentPage > 0) {
		$scope.currentPage--; }
		};


		$scope.prevPageDisabled = function() {
		return $scope.currentPage === 0 ? "disabled" : "";
		};


		$scope.pageCount = function() {
		return Math.ceil($scope.items.length/$scope.itemsPerPage)-1;
		};


		$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pageCount()) {
		$scope.currentPage++; }
		};

		$scope.nextPageDisabled = function() {
		return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
		}
		
		$scope.setPage = function(i) {
			$scope.currentPage = i;
		}
	

	function like(_id)
	{
		$scope.test = '/gallery/'+_id + '/like';
		$http({
			method: 'POST',
			url: '/gallery/'+ _id + '/like',
			data: _id,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function (data) {
			//success
		})
		.error(function (data) {
			//failed
		});
	}

	$scope.addone = function($photo) {
		$scope.test = $photo._id;
		like($scope.test);
		$route.reload();
	}

	$scope.showdetail = function($iterator){
		var str = '#/gallerylist/' + $iterator._id;
		$scope.test = str;
		window.location.href=str;
	}

});
