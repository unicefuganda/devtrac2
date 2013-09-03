angular.module('dashboard', []).
  config(function($routeProvider, $interpolateProvider, $locationProvider) {  
    $locationProvider.html5Mode(true);    
    $routeProvider
      .when('/', {controller:ListCtrl, templateUrl:'/static/templates/list.html'})  
      .when('/spikes', {controller:SpikesCtrl, templateUrl:'/static/templates/spikes.html'})  
      .when('/district/:district', { controller:ShowCtrl, templateUrl:'/static/templates/show.html'})
      .otherwise({redirectTo:'/'});
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
  });


function ListCtrl($scope, $http) {
  $http({method: 'GET', url: '/districts.json'}).
    success(function(data, status, headers, config) { $scope.districts = data.districts });
}

function SpikesCtrl() {}

function ShowCtrl($scope, $http, $filter, $routeParams) {
  console.log("Show!")
  $http({method: 'GET', url: '/districts.json'}).
    success(function(data, status, headers, config) { 
      $scope.district = $filter('filter')(data.districts, function(district) { return district.name.toLowerCase() == $routeParams.district.toLowerCase(); })[0]
    });
}