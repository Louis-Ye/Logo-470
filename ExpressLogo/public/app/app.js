var ExpressLOGOApp = angular.module('ExpressLOGOApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'ngCookies']);

ExpressLOGOApp.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'homepageViewController',
			templateUrl: 'app/partials/homepage.html'
		})
		.when('/tutorial/:param/', {
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
		.when('/gallerylist/:param',{
			controller: 'gallerylistViewController',
			templateUrl: 'app/partials/gallerylist.html'
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
		.when('/notification', {
			controller: 'notificationViewController',
			templateUrl: 'app/partials/notification.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});
