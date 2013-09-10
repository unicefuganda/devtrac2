angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams) {  
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