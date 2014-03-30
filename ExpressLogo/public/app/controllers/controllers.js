ExpressLOGOApp.controller('indexViewController', function ($scope) {
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('learnViewController', function ($scope) {
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('playViewController', function ($scope) {
	var interpret_json;
	init();

	function callback (message) {
		if (message) {
			$scope.result += message + '\n';
			$("#result-pad").scrollTop(999);
		};
	};

	function init() {
		$scope.result = "";
		$scope.pen_status = myCanvas.getDrawStatus();
		if ($scope.pen_status) {
			$scope.pen_string = "up";
		} else {
			$scope.pen_string = "down";
		}
		document.getElementById("code-pad").focus();
		myCanvas.initCanvas();
		interpret_json = {
			'userTyping': $scope.code,
			'delay': 1,
			'debugMode': false,
			'callback': callback
		};
	};

	$scope.on_submit_clicked = function () {
		callback($scope.code);
		interpret_json.userTyping = $scope.code;
		interpret(interpret_json);
		$scope.code = "";
		document.getElementById("code-pad").focus();
	};

	$scope.toggle_pen = function () {
		$scope.pen_status = myCanvas.getDrawStatus();
		if ($scope.pen_status) {
			interpret_json.userTyping = "penup";
			$scope.pen_string = "down";
		}
		else {
			interpret_json.userTyping = "pendown";
			$scope.pen_string = "up";
		};
		callback(interpret_json.userTyping);
		interpret(interpret_json);
	};

	$scope.background_image = function () {

	};

	$scope.reset = function () {

	};

	function shareCallback (url) {
		var image = url;
		// save image API
	};

	$scope.share = function () {
		myCanvas.saveCanvas(shareCallback);
	}
});

ExpressLOGOApp.controller('libraryViewController', function ($scope) {
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('galleryViewController', function ($scope) {
	// Set of Photos
	$scope.photos = [
		{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm21.jpg', desc: 'Image 01'},
		{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm22.jpg', desc: 'Image 02'},
		{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm25.jpg', desc: 'Image 03'},
		{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm26.jpg', desc: 'Image 04'},
		{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm27.jpg', desc: 'Image 05'},
		{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm28.jpg', desc: 'Image 06'}
	];

	// initial image index
	$scope._Index = 0;

	// if a current image is the same as requested image
	$scope.isActive = function (index) {
		return $scope._Index === index;
	};

	// show prev image
	$scope.showPrev = function () {
		$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
	};

	// show next image
	$scope.showNext = function () {
		$scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
	};

	// show a certain image
	$scope.showPhoto = function (index) {
		$scope._Index = index;
	};
});

ExpressLOGOApp.controller('aboutViewController', function ($scope) {
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('profileViewController', function ($scope) {
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('accountViewController', function ($scope, $http, global_data) {
	$http({
		method: 'GET',
		url: '/account'
	})
	.success(function (data) {
		$scope.user = data.local;
		$scope.name = data.local.name;
	})
	.error(function (data) {
		$scope.message = "Error";
	});
});

ExpressLOGOApp.controller('signUpViewController', function ($scope, $http, global_data) {
	$scope.message = [];
	$http({
		method: 'GET',
		url: '/signup'
	})
	.success(function (data) {
		$scope.message = data.message;
		if ($scope.message[0] == "success") {
			global_data.logged_in = true;
		};
	})
	.error(function (data) {
		$scope.message = "Unknown error";
	});
});

ExpressLOGOApp.controller('signInViewController', function ($scope, $http, global_data) {
	$scope.message = [];
	$http({
		method: 'GET',
		url: '/login'
	})
	.success(function (data) {
		$scope.message = data.message;
		console.log(global_data.logged_in);
		if ($scope.message[0] == "success") {
			global_data.logged_in = true;
		};
	})
	.error(function (data) {
		$scope.message[0] = "Unknown error";
	});

});
