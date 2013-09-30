var dashboard = angular.module('dashboard', ['ngRoute']).config(function($routeProvider, $interpolateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region/:district', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region/:district/:subcounty', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/dashboard/:region/:district/:subcounty/:parish', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');



});