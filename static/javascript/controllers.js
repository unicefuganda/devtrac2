angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams, $scope, $q) {
    DT.timings["urlchange"] = new Date().getTime();
    var location = $rootScope.location == undefined ? {} : $rootScope.location;

    function setLocationName(location) {
        var locationName = "Uganda"
        if (location.district)
            locationName += " - " + DT.capitalize(location.district);
        if (location.subcounty)
            locationName += " - " + DT.capitalize(location.subcounty);
        $rootScope.location_name = locationName;
    }

    function loadDistrictData() {
        if ($rootScope.layers != null ) {
            return true;
        }

        var deferred = $q.defer();

        districtService.geojson(function(data) {
            $rootScope.layers = [{
                features: data,
                name: "Uganda Districts"
            }];

            deferred.resolve();            
        });
        return deferred.promise;
    }


    function loadSubcountyData(location) {
        if ($routeParams.district == location.district) {
            return true;
        }

        var deferred = $q.defer();

        districtService.subcounties_geojson($routeParams.district, function(subcounties_geojson) {
            $rootScope.subcounties = {
                features: subcounties_geojson,
                name: $routeParams.district.toLowerCase() + " subcounties"
            };
            deferred.resolve();

        });

        return deferred.promise;
    }

    function setLocation() {
        var district_name = $routeParams.district == null ? null : $routeParams.district.toLowerCase();
        var subcounty_name = $routeParams.subcounty == null ? null : $routeParams.subcounty.toLowerCase(); 
        $rootScope.location = {
            district: district_name,
            subcounty: subcounty_name
        }
        setLocationName(location);
    };

    (function loadReferenceData() {
        $q.all([loadSubcountyData(location), loadDistrictData()]).then(setLocation);
    })();

});