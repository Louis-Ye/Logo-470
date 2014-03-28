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
	}

	var callback = function (result) {
		if (result) {
			$scope.result += result + '\n';
			$("#result-pad").scrollTop(99999);
		}
	};

	$scope.on_submit_clicked = function () {
		callback($scope.code);

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
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('aboutViewController', function ($scope) {
	init();
	function init() {

	};
});
