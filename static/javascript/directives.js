angular.module("dashboard").directive('map', function() {
    return {

        controller: function($scope, $location) {
            $scope.navigateToDistrict = function(districtName) {
                $location.path("/district/" + districtName);
                $scope.$apply();
            }
        },
        link: function(scope, element, attrs) {
            var map = new DevTrac.Map(element);
            window.map = map;

            map.onClickDistrict(function(districtName) {
                scope.navigateToDistrict(districtName);
            });

            scope.$watch("layers", function(layers) {
                if (layers != undefined) {
                    map.addDistrictLayer(layers[0].features, layers[0].name);
                }
            });

            scope.$watch("district", function() {
                if (scope.district != undefined) {
                    var coords = scope.district.centroid.coordinates
                    map.setView(coords[1], coords[0], 10);
                }
            });

            scope.$watch("level", function() {
                if (scope.level == "national") {
                    map.setView(1.0667, 31.8833, 7);
                }
            });

            scope.$watch("subcounties", function(subcounties) {
                if (subcounties  != null) {                  
                    map.addSubcountyLayer(subcounties.features, subcounties.name);
                }
            });
        }
    };
})