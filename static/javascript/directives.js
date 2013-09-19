angular.module("dashboard").directive('map', function() {
    return {

        controller: function($scope, $location, districtService, $q) {
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

            $scope.navigateToLocation = function(location) {
                if (location.parish != null) {
                    $location.path("/district/" + DT.encode(location.district) + "/" + DT.encode(location.subcounty) + "/" + DT.encode(location.parish));
                } else if (location.subcounty != null) {
                    $location.path("/district/" + DT.encode(location.district) + "/" + DT.encode(location.subcounty));
                } else if (location.district != null) {
                    $location.path("/district/" + DT.encode(location.district));
                } else {
                    $location.path("/");
                }
            }

            $scope.getDistrictData = function(district) {
                var deffered = $q.defer();
                districtService.fetchDistrictData(district).then(function(data) {
                    deffered.resolve(data);
                })
                return deffered.promise;
            };
        },
        link: function(scope, element, attrs) {
            var map = new DT.Map(element);
            window.map = map;

            map.onClickDistrict(function(newLocation) {

                scope.navigateToLocation(newLocation);
                scope.$apply();
            });

            function addDistrictLayers() {
                if (scope.layers != undefined) {
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
                        },
                        name: "districts"
                    }


                    map.addNavigationLayer(scope.layers[0].features, layer_info);
                }
            }

            function addParishLayers(parishes) {
                layer_info = {
                    unselectedStyle: {
                        "fillOpacity": 0,
                        "color": "#333",
                        "weight": 2
                    },
                    selectedStyle: {
                        "fillOpacity": 0,
                        "color": "#00ff00",
                        "weight": 8
                    },
                    highlightedStyle: {
                        "fillOpacity": 0.2,
                        "color": "#00ff00",
                        "weight": 2
                    },
                    getLocation: function(feature) {
                        return {
                            district: feature.properties["DNAME_2010"].toLowerCase(),
                            subcounty: feature.properties["SNAME_2010"].toLowerCase(),
                            parish: feature.properties["PNAME_2006"].toLowerCase()
                        };
                    },
                    name: "parishes"
                }
                map.addNavigationLayer(parishes.features, layer_info);

            }

            function addWaterPoints(water_points) {
                layer_info = {
                    name: "water points"
                }

                map.addPointsLayer(water_points, layer_info);
            };

            scope.$watch("layers", function() {
                addDistrictLayers();
            });

            scope.$watch("location", function(newLocation, oldLocation) {
                if (newLocation == undefined)
                    return true;

                if (newLocation.district == null) {
                    map.setView(1.0667, 31.8833, 7);
                    return;
                }

                map.unselect(newLocation);

                scope.getDistrictData(newLocation.district).then(function(data) {
                    if (oldLocation == null || newLocation.district != oldLocation.district) {
                        addWaterPoints(data.water_points);
                        addSubCountyLayers(data.subcounties);
                    }

                    //TODO: Refactor this mess
                    if (newLocation.subcounty != null && (oldLocation == null || oldLocation.subcounty == null || newLocation.subcounty != oldLocation.subcounty)) {
                        var parishes = $.grep(data.parishes.features, function(feature, index) {
                            return feature.properties["SNAME_2010"].toLowerCase() == newLocation.subcounty;
                        });

                        addParishLayers({
                            type: "FeatureCollection",
                            features: parishes
                        });
                    }

                    map.selectLayer(newLocation);
                });


            });

            function addSubCountyLayers(subcounties) {
                layer_info = {
                    unselectedStyle: {
                        "fillOpacity": 0,
                        "color": "#777",
                        "weight": 2
                    },
                    selectedStyle: {
                        "fillOpacity": 0,
                        "color": "#0000ff",
                        "weight": 8
                    },
                    highlightedStyle: {
                        "fillOpacity": 0.2,
                        "color": "#0000ff",
                        "weight": 2
                    },
                    getLocation: function(feature) {
                        return {
                            district: feature.properties["DNAME_2010"].toLowerCase(),
                            subcounty: feature.properties["SNAME_2010"].toLowerCase(),
                            parish: null
                        };
                    },
                    name: "subcounties"
                }
                map.addNavigationLayer(subcounties, layer_info);
            };
        }
    };
})