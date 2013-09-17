angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams, $scope, $q) {
    DT.timings["urlchange"] = new Date().getTime();
    var location = $rootScope.location == undefined ? {} : $rootScope.location;
    $rootScope.SearcheableDistricts = [];
    $rootScope.searchText = null;

    function setLocationName(location) {
        var locationName = "Uganda"
        if (location.district)
            locationName += " - " + DT.capitalize(location.district);
        if (location.subcounty)
            locationName += " - " + DT.capitalize(location.subcounty);
        $rootScope.location_name = locationName;
    }

    function loadDistrictData(location) {
        var deferred = $q.defer();
        if ($rootScope.layers != null) {
            deferred.resolve();
            return deferred.promise;
        }

        districtService.geojson(function(data) {
            $rootScope.layers = [{
                features: data,
                name: "Uganda Districts"
            }];
            deferred.resolve({});
        });
        return deferred.promise;
    }

    function loadParishData(location) {
        var deferred = $q.defer();
        if (location.subcounty == null) {
            deferred.resolve();
            return deferred.promise;
        }

        districtService.parishes_geojson(location.subcounty, function(data) {   
            $rootScope.parishes = [{
                features: data,
                name: location.subcounty + " parishes"
                // name: "Uganda Districts"
            }];
            deferred.resolve({});
        });
        return deferred.promise;

    }

    function loadWaterPoints(location) {
        var deferred = $q.defer();

        if (location.district == undefined) {
            deferred.resolve();
            return deferred.promise;
        }

        districtService.water_points(location.district, location.subcounty, function(data) {
            $rootScope.water_points = {
                features: data,
                name: location.district + " water_points"
            };
            deferred.resolve({});

        });
        return deferred.promise;
    }

    function loadSubcountyData(location) {

        var deferred = $q.defer();

        if (location.district == undefined) {
            deferred.resolve();
            return deferred.promise;
        }

        districtService.subcounties_geojson(location.district, function(subcounties_geojson) {
            $rootScope.subcounties = {
                features: subcounties_geojson,
                name: location.district + " subcounties"
            };
            deferred.resolve({});

        });
        return deferred.promise;
    }

    function getLocation() {
        var district_name = $routeParams.district == null ? null : DT.decode($routeParams.district.toLowerCase());
        var subcounty_name = $routeParams.subcounty == null ? null : DT.decode($routeParams.subcounty.toLowerCase());
        var parish_name = $routeParams.parish == null ? null : DT.decode($routeParams.parish.toLowerCase());
        return {
            district: district_name,
            subcounty: subcounty_name,
            parish: parish_name
        }
    };

    function loadSearcheableDistricts(data) {
        var districts = [];

        districtService.getDistrictNames();

        angular.forEach(data.features, function(feature, index) {
            districts.push(feature.properties['DNAME_2010']);
        });
        $rootScope.SearcheableDistricts = districts;
    };


    $rootScope.searchHandler = function() {
        $rootScope.navigateToDistrict($rootScope.searchText);
    };

    // this uses angular promises to load the reference datasets asynchronsoly then set the locations after
    // it will ensure there is no race conditions of not having the right layers loaded when setting the map location
    var newLocation = getLocation();

    

    $q.all([loadDistrictData(newLocation), loadSubcountyData(newLocation), loadParishData(newLocation), loadWaterPoints(newLocation)])
        .then(function(value) {
            setLocationName(newLocation);
            $rootScope.location = newLocation;
        });
});