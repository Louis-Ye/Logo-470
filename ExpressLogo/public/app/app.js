var ExpressLOGOApp = angular.module('ExpressLOGOApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'ngCookies']);


ExpressLOGOApp.controller('mainController', function ($scope, $element, $http) {
	init();
	function init() {
		$http({
			method: 'GET',
			url: '/login'
		})
		.success(function (data) {
			$scope.message = data.message;

			if ($scope.message[0] == "success") {
				$scope.top_right_button_href = "logout";
				$scope.top_right_button_name = "Log out";
			}
			else {
				$scope.top_right_button_href = "#/sign-in";
				$scope.top_right_button_name = "Sign in";
			}
		});
	};
});

ExpressLOGOApp.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'indexViewController',
			templateUrl: 'app/partials/homepage.html'
		})
		.when('/tutorial', {
			controller: 'learnViewController',
			templateUrl: 'app/partials/tutorial.html'
		})
		.when('/library', {
			controller: 'libraryViewController',
			templateUrl: 'app/partials/library.html'
		})
		.when('/play', {
			controller: 'playViewController',
			templateUrl: 'app/partials/play.html'
		})
		.when('/gallery', {
			controller: 'galleryViewController',
			templateUrl: 'app/partials/gallery.html'
		})
		.when('/about', {
			controller: 'aboutViewController',
			templateUrl: 'app/partials/about.html'
		})
		.when('/profile', {
			controller: 'profileViewController',
			templateUrl: 'app/partials/profile.html'
		})
		.when('/account', {
			controller: 'accountViewController',
			templateUrl: 'app/partials/account.html'
		})
		.when('/sign-in', {
			controller: 'signInViewController',
			templateUrl: 'app/partials/sign-in.html'
		})
		.when('/sign-up', {
			controller: 'signUpViewController',
			templateUrl: 'app/partials/sign-up.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});
