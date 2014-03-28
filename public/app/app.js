var ExpressLOGOApp = angular.module('ExpressLOGOApp', ['ngRoute', 'ngAnimate', 'ngTouch']);

ExpressLOGOApp.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'indexViewController',
			templateUrl: 'app/partials/homepage.html'
		})
		.when('/learn', {
			controller: 'learnViewController',
			templateUrl: 'app/partials/learn.html'
		})
		.when('/play', {
			controller: 'playViewController',
			templateUrl: 'app/partials/play.html'
		})
		.when('/library', {
			controller: 'libraryViewController',
			templateUrl: 'app/partials/library.html'
		})
		.when('/gallery', {
			controller: 'galleryViewController',
			templateUrl: 'app/partials/gallery.html'
		})
		.when('/about', {
			controller: 'aboutViewController',
			templateUrl: 'app/partials/about.html'
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
