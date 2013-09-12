angular.module("dashboard").directive('map', function() {
    return {

        controller: function($scope, $location) {
            $scope.navigateToDistrict = function(districtName) {
                console.log("change district")
                $location.path("/district/" + districtName);
                $scope.$apply();
            }

            $scope.navigateToSubcounty = function(districtName,subcountyName) {
                console.log("change district")
                $location.path("/district/" + districtName + "/" + subcountyName);
                $scope.$apply();
            }
        },
        link: function(scope, element, attrs) {
            var map = new DevTrac.Map(element);
            window.map = map;

            map.onClickDistrict(function(properties, hierarchy) {
                if (hierarchy.length == 2)
                    scope.navigateToDistrict(hierarchy[hierarchy.length -1]);
                if (hierarchy.length == 3)
                    scope.navigateToSubcounty(hierarchy[hierarchy.length -2], hierarchy[hierarchy.length -1]);
            });

            scope.$watch("layers", function(layers) {
                if (layers != undefined) {
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

                    map.addNavigationLayer(layers[0].features, layer_info);
                }
            });

            scope.$watch("subcounty", function() {
                if (scope.subcounty != undefined)
                {
                    console.log(scope.subcounty);
                    map.selectLayer(scope.district.name .toLowerCase()+ " subcounties", scope.subcounty);    
                }

            })

            scope.$watch("district", function() {
                if (scope.district != undefined) {
                    var coords = scope.district.centroid.coordinates
                    map.selectLayer("districts", scope.district.name.toLowerCase());    
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