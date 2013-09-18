angular.module("dashboard").directive('map', function() {
    return {

        controller: function($scope, $location) {
            $scope.navigateToDistrict = function(districtName) {
                $location.path("/district/" + DT.encode(districtName));
                $scope.$apply();
            }

            $scope.navigateToSubcounty = function(districtName, subcountyName) {
                $location.path("/district/" + DT.encode(districtName) + "/" + DT.encode(subcountyName));
                $scope.$apply();
            }

            $scope.navigateToParish = function(districtName, subcountyName, parishName) {
                $location.path("/district/" + DT.encode(districtName) + "/" + DT.encode(subcountyName) + "/" + DT.encode(parishName));
                $scope.$apply();
            }
        },
        link: function(scope, element, attrs) {
            var map = new DT.Map(element);
            window.map = map;

            map.onClickDistrict(function(newLocation) {
                scope.location = newLocation;
                scope.$apply();
            });

            function addDistrictLayers() {
                if (scope.layers != undefined) {
                    console.log("load layers");
                    layer_info = {
                        unselectedStyle: {
                            "fillOpacity": 0,
                            "color": "#333",
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
                        getLocation: function(feature) {
                            return {
                                district: feature.properties["DNAME_2010"].toLowerCase(),
                                subcounty: null,
                                parish: null
                            };
                        }
                    }

                    map.addNavigationLayer(scope.layers[0].features, layer_info);
                }
            }

            function addParishLayers() {
                if (scope.parishes != undefined) {
                    layer_info = {
                        unselectedStyle: {
                            "fillOpacity": 0,
                            "color": "#333",
                            "weight": 2
                        },
                        selectedStyle: {
                            "fillOpacity": 0,
                            "color": "#00ff00",
                            "weight": 3
                        },
                        highlightedStyle: {
                            "fillOpacity": 0.2,
                            "color": "#00ff00",
                            "weight": 2
                        },
                        getLocation: function() {
                            return {
                                district: feature.properties["DNAME_2010"].toLowerCase(),
                                subcounty: feature.properties["SNAME_2010"].toLowerCase(),
                                parish: feature.properties["PNAME_2006"].toLowerCase()
                            };
                        }
                    }
                    map.addNavigationLayer(scope.parishes[0].features, layer_info);
                }

            }

            function addWaterPoints() {
                if (scope.water_points != undefined) {
                    layer_info = {
                        name: scope.water_points.name,

                    }

                    map.addPointsLayer(scope.water_points.features, layer_info);
                }

            };

            scope.$watch("layers", function() {

                addDistrictLayers();
            });

            scope.$watch("subcounties", function() {
                addSubCountyLayers();
            });

            scope.$watch("location", function(location) {
                console.log("location", location);
                if (location == undefined)
                    return true;

                if (location.district == null) {
                    map.setView(1.0667, 31.8833, 7);
                } else if (location.district != undefined && location.subcounty == null) {
                    map.selectLayer(location);
                    addSubCountyLayers();
                    addWaterPoints();

                } else if (scope.location.subcounty != undefined && location.parish == null) {
                    addSubCountyLayers();
                    addWaterPoints();
                    addParishLayers();
                } else if (scope.location.parish != undefined) {
                    addSubCountyLayers();
                    addWaterPoints();
                    addParishLayers();
                }

                var date = new Date();
            });

            function addSubCountyLayers() {
                if (scope.subcounties != null) {
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
                        getLocation: function(feature) {
                            return $.extend({}, scope.subcounties.location, {
                                district: feature.properties["DNAME_2010"].toLowerCase(),
                                subcounty: feature.properties["SNAME_2010"].toLowerCase(),
                                parish: null
                            });
                        }
                    }
                    map.addNavigationLayer(scope.subcounties.features, layer_info);
                }
            };
        }
    };
})