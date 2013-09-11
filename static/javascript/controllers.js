angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams, $scope) {


    function loadReferenceData() {
        districtService.geojson(function(data) {
            $rootScope.layers = [{
                features: data,
                name: "Uganda Districts"
            }];
        });
    }

    if ($rootScope.layers == null) {
        loadReferenceData();
    }

    if (!$routeParams.district) {
        $rootScope.level = "national";
        $rootScope.location_name = "Uganda";
    } else {
        districtService.find_by_name($routeParams.district, function(district) {
            $rootScope.district = district;
            $rootScope.location_name = "Uganda - " + $rootScope.district.name;

            districtService.subcounties_geojson($routeParams.district, function(subcounties_geojson) {
               
                $rootScope.subcounties = {
                    features: subcounties_geojson,
                    name: district.name + " Subcounties"
                };
                $rootScope.$apply();
            });
        });
    }
});