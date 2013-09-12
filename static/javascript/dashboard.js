var dashboard = angular.module('dashboard', []).config(function($routeProvider, $interpolateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/district/:district', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        .when('/district/:district/:subcounty', {
            controller: "DashboardCtrl",
            templateUrl: '/static/templates/show.html'
        })
        
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');



});