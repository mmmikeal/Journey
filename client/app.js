var myApp = angular.module('myApp', ['ngRoute']); 

myApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		controller: 'landingController',
		templateUrl: 'static/partials/home.html'
	})
	.when('/newJourney', {
		templateUrl: 'static/partials/newJourney.html'
	})
	.otherwise({
		redirectTo: '/'
	})
})

