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

            map.onClickDistrict(function(properties, hierarchy) {
                scope.navigateToDistrict(hierarchy.pop());
            });

            scope.$watch("layers", function(layers) {
                if (layers != undefined) {
                    layer_info = {
                        selectedColor: "#ff0000",
                        unselectedColor: "#666",
                        hierarchy: ["uganda"],
                        name: "Districts"
                    }

                    map.addNavigationLayer(layers[0].features, layer_info);
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
                    layer_info = {
                        selectedColor: "#ff0000",
                        unselectedColor: "#ff0000",
                        hierarchy: ["uganda", scope.district.name],
                        name: scope.district.name + " subcounties",
                    }

                    map.addNavigationLayer(subcounties.features, layer_info);                 
                    // map.addSubcountyLayer(subcounties.features, subcounties.name);
                }
            });
        }
    };
})