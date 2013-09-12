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
                if (hierarchy.length == 2)
                    scope.navigateToDistrict(hierarchy[hierarchy.length -1]);
            });

            scope.$watch("layers", function(layers) {
                if (layers != undefined) {
                    layer_info = {
                        unselectedStyle: {
                            "fillOpacity": 0,
                            "color": "#111",
                            "weight": 2
                        },
                        selectedStyle: {
                            "fillOpacity": 0,
                            "color": "#ff0000",
                            "weight": 10
                        },
                        highlightedStyle: {
                            "fillOpacity": 0.2,
                            "color": "#ff0000",
                            "weight": 5  
                        },
                        getHierarchy: function(properties) {
                            return ["uganda", properties["DNAME_2010"].toLowerCase()];
                        },
                        name: "districts"
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
                        unselectedStyle: {
                            "fillOpacity": 0,
                            "color": "#777",
                            "weight": 2
                        },
                        selectedStyle: {
                            "fillOpacity": 0,
                            "color": "#0000ff",
                            "weight": 4
                        },
                        highlightedStyle: {
                            "fillOpacity": 0.2,
                            "color": "#0000ff",
                            "weight": 2  
                        },
                        getHierarchy: function(properties) {
                            return ["uganda", properties["DNAME_2010"].toLowerCase(), properties["SNAME_2010"].toLowerCase()];
                        },
                        name: scope.district.name.toLowerCase() + " subcounties"
                    }

                    map.addNavigationLayer(subcounties.features, layer_info);
                }
            });
        }
    };
})