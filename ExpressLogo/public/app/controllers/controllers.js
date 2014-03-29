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
		// document.getElementById("code-pad").focus();
		initCanvas();
	};

	var callback = function (message, command) {
		if (message) {
			$scope.result += message + '\n';
			$("#result-pad").scrollTop(99999);
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

});

ExpressLOGOApp.controller('aboutViewController', function ($scope) {
	init();
	function init() {

	};
});
