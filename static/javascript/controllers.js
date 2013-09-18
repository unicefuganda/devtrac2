angular.module("dashboard").controller("DashboardCtrl", function($rootScope, districtService, $routeParams, $scope, $q, $location) {
    DT.timings["urlchange"] = new Date().getTime();
    var location = $rootScope.location == undefined ? {} : $rootScope.location;


    if ($rootScope.location == undefined) {
        initialPageLoad();
    }

    function initialPageLoad() {
        var newLocation = getLocation();

        loadDistrictData(newLocation)
            .then(function() {
                $rootScope.location = newLocation;
                $rootScope.$watch("location", function(location) {
                    if (location == null)
                        return;

                    if (location.parish != null) {
                        $location.path("/district/" + location.district + "/" + location.subcounty + "/" + location.parish);
                    }
                    else if (location.subcounty != null) {
                        $location.path("/district/" + location.district + "/" + location.subcounty);
                    } else if (location.district != null) {
                        $location.path("/district/" + location.district);
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
});