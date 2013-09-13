angular.module("dashboard").directive('map', function() {
    return {

        controller: function($scope, $location) {
            $scope.navigateToDistrict = function(districtName) {
                $location.path("/district/" + districtName);
                $scope.$apply();
            }

            $scope.navigateToSubcounty = function(districtName,subcountyName) {
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



            scope.$watch("layers", function(layers) {
                
            });

            scope.$watch("district", function() {
                
            });

            scope.$watch("location", function() {

                var location = scope.location
                if (location == undefined)
                    return true;

                addDistrictLayers();
                addSubCountyLayers();


                if (location.district == null) {
                    map.setView(1.0667, 31.8833, 7);
                }
                else if (location.district != undefined && location.subcounty == null) {
                    map.selectLayer(scope.location.district, "districts");    
                }

                if (scope.location.subcounty != undefined)
                {
                    map.selectLayer(scope.location.subcounty, location.district + " subcounties");    
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
                        name: scope.location.district + " subcounties"   
                    }
                    map.addNavigationLayer(scope.subcounties.features, layer_info);                    

                }
            };
        }
    };
})