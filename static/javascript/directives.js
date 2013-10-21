angular.module("dashboard").directive('map', function() {
    return {
        controller: function($rootScope, $scope, $location, districtService) {
            $scope.navigateToLocation = function(location) {
                $location.path(location.toUrl());
            }

            $scope.getData = function(locationKeys) {
                return districtService.getData(locationKeys);
            };

            //TODO: Is there a more angular way of doing this?
            $rootScope.mapResize = function() {

                if ($scope.onresize != null ){
                    $scope.onresize();    
                }
            }
            $scope.onresize = null;
        },
        link: function(scope, element, attrs) {
            var map = new DT.Map(element);
            window.map = map;
            
            scope.onresize = function() {
                map.redraw();
            };

            map.onClickDistrict(function(newLocation) {
                scope.$apply(function (){
                    scope.navigateToLocation(newLocation);    
                });
            });            

            var applyLocationAndFilter = function(newLocation, newFilter) {

                if (newFilter == null)
                    return; 
                
                var layerChanges = DT.Location.compareLayerKeys(map.displayedLayers(), newLocation.layersToShow(newFilter.dataToggledOff()));                
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
})