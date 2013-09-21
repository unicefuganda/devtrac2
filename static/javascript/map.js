if (typeof DT == "undefined")
    DT = {};
DT.testing = false;

DT.LeafletMap = function(element) {
    var self = this,
        map = L.map(element.attr("id"), {
            zoomControl: true
        });

    map.on("baselayerchange", function(layer) {
        self.activeLayer = layer;
    });

    map.on("movestart", function(layer) {
        DT.timings["movestart"] = new Date().getTime();
    });

    map.on("moveend", function(layer) {
        DT.timings["moveend"] = new Date().getTime();
    });

    map.on("zoomstart", function(layer) {
        DT.timings["zoomstart"] = new Date().getTime();
    });

    map.on("zoomend", function(layer) {
        DT.timings["zoomend"] = new Date().getTime();
    });

    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var testingUrl = 'http://localhost:5000/stub_tiles/{s}/{z}/{x}/{y}.png';

    var tileServerUrl = DT.testing ? testingUrl : osmUrl;
    var osm = new L.TileLayer(tileServerUrl, {
        minZoom: 7,
        maxZoom: 18
    });
    map.addLayer(osm);
    return map;
}

DT.Map = function(element) {

    var map = DT.LeafletMap(element);
    self.layers = {};
    window.layerMap = new DT.LayerMap();
    window.mapmap = map;

    self.markerPopupMessage = function(property) {
        var message = '<h4>' + property.SourceType + '</h4>';
        message += '<label>Functional status:</label> ' + property.Functional + '</br>';
        message += '<label>Management:</label> ' + property.Management + '</br>';
        return message;
    };

    function findLayer(location) {
        for (var key in self.layers) {
            var layer_group = self.layers[key];
            var found_layer = DT.first(layer_group, function(layer) {
                return angular.equals(layer.location, location);
            });

            if (found_layer != null)
                return found_layer;
        }

        return null;
    }

    function unselect() {
        //TODO: Refactor this mess
        $.each(self.layers, function(index, layer_group) {
            $.each(layer_group, function(index, layer) {
                layer.unselect();
            });
        });

        DT.timings["unselectend"] = new Date().getTime();
    }

    function allLayers() {
        var allLayers = [];
        for (var key in self.layers) {
            allLayers = allLayers.concat(self.layers[key]);
        }
        return allLayers;
    }

    function addBoundaryLayer(name, location, features, layer_info) {
        var baseLayer = L.geoJson(features, {
            style: {
                weight: 2,
                fillOpacity: 0,
                color: "0000ff"
            },
            onEachFeature: function(data, layer) {

                var options = $.extend({}, layer_info, {
                    clickLayerHandler: function(layer) {
                        self.clickDistrictHandler(layer.location);
                    },
                    location: layer_info.getLocation(data),
                });
                var layer = new DT.Layer(layer, options, data.properties, map)
                if (self.layers[layer_info.name] == null)
                    self.layers[layer_info.name] = []
                self.layers[layer_info.name].push(layer);
            },
        });
        self.layerMap.addLayer(name, location, baseLayer);
        map.addLayer(baseLayer, true);
    }

    function addPointsLayer(name, location, features, layer_info) {
        var circleIcon = new L.DivIcon({
            iconSize: new L.Point([10, 10]),
            className: "water-icon",
            html: "",
            popupAnchor: [5, -10]
        });
        var geojsonMarkerOptions = {
            zIndexOffset: 10000,
            icon: circleIcon
        };

        var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            spiderfyOnMaxZoom: false,
            removeOutsideVisibleBounds: false,
            disableClusteringAtZoom: 13,

            iconCreateFunction: function(cluster) {
                return new L.DivIcon({
                    iconSize: new L.Point([20, 20]),
                    className: "cluster-icon",
                    html: '<b>' + cluster.getChildCount() + '</b>'
                });
            }
        });

        L.Icon.Default.imagePath = '/static/javascript/lib/images/';

        $.each(features.features, function(index, feature) {
            var coordinates = feature.geometry.coordinates;
            var marker = new L.Marker(new L.LatLng(coordinates[1], coordinates[0]), geojsonMarkerOptions);
            var popup = L.popup({
                className: "marker-popup",
                closeButton: false
            }).setContent(self.markerPopupMessage(feature.properties));

            marker.bindPopup(popup)
                .on('mouseover', function() {
                    marker.openPopup();
                })
                .on('mouseout', function() {
                    marker.closePopup();
                })
            markers.addLayer(marker);

        });

        self.layerMap.addLayer(name, location, markers);
        map.addLayer(markers);
        self.water_points = markers;
    }

    return {
        addLayer: function(name, location, features, layer_info) {
            if (layer_info.type == "boundary") {
                addBoundaryLayer(name, location, features, layer_info);
            } else {
                addPointsLayer(name, location, features, layer_info);
            }
        },
        setView: function(lat, lng, zoom) {
            map.setView(new L.LatLng(lat, lng), zoom);
        },
        setZoom: function(zoom) {
            map.setView(map.getCenter(), zoom);
        },
        onClickDistrict: function(handler) {
            self.clickDistrictHandler = handler;
        },
        getCenter: function() {
            var center = map.getCenter();
            return [center.lat, center.lng];
        },
        getZoom: function() {
            return map.getZoom();
        },
        getSelectedLayer: function() {
            var layer = DT.first(allLayers(), function(layer) {
                return layer.isSelected();
            });
            return layer.location.getName();
        },
        getHighlightedLayer: function(layer_name) {
            var layer = DT.first(allLayers(), function(layer) {
                return layer.isHighlighted();
            });
            if (layer == null)
                return null;
            return layer.location.getName();
        },
        highlightLayer: function(location) {
            $.each(allLayers(), function(index, layer) {
                layer.unhighlight();
            });
            findLayer(location).highlight();
        },
        clickLayer: function(location) {
            findLayer(location).select();
        },
        unselect: function(location) {
            unselect(location);
        },
        selectLayer: function(location) {
            findLayer(location).focusLayer();
        },
        isDisplayed: function(location) {
            return findLayer(location) != null;
        },
        displayedLayers: function() {
            return self.layerMap.displayedLayerKeys();
        },
        removeLayer: function(key) {
            var layer = self.layerMap.removeLayer(key);
            map.removeLayer(layer);
        }
    }
};


