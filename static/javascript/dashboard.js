var dashboard = angular.module('dashboard', ['ngRoute', 'ui.bootstrap']).config(function($routeProvider, $interpolateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            controller: "LocationCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region', {
            controller: "LocationCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region/:district', {
            controller: "LocationCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region/:district/:subcounty', {
            controller: "LocationCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region/:district/:subcounty/:parish', {
            controller: "LocationCtrl",
            templateUrl: '/static/templates/show.html'
        })
        
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');

    
});