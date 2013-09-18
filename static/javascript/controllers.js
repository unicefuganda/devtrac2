angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams, $scope, $q, $location) {
    DT.timings["urlchange"] = new Date().getTime();
    var location = $rootScope.location == undefined ? {} : $rootScope.location;
    // $rootScope.SearcheableDistricts = [];
    // $rootScope.searchText = null;


    if ($rootScope.location == undefined) {

        initialPageLoad();
    }

    function initialPageLoad() {
        var newLocation = getLocation(); 

        $q.all([loadDistrictData(newLocation)])
            .then(function(value) {
                $rootScope.location = newLocation;
            })
            .then(function() {
                $rootScope.$watch("location", function(location) {
                    if (location != null && location.district != null) {
                        $location.path("/district/" + location.district);
                        loadSubcountyData(location);
                    }
                });
            });
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
            }];
            deferred.resolve({});
        });
        return deferred.promise;
    }

    function loadParishData(location) {
        var deferred = $q.defer();
        if (location.district == undefined) {
            deferred.resolve();
            return deferred.promise;
        }

        districtService.parishes_geojson(location.district, function(data) {
            $rootScope.parishes = [{
                features: data
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
                features: subcounties_geojson
            };
            deferred.resolve({});

        });
        return $q.all(deferred.promise, loadParishData(location));
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
    



});