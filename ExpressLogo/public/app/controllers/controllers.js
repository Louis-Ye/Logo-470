ExpressLOGOApp.controller('indexViewController', function ($scope, global_data) {
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('learnViewController', function ($scope) {
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('playViewController', function ($scope, $http) {
	var interpret_json;
	init();

	function callback (message) {
		if (message) {
			var result_pad = $('#result-pad');
			message = message.replace(/\n/g, '<br />');
			result_pad.append(message + "<br />");
			result_pad = document.getElementById('result-pad');
			result_pad.scrollTop = result_pad.scrollHeight;
		};
	};

	function init () {
		myCanvas.initCanvas();
		clearUndo();
		$scope.result = "";
		$scope.pen_status = myCanvas.getDrawStatus();
		$scope.return_status = myCanvas.getBorderStatus();
		$scope.turtle_status = myCanvas.getTurtleStatus();
		interpret_json = {
			'userTyping': $scope.code,
			'delay': 1,
			'debugMode': false,
			'callback': callback,
			'penStatusCallback': change_pen_status,
			'turtleStatusCallback': change_turtle_status
		};
	};

	$("#slider-line").slider({
		range: "min",
		min: 1,
		max: 500,
		value: 1,
		animate: true,
		slide: function (event, ui) {
			$("#line-tip").val($(this).slider("value"));
			myCanvas.setLineWidth($(this).slider("value"));
		}
	});

	$('#line-tip').change(function () {
		myCanvas.setLineWidth($(this).val());
	});

	$('#colorpalette-pen').colorPalette().on('selectColor', function(selectedColor) {
		myCanvas.setPenColor(selectedColor.color);
	});

	$('#colorpalette-background').colorPalette().on('selectColor', function(selectedColor) {
		myCanvas.setBackgroundColor(selectedColor.color);
	});

	$scope.on_submit_clicked = function () {
		callback($scope.code);
		interpret_json.userTyping = $scope.code;
		interpret(interpret_json);
		$scope.code = "";
		document.getElementById("code-pad").focus();
	};

	function change_pen_status (status) {
		$scope.pen_status = status;
	};

	$scope.toggle_pen = function () {
		interpret_json.userTyping = $scope.pen_status ? "penup" : "pendown";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
		$scope.pen_status = myCanvas.getDrawStatus();
	};

	$scope.toggle_border = function () {
		$scope.border_status = myCanvas.getBorderStatus();
		$scope.border_status ? myCanvas.noBorder() : myCanvas.setBorder();
	};

	function change_turtle_status (status) {
		$scope.turtle_status = status;
	};

	$scope.toggle_turtle = function () {
		interpret_json.userTyping = $scope.turtle_status ? "hideturtle" : "showturtle";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
		$scope.turtle_status = myCanvas.getTurtleStatus();
	};

	$scope.clear_canvas = function () {
		interpret_json.userTyping = "clearscreen";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
	};

	$scope.background_image = function () {
		// interpreter API?
	};

	$scope.reset = function () {
		clearUndo();
		$('#result-pad').empty();
		$scope.code = "";
		interpreterReset();
		myCanvas.initCanvas();
	};

	function shareCallback (url) {
		var image = url;
		var share = $.param({
			img_url: url,
		});
		//save image API
		$http({
			method: 'POST',
			url: '/share',
			data: share,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function (data) {
			//success
		})
		.error(function (data) {
			//failed
		});

	};

	$scope.share = function () {
		myCanvas.saveCanvas(shareCallback);
	};
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
			console.log(global_data.logged_in);
		};
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
		if ($scope.message[0] == "success") {
			global_data.logged_in = true;
			console.log(global_data.logged_in);
		};
	});
});
