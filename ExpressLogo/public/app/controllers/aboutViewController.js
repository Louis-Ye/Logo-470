ExpressLOGOApp.controller('aboutViewController', function ($scope) {
	init();
	function init() {
		$scope.samples = [
			{name: "Big Bang", src: "images/about_samples/sample-1.png"},
			{name: "Snow", src: "images/about_samples/sample-2.png"},
			{name: "Colors", src: "images/about_samples/sample-3.png"},
			{name: "Pansy", src: "images/about_samples/sample-4.png"},
		];
	};
});
