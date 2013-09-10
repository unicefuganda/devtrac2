angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams) {  

  districtService.geoJson(function(data) {
    $rootScope.layers = [{features: data, name: "Uganda Districts"}];
  });

  if (!$routeParams.district) {
    $rootScope.level = "national";
    $rootScope.location_name = "Uganda";
  }
  else {    
    districtService.find_by_name($routeParams.district, function(district){
      $rootScope.district = district;        
      $rootScope.location_name = "Uganda - " + $rootScope.district.name;
    });
  }
});