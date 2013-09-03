var dashboard = angular.module('dashboard', []).
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

var myApp = dashboard.service('districtService', function($http, $filter) {
  var self = this;
  this.all = function(result) {
    if (self.districts) {
      result(self.districts);
      return;
    }

    $http({method: 'GET', url: '/districts.json'}).
      success(function(data, status, headers, config) {  
        self.districts = data.districts;
        result(data.districts); 
      });
  };

  this.find_by_name = function(name, result) {
    self.all(function(districts) {
      var district = $filter('filter')(districts, function(district) { return district.name.toLowerCase() == name.toLowerCase(); })[0]; 
      result(district);
    });
  };
});

function ListCtrl($scope, $http, districtService) {
  districtService.all(function(districts){
    $scope.districts = districts;
  });
}

function SpikesCtrl() {}

function ShowCtrl($scope, $http, $filter, $routeParams, districtService) {
  districtService.find_by_name($routeParams.district, function(district){
    $scope.district = district;
  });
}