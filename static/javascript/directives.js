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

            scope.$watch("location", function(newLocation, oldLocation) {
                if (newLocation == undefined)
                    return true;

                map.unselect(newLocation);
                var layerChanges = DT.Location.compareLayerKeys(map.displayedLayers(), scope.location.layersToShow());

                $.each(layerChanges.toRemove, function(index, locationKey) {
                    map.removeLayer(locationKey[0]);
                });

                scope.getData(layerChanges.toAdd).then(function(allData) {
                    $.each(layerChanges.toAdd, function(index, locationKey) {
                        map.addLayer(locationKey[0], locationKey[1], allData[locationKey], DT.LayerOptions[locationKey[0]]);
                    });

                    map.selectLayer(newLocation);
                });
            });
        }
    };
})