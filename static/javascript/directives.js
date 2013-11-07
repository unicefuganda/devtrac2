angular.module("dashboard").directive('map', function() {
    return {
        controller: function($rootScope, $scope, $location, districtService, projectService) {
            $scope.navigateToLocation = function(location) {
                $scope.project.selected = null;
                $location.path(location.toUrl());
            }

            $scope.selectProject = function(projectId) {
                $scope.project.selected = projectService.findById(projectId);
                $rootScope.$broadcast('projectClicked');
            }

            $scope.getData = function(locationKeys) {
                return districtService.getData(locationKeys, $scope.filter);
            };



            if ($location.search().basemap == null) {
                $scope.basemap = 'tcochran.map-hxvpvlhi';
            } else {
                $scope.basemap = $location.search().basemap;
            }
        },
        link: function(scope, element, attrs) {
            var map = new DT.Map(element, scope.basemap);
            window.map = map;

            map.onClickDistrict(function(newLocation) {
                scope.$apply(function (){
                    scope.navigateToLocation(newLocation);
                });
            });

            map.onSelectProject(function(projectFeature) {
                scope.$apply(function (){
                    scope.selectProject(projectFeature.properties['PROJECT_ID']);
                });
            });

            map.onUnselectProject(function() {
                scope.$apply(function (){
                    scope.project.selected = null;
                });
            });

            var applyLocationAndFilter = function(newLocation, newFilter) {

                if (newFilter == null)
                    return;

                var layerChanges = DT.Layers.getChanges(map.displayedLayers(), newLocation, newFilter.dataToggledOff());
                $(".pin span").css("background-color","green");
                $.each(layerChanges.toRemove, function(index, locationKey) {
                    map.removeLayer(locationKey[0]);
                });

                scope.getData(layerChanges.toAdd).then(function(allData) {
                    if (newLocation.equals(scope.location))
                    {
                        $.each(layerChanges.toAdd, function(index, locationKey) {
                            map.addLayer(locationKey[0], locationKey[1], allData[locationKey], DT.LayerOptions[locationKey[0]]);
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

            scope.$watch("project.selected", function(newProject) {
                if (newProject == null)
                    map.unselectProject();
                else
                    map.selectProject(newProject.id);
            });

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
}).directive('partnerstoggle', function(){
    return {
        scope: true,
        link: function(scope, element, attrs){
            scope.$watch('organisation', function(newOrganisation){
                if(newOrganisation == null)
                    return
                if(newOrganisation == 'accountable-agency'){
                    $("#funding-org-select").val('').prop('disabled', true).trigger("chosen:updated");
                    $("#acc-agency-select").prop('disabled', false).trigger("chosen:updated");
                }else{
                    $("#acc-agency-select").val('').prop('disabled', true).trigger("chosen:updated");
                    $("#funding-org-select").prop('disabled', false).trigger("chosen:updated");
                }
                if(scope.filter)
                    scope.filter.project.partners = [];
            });
        }
    }
}).directive('project', function() {
    return {
        link: function(scope, element, attrs) {
            scope.$on('projectClicked', function(project) {
                    // $('html, body').animate({
                    //     scrollTop: $(".detail-panel").offset().top
                    // }, 500);
            });
        }
    }

});
