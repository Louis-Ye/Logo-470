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
	init();

	function init() {
		$scope.result = "";
		document.getElementById("code-pad").focus();
		initCanvas();
	};

	var callback = function (message, command) {
		if (message) {
			$scope.result += message + '\n';
			$("#result-pad").scrollTop(999);
		}
		else {
			newInputData(command.instruction, command.value);
		}
	};

	$scope.on_submit_clicked = function () {
		callback($scope.code, null);

		interpret({
			'userTyping': $scope.code,
			'delay': 0.1,
			'debugMode': false,
			'callback': callback
		});

		$scope.code = "";
		document.getElementById("code-pad").focus();
	};

    $scope.toggle_pen = function () {
        // pen.up = !pen.up;
        if (pen.up) {};
    };

    $scope.background_image = function () {

    };

    $scope.reset = function () {

    };

    var shareCallback = function (url) {
        var image = url;
    };

    $scope.share = function () {
        newInputData(inputDataDictionary["specialFunctions"], inputDataDictionary["saveCanvas"], shareCallback);
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
        if ($scope.message[0] == "success") {
            global_data.logged_in = true;
        };
    })
    .error(function (data) {
    	$scope.message = "Unknown error";
    });
});
