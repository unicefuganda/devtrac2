angular.module("dashboard").directive('map', function() {
    return {
        controller: function($scope, $location, districtService) {
            $scope.navigateToLocation = function(location) {
                $location.path(location.toUrl());
            }

            $scope.getData = function(locationKeys) {
                return districtService.getData(locationKeys);
            };
        },
        link: function(scope, element, attrs) {
            var map = new DT.Map(element);
            window.map = map;

            map.onClickDistrict(function(newLocation) {
                scope.$apply(function (){
                    scope.navigateToLocation(newLocation);    
                });
            });            

            var applyLocationAndFilter = function(newLocation, newFilter) {
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
                    }
                });

            }

            scope.$watch("filter", function(newFilter, oldFilter) { 
                if (newFilter == undefined)
                    return true;
                applyLocationAndFilter(scope.location, newFilter);
            }, true);

            scope.$watch("location", function(newLocation, oldLocation) {
                map.unselect();

                if (newLocation == undefined)
                    return true;
                applyLocationAndFilter(newLocation, scope.filter);
            });
        }
    };
})