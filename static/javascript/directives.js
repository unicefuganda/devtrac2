angular.module("dashboard").directive('map', function() {
    return {
        controller: function($rootScope, $scope, $location, districtService, projectService, siteVisitService) {
            $scope.navigateToLocation = function(location) {
                $scope.project.selected = null;
                $location.path(location.toUrl());
            }

            $scope.selectProject = function(feature, layerName) {

                $scope.project.selected = null;

                if (layerName == 'project-point') {
                    $scope.project.selected = projectService.findById(feature.properties['PROJECT_ID']);
                } else if (layerName == 'site-visit-point') {

                    siteVisitService.siteVisitDetail(feature.properties['Title']).then(function(newSiteVisit) {
                         $scope.siteVisit.selected = newSiteVisit;
                    });

                }
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

            map.onSelectIcon(function(projectFeature, layerName) {
                scope.$apply(function (){
                    scope.selectProject(projectFeature, layerName);
                });
            });

            map.onUnselectIcon(function() {
                scope.$apply(function (){
                    scope.project.selected = null;
                    scope.siteVisit.selected = null;
                });
            });

            var applyLocationAndFilter = function(newLocation, newFilter) {

                if (newFilter == null || newLocation == null)
                    return;

                var layerChanges = DT.Layers.getChanges(map.displayedLayers(), newLocation, newFilter.dataToggledOff());
                $(".pin span").css("background-color","green");
                $.each(layerChanges.toRemove, function(index, locationKey) {
                    map.removeLayer(locationKey[0]);
                });

                scope.getData(layerChanges.toAdd).then(function(allData) {

                    DT.timings["getdata"] = new Date().getTime();

                    if (newLocation.equals(scope.location))
                    {
                        $.each(layerChanges.toAdd, function(index, locationKey) {
                            map.addLayer(locationKey[0], locationKey[1], allData[index], DT.LayerOptions[locationKey[0]]);
                        });
                        map.selectLayer(newLocation);
                        map.orderLayers(scope.location.layerOrder());
                    }

                    DT.timings["rendereddata"] = new Date().getTime();
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
                DT.timings["maplocationchange"] = new Date().getTime();

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

            var togglePanel = function() {
                if (scope.expanded)
                {
                    panel.removeClass("expanded");
                    panel.animate(collapseAnimation);
                    scope.expanded = false;
                   	$('.close-panel span').removeClass("glyphicon-chevron-down");
                   	$('.close-panel span').addClass("glyphicon-chevron-up");
                   	$("#filter-panel").css("position", "absolute");
                } else {
                    panel.addClass("expanded");
                    panel.animate(expandAnimation);
                    scope.expanded = true;
                    $('.close-panel span').removeClass("glyphicon-chevron-up");
                   	$('.close-panel span').addClass("glyphicon-chevron-down");
                   	$("#filter-panel").css("position", "fixed");
                }
                return false;
            }
            $(".close-panel").click(function(){
            	togglePanel();
            });
        }
    }
})
.directive('piechart', function() {
    return {
        scope: true,
        link: function(scope, element, attrs) {
            scope.$watch("question.results", function(result) {

                if (result == null || result == "null") {
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
})
.directive('highchartPiechart', function() {
   return {
        scope: true,
        link: function(scope, element, attrs) {
            scope.$watch("question.results", function(result) {
                if (result == null || result == "null")
                    return;
                var data = result.results.map(function(entry) { return [entry.category, entry.percent]})
                $(element).highcharts({
                    chart: {
                        plotBorderWidth: null,
                        plotShadow: false,
                        backgroundColor: '#EEE'
                    },
                    title: {
                        text: ''
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: false,
                            dataLabels: {
                                crop: false,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Browser share',
                        data: data
                    }]
                });
            });
        }
    };
})
.directive('chosen', function() {
    return {
        scope: false,
        link: function(scope, element, attrs) {

            $(element).chosen({ width: "300px", allow_single_deselect: true }).change(function () {
                setTimeout(function() {
                    scope.$apply(function () {
                        var values = $.map($(element).find("option:selected"), function (option) {
                            return $(option).val();
                        });
                        scope.filter.project[attrs.filtercollection] = values
                    });
                }, 10)
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
            scope.$watch('filter.project.organisation', function(newOrganisation){
                scope.show_financialOrg=false;
                if(newOrganisation == null)
                    return
                if(newOrganisation == 'FUNDING'){
                    $("#funding-org-select").val('').trigger("chosen:updated");
                    scope.show_financialOrg=false;
                }else{
                    $("#acc-agency-select").val('').trigger("chosen:updated");
                    scope.show_financialOrg=true;
                }
                if(scope.filter){
                    scope.filter.project.partners = [];
                    scope.filter.project.financialOrgs =[];
                }

            });
        }
    }
})
.directive('printMap', function() {

    return {
        link: function(scope, element) {
            var map = L.map(element.attr("id"), {
                zoomControl: false,
                scrollWheelZoom: false,
                touchZoom: false,
                doubleClickZoom: false,
                dragging: false,
                center: [51.505, -0.09],
                zoom: 13
            });

            var layer = new L.mapbox.tileLayer('tcochran.map-hxvpvlhi', {
                minZoom: 6,
                maxZoom: 18
            });

            map.addLayer(layer);
        }
    }
})
.directive('siteVisitModal',  function(){
    return {
        scope: true,
        link: function(scope, element, attrs) {

             $('#siteVisitModal').on('hidden.bs.modal', function () {
                 scope.$apply(function() {
                    scope.siteVisit.selected = null;
                    scope.project.selected = null;
                 });
            });

            scope.$watch('siteVisit',function(siteVisit){
                if(siteVisit.selected == null) 
                    return;
                $('#siteVisitModal').modal('show');
                
            }, true);

            $('#projectModal').on('hidden.bs.modal', function () {
                 scope.$apply(function() {
                    scope.siteVisit.selected = null;
                    scope.project.selected = null;
                 });
            });

            scope.$watch('project.selected',function(project){
                if(project == null)
                    return;
                $('#projectModal').modal('show');
            }, true);

        }
    }
})
.directive('preventredirection', function(){
    return {
        link: function(scope, element, attrs){
            $(element).click(function(event){
                event.preventDefault();
            });
        }
    }
})
.directive('aboutModal', function(){
    return {
        scope: true,
        link: function(scope, element, attrs) {
            scope.show_modal = function(){
                $('#aboutModal').modal('show');
            }
        }
    }
});

