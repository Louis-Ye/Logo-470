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
	init();
	function init() {

	};
});

ExpressLOGOApp.controller('aboutViewController', function ($scope) {
	init();
	function init() {

	};
});
