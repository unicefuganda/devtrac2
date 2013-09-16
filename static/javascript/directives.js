angular.module("dashboard").directive('map', function() {
    return {

        controller: function($scope, $location) {
            $scope.navigateToDistrict = function(districtName) {
                $location.path("/district/" + DT.encode(districtName));
                $scope.$apply();
            }

            $scope.navigateToSubcounty = function(districtName,subcountyName) {
                $location.path("/district/" + DT.encode(districtName) + "/" + DT.encode(subcountyName));
                $scope.$apply();
            }
        },
        link: function(scope, element, attrs) {
            var map = new DT.Map(element);
            window.map = map;

            map.onClickDistrict(function(properties, hierarchy) {
                if (hierarchy.length == 2)
                    scope.navigateToDistrict(hierarchy[hierarchy.length -1]);
                if (hierarchy.length == 3)
                    scope.navigateToSubcounty(hierarchy[hierarchy.length -2], hierarchy[hierarchy.length -1]);
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
                        getHierarchy: function(properties) {
                            return ["uganda", properties["DNAME_2010"].toLowerCase()];
                        },
                        name: "districts"
                    }

                    map.addNavigationLayer(scope.layers[0].features, layer_info);
                }   
            }

            function addWaterPoints() {
                if (scope.water_points != undefined) {
                    layer_info = {
                        name: scope.water_points.name
                    }

                    map.addPointsLayer(scope.water_points.features, layer_info);
                }   

            };

            scope.$watch("layers", function() {
                addDistrictLayers();
            });

            scope.$watch("location", function() {
                var location = scope.location
                if (location == undefined)
                    return true;

                if (location.district == null) {
                    map.unselect();
                    map.setView(1.0667, 31.8833, 7);
                }
                else if (location.district != undefined && location.subcounty == null) {
                    map.unselect();
                    addSubCountyLayers();
                    map.selectLayer("districts", scope.location.district);    
                }

                if (scope.location.subcounty != undefined)
                {
                    map.unselect();
                    addSubCountyLayers();
                    addWaterPoints();
                    map.selectLayer(location.district + " subcounties", scope.location.subcounty);    
                }

                var date = new Date();
            });

            function addSubCountyLayers() {
                if (scope.subcounties  != null) { 
                    var location = scope.location
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
                        name: scope.subcounties.name  
                    }
                    map.addNavigationLayer(scope.subcounties.features, layer_info);                    
                }
            };
        }
    };
})