DT.Layer = function(leafletLayer, options, featureProperties, map) {
    var self = this;
    self.options = options;
    self.featureProperties = featureProperties;

    leafletLayer.setStyle(options.unselectedStyle);
    // self.hierarchy = options.getHierarchy(featureProperties);

    leafletLayer.on("click", function() {
        DT.timings["click"] = new Date().getTime();
        self.select();
    });

    leafletLayer.on("mouseout", function() {
        self.unhighlight();
    });

    leafletLayer.on("mouseover", function() {
        self.highlight();
    });

    self.unselect = function() {
        leafletLayer.setStyle(options.unselectedStyle);
        self.selected = false;
        self.highlighted = false;
    };
    self.select = function() {
        if (options.clickLayerHandler) {
            options.clickLayerHandler(self);
        }
        self.focusLayer();
    };

    self.focusLayer = function() {
        if (self.selected)
            return;

        self.selected = true;
        leafletLayer.setStyle(options.selectedStyle);
        map.fitBounds(leafletLayer.getBounds());
    };

    self.highlight = function() {
        if (!self.selected) {
            leafletLayer.setStyle(options.highlightedStyle);
            self.highlighted = true;
        }
    };

    self.unhighlight = function() {
        if (!self.selected) {
            leafletLayer.setStyle(options.unselectedStyle);
            self.highlighted = false;
        }
    };
    self.location = options.location;

    return {
        unselect: self.unselect,
        leafletLayer: leafletLayer,
        hierarchy: self.hierarchy,
        unhighlight: self.unhighlight,
        highlight: self.highlight,
        select: self.select,
        location: options.location,
        isSelected: function() {
            return self.selected;
        },
        focusLayer: self.focusLayer,
        isHighlighted: function() {
            return self.highlighted;
        }
    };
};