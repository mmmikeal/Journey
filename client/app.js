var myApp = angular.module('myApp', ['ngRoute']); 

myApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		controller: 'landingController',
		templateUrl: 'static/partials/home.html'
	})
	.when('/newjourney', {
		templateUrl: 'static/partials/newJourney.html'
	})
	.otherwise({
		redirectTo: '/'
	})
})

