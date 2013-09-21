if (typeof DT == "undefined")
    DT = {};

DT.LayerOptions = {
    "parish": {
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#333",
            "weight": 2
        },
        selectedStyle: {
            "fillOpacity": 0,
            "color": "#00ff00",
            "weight": 8
        },
        highlightedStyle: {
            "fillOpacity": 0.2,
            "color": "#00ff00",
            "weight": 2
        },
        getLocation: function(feature) {
            return new DT.Location({
                district: feature.properties["DNAME_2010"].toLowerCase(),
                subcounty: feature.properties["SNAME_2010"].toLowerCase(),
                parish: feature.properties["PNAME_2006"].toLowerCase()
            });
        },
        key: "parish",
        type: "boundary"
    },

    "district": {
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
            return new DT.Location({
                district: feature.properties["DNAME_2010"].toLowerCase(),
            });
        },
        key: "district",
        type: "boundary"

    },
    "subcounty": {
        unselectedStyle: {
            "fillOpacity": 0,
            "color": "#777",
            "weight": 2
        },
        selectedStyle: {
            "fillOpacity": 0,
            "color": "#0000ff",
            "weight": 8
        },
        highlightedStyle: {
            "fillOpacity": 0.2,
            "color": "#0000ff",
            "weight": 2
        },
        getLocation: function(feature) {
            return new DT.Location({
                district: feature.properties["DNAME_2010"].toLowerCase(),
                subcounty: feature.properties["SNAME_2010"].toLowerCase()
            });
        },
        name: "subcounty",
        type: "boundary"
    },
    "water_point": {
        name: "water_point",
        type: "points"
    }
}

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

                    if (newLocation.district == null) {
                        map.setView(1.0667, 31.8833, 7);
                        return;
                    } else {
                        map.selectLayer(newLocation);
                    }
                });
            });
        }
    };
})