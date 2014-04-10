ExpressLOGOApp.filter('offset', function() {
		return function(input, start) {
			start = parseInt(start, 10);
			return input.slice(start);};
	});


ExpressLOGOApp.controller('galleryViewController', function ($scope, $http, $filter) {
	$http({
		method: 'GET',
		url: '/gallery'
	})
	.success(function (data) {
		$scope.count = data.count;
		$scope.items = data.post;
	});
//app.filter('offset', function() {
//return function(input, start) {
//start = parseInt(start, 10);;
//return input.slice(start);; };
//});;
		$scope.order = false;

		$scope.itemsPerPage = 6;
		$scope.currentPage = 0;

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

		$scope.checkstate = function() {
		return $scope.order === true ? true : false;
		}

		$scope.checkstate2 = function() {
		return $scope.order === true ? false : true;
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
		window.location.reload(true);
	}

	$scope.showdetail = function($iterator){
		$scope.order = true;
		$scope.spe_photo = $iterator;
	}

	$scope.back = function(){
		$scope.order = false;
	}

	function submit_comment(_id, content)
	{
		$scope.test = content;
		var content_data = $.param({
			co : content
		});
		$http({
			method: 'POST',
			url: '/gallery/'+ _id + '/comments',
			data: content_data,
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
		submit_comment($scope.spe_photo._id,text);
		window.location.reload(true);
	}
	// initial image index
	$scope._Index = 0;

	// if a current image is the same as requested image
	$scope.isActive = function (index) {
		return $scope._Index === index;
	};

	// show prev image
	$scope.showPrev = function () {
		$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.items.length - 1;
	};

	// show next image
	$scope.showNext = function () {
		$scope._Index = ($scope._Index < $scope.items.length - 1) ? ++$scope._Index : 0;
	};

	// show a certain image
	$scope.showPhoto = function (index) {
		$scope._Index = index;
	};
});
