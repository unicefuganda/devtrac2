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
                scope.location = newLocation;
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
                        }
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
                        "weight": 3
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
                    }
                }
                map.addNavigationLayer(parishes.features, layer_info);

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

            scope.$watch("location", function(newLocation, oldLocation) {
                if (newLocation == undefined)
                    return true;

                if (newLocation.district == null) {
                    map.setView(1.0667, 31.8833, 7);
                    return;
                }

                scope.getDistrictData(newLocation.district).then(function(data){
                    if (oldLocation == null || newLocation.district != oldLocation.district)
                        addSubCountyLayers(data.subcounties);

                    if (newLocation.subcounty != null && (oldLocation == null || oldLocation.subcounty == null || newLocation.subcounty != oldLocation.subcounty))
                        addParishLayers(data.parishes);

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
                        "weight": 4
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
                    }
                }
                map.addNavigationLayer(subcounties, layer_info);
            };
        }
    };
})