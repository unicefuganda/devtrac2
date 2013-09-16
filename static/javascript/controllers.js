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

    function loadDistrictData(location) {
        if ($rootScope.layers != null) {
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
        if (location.district == undefined)
            return true;

        var deferred = $q.defer();

        districtService.subcounties_geojson(location.district, function(subcounties_geojson) {
            $rootScope.subcounties = {
                features: subcounties_geojson,
                name: location.district + " subcounties"
            };
            deferred.resolve();

        });

        return deferred.promise;
    }

    function getLocation() {
        var district_name = $routeParams.district == null ? null : DT.decode($routeParams.district.toLowerCase());
        var subcounty_name = $routeParams.subcounty == null ? null : DT.decode($routeParams.subcounty.toLowerCase());
        return {
            district: district_name,
            subcounty: subcounty_name
        }
    };

    // this uses angular promises to load the reference datasets asynchronsoly then set the locations after
    // it will ensure there is no race conditions of not having the right layers loaded when setting the map location

    var newLocation = getLocation();
    $q.all([loadSubcountyData(newLocation), loadDistrictData(newLocation)])
        .then(function() {
            setLocationName(newLocation);
            $rootScope.location = newLocation;
        });
});