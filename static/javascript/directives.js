angular.module("dashboard").directive('map', function() {
    return {
        controller: function($rootScope, $scope, $location, districtService, projectService) {
            $scope.navigateToLocation = function(location) {
                $location.path(location.toUrl());
            }

            $scope.selectProject = function(projectId) {
                $scope.project.selected = projectService.findById(projectId)
            }


            $scope.getData = function(locationKeys) {
                return districtService.getData(locationKeys, $scope.filter);
            };

            //TODO: Is there a more angular way of doing this?
            $rootScope.mapResize = function() {

                if ($scope.onresize != null ){
                    $scope.onresize();    
                }
            }
            $scope.onresize = null;

            if ($location.search().basemap == null) {
                $scope.basemap = 'tcochran.map-hxvpvlhi';   
            } else {
                $scope.basemap = $location.search().basemap;
            }

            
            
        },
        link: function(scope, element, attrs) {
            var map = new DT.Map(element, scope.basemap);
            window.map = map;
            
            scope.onresize = function() {
                map.redraw();
            };

            map.onClickDistrict(function(newLocation) {
                scope.$apply(function (){
                    scope.navigateToLocation(newLocation);    

                });
            });

            map.onClickProject(function(projectFeature) {
                scope.$apply(function (){
                    scope.selectProject(projectFeature.properties['PROJECT_ID']); 
                });
            });

            var applyLocationAndFilter = function(newLocation, newFilter) {

                if (newFilter == null)
                    return; 
                
                var layerChanges = DT.Layers.getChanges(map.displayedLayers(), newLocation, newFilter.dataToggledOff());

                $.each(layerChanges.toRemove, function(index, locationKey) {                    
                    map.removeLayer(locationKey[0]);
                });

                scope.getData(layerChanges.toAdd).then(function(allData) {
                    if (newLocation.equals(scope.location))
                    {
                        $.each(layerChanges.toAdd, function(index, locationKey) {
                            var layerOptions = DT.LayerOptions[locationKey[0]];
                            layerOptions.markerColorLegend = DT.markerColorLegend;

                            map.addLayer(locationKey[0], locationKey[1], allData[locationKey], layerOptions);
                        });
                        map.selectLayer(newLocation);
                        map.orderLayers(scope.location.layerOrder());
                    }
                });
            }

            scope.$watch("filter", function(newFilter, oldFilter) { 
                if (newFilter == undefined)
                    return true;
                applyLocationAndFilter(scope.location, newFilter);
            }, true);

            scope.$watch("ureportQuestion.selected", function(newQuestion) {
                applyLocationAndFilter(scope.location, scope.filter);
            }, false);

            scope.$watch("indicator", function(newIndicator, oldIndicator){
                if (newIndicator == undefined)
                    return true;
                if (newIndicator.selected == null)
                    map.removeWMSLayer();
                else 
                    map.addWMSLayer(newIndicator.selected.wmsUrl, newIndicator.selected.layer);
            }, true);

            scope.$watch("location", function(newLocation, oldLocation) {
                map.unselect();

                if (newLocation == undefined)
                    return true;
                applyLocationAndFilter(newLocation, scope.filter);
            });
        }
    };
}).directive('panel', function() {
    return {
        scope: true,
        link: function(scope, element, attrs) {
            scope.expanded = true;
            
            var expandAnimation = JSON.parse(attrs.panelExpand);
            var collapseAnimation = JSON.parse(attrs.panelCollapse);
            var panel = $(element);

            scope.togglePanel = function() {
                if (scope.expanded)
                {   
                    panel.removeClass("expanded");
                    panel.animate(collapseAnimation);;
                    scope.expanded = false;
                } else {
                    panel.addClass("expanded");
                    panel.animate(expandAnimation);
                    scope.expanded = true;
                }
                return false;
            }
        }
    };
}).directive('piechart', function() {
    return {
        scope: true,
        link: function(scope, element, attrs) {
            scope.$watch("ureportResults", function(result) {
                if (result == null){
                    scope.show_pie = false;
                    return;
                }
                scope.show_pie = true;

                scope.data = $.map(result.results, function(percent_row, index) {
                    return {
                        label: percent_row.category,
                        data: percent_row.percent,
                        color: DT.piechart_colors[index]
                    }
                });

                var piechart = $(element).find(".flot-piechart");

                $.plot(piechart, scope.data, {
                    series: {
                        pie: {
                            show: true,
                            label: { show: false }
                        }
                    },
                    legend: { show: false }
                });
            });
        }
    };
}).directive('chosen', function() {
    return {
        scope: false,
        link: function(scope, element, attrs) {
            $(element).chosen({ width: "300px", allow_single_deselect: true }).change(function () {
                scope.$apply(function () {
                    var values = $.map($(element).find("option:selected"), function (option) { return $(option).val(); }); 
                    scope.filter.project[attrs.filtercollection] = values
                });
            });

            scope.$watch(attrs.filtercollection, function(sectors) {
                scope.$evalAsync(function () {
                    $(element).trigger("chosen:updated");    
                })
            });
        }
    };
});
