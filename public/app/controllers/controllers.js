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

	};

	var callback = function (result) {
		// show result in upper box
	};

	var userTyping;
	var on_submit_clicked = function () {
		interpret({
			'userTyping': userTyping,
			'delay': 0.1,
			'debugMode': true,
			'callback': callback
		});
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
