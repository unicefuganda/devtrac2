angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams, $scope, $q) {
    if ($rootScope.location == undefined) {
        $rootScope.location = {};
    }

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function setLocationName() {
        var locationName = "Uganda"
        if ($rootScope.location.district)
            locationName += " - " + capitaliseFirstLetter($rootScope.location.district);
        if ($rootScope.location.subcounty)
            locationName += " - " + capitaliseFirstLetter($rootScope.location.subcounty);
        $rootScope.location_name = locationName;
    }

    function loadDistrictData(onSuccess) {
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


    function loadSubcountyData(onSuccess) {
        if ($rootScope.location != null && $routeParams.district == $rootScope.location.district) {
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
        setLocationName();
    };

    (function loadReferenceData() {
        $q.all([loadSubcountyData(), loadDistrictData()]).then(setLocation);
    })();

});