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

	$("#slider-delay").slider({
		range: "min",
		min: 1,
		max: 1000,
		value: 1,
		animate: true,
		slide: function (event, ui) {
			$("#delay-tip").val(ui.value);
			interpret_json.delay = ui.value;
		}
	});

	$('#delay-tip').change(function () {
		myCanvas.setLineWidth($(this).val());
	});

	$("#slider-line").slider({
		range: "min",
		min: 1,
		max: 500,
		value: 1,
		animate: true,
		slide: function (event, ui) {
			$("#line-tip").val(ui.value);
			// myCanvas.setLineWidth(ui.value);
			interpret_json.userTyping = "penwidth " + ui.value;
			callback(interpret_json.userTyping);
			interpret(interpret_json);
		}
	});

	$('#line-tip').change(function () {
		// myCanvas.setLineWidth($(this).val());
		interpret_json.userTyping = "penwidth " + $(this).val();
		callback(interpret_json.userTyping);
		interpret(interpret_json);
	});

	$('#colorpalette-pen').colorPalette().on('selectColor', function(selectedColor) {
		interpret_json.userTyping = "color [" + selectedColor.color + "]";
		callback(interpret_json.userTyping);
		interpret(interpret_json);
		// myCanvas.setPenColor(selectedColor.color);
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
		var user_codes = $('#result-pad')[0].innerText;
		//console.log(user_codes);
		var share = $.param({
			img_url: url,
			code : user_codes
		});
		//console.log(share);
		//save image API
		$http({
			method: 'POST',
			url: '/share',
			data: share,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function (data) {
			//success
			$scope.message = data.message;
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

ExpressLOGOApp.controller('galleryViewController', function ($scope, $http, $filter) {
	$http({
		method: 'GET',
		url: '/gallery?page=1'
	})
	.success(function (data) {
		$scope.count = data.count;
		$scope.photos = data.post;
		$scope.query = '';
	})


		$scope.pages = [];//存页数
		$scope.pagedUrls=[];
		$scope.fliteredUrls = [];//利用一个数组存储过滤过的数据
		$scope.currentPage = 0;//表示某一页,此数字等于页数-1
		$scope.urlsPerPage = 5;//以5来分页
                $scope.orderProp = 'id';


	// Set of Photos
	//$scope.photos = [
	//	{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm21.jpg', desc: 'Image 01'},
	//	{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm22.jpg', desc: 'Image 02'},
	//	{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm25.jpg', desc: 'Image 03'},
	//	{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm26.jpg', desc: 'Image 04'},
	//	{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm27.jpg', desc: 'Image 05'},
	//	{src: 'http://images.17173.com/2013/news/2013/12/31/cb1231pkm28.jpg', desc: 'Image 06'}
	//];

		$scope.search = function () {
			var result = [];
			$filter('filter')($scope.image_url, function (item) {
				for (var attr in item) {
					if (item[attr].toString().toLowerCase().indexOf($scope.query.toLowerCase()) !== -1) {
						result.push(item);
						break
					}
				}
			});
			//console.log(result)
			$scope.fliteredUrls = result;
			$scope.currentPage = 0;
		}

		$scope.paging = function () {
			$scope.pages = [];
			$scope.pagedUrls=[];//初始化
			var l = $scope.fliteredUrls.length;//记录总数
			var maxPage = (l % $scope.urlsPerPage == 0) ? l / $scope.urlsPerPage : (Math.floor(l / $scope.urlsPerPage) + 1)//计算要分的页数
			console.log(maxPage)
			for (var i = 0; i <= maxPage - 1; i++) {
			$scope.pagedUrls[i] = $scope.fliteredUrls.splice(0, $scope.urlsPerPage)//开始分页。下标等于页数-1
			$scope.pages.push(i+1)//重新造页数
			}

		}

	$scope.addone = function(index) {index = index + 1;}

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

ExpressLOGOApp.controller('profileViewController', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/profile'
	})
	.success(function (data) {
		var reg = data.user.register;
		$scope.user = data.user[reg];
	})
	.error(function (data) {
		$scope.message = "Error";
	});
});

ExpressLOGOApp.controller('accountViewController', function ($scope, $http) {
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

ExpressLOGOApp.controller('signUpViewController', function ($scope, $http) {
	$scope.message = [];
	$http({
		method: 'GET',
		url: '/signup'
	})
	.success(function (data) {
		$scope.message = data.message;
		if ($scope.message[0] == "success") {
			
		}
	});
});

ExpressLOGOApp.controller('signInViewController', function ($scope, $http) {
	$scope.message = [];
	$http({
		method: 'GET',
		url: '/login'
	})
	.success(function (data) {
		$scope.message = data.message;

		if ($scope.message[0] == "success") {
			
		};
	});
});
