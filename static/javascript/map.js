var DT = {};
DT.testing = false;

DT.Map = function(element) {

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

    self.layers = {};

    self.markerPopupMessage = function(property) {
        var message = '<h4>' + property.SourceType +'</h4>';
        message += '<label>Functional status:</label> ' + property.Functional + '</br>';
        message += '<label>Management:</label> ' + property.Management + '</br>';
    };

    function findLayer(location) {
        console.log(location)
        for (var key in self.layers) {
            var layer_group = self.layers[key];
            var layer = DT.first(layer_group, function(layer) {
                // console.log(layer.location)
                return angular.equals(layer.location, location);
            });

            if (layer != null)
                return layer;
        }

        return null;
    }

    function unselect(newLocation) {
        //TODO: Refactor this mess
        $.each(self.layers, function(index, layer_group) {
            $.each(layer_group, function(index, layer) {
                layer.unselect();

                if (newLocation.subcounty == null ) {
                    if (layer.location.subcounty != null && layer.location.district != newLocation.district ) {
                        map.removeLayer(layer.leafletLayer);
                    }
                } 
                if (newLocation.parish == null) {
                    if (layer.location.parish != null)
                        map.removeLayer(layer.leafletLayer);
                }

            });
        });

        if (newLocation.subcounty == null && self.water_points != null)
            map.removeLayer(self.water_points);

        if (newLocation.subcounty == null)
            self.layers["subcounties"] = [];
        if (newLocation.parish == null)
            self.layers["parish"] = [];

        DT.timings["unselectend"] = new Date().getTime();
    }

    return {
        addPointsLayer: function(features, layer_info) {
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
                var popup = L.popup({className: "marker-popup", closeButton: false}).setContent(self.markerPopupMessage(feature.properties));

                marker.bindPopup(popup)
                    .on('mouseover', function() {
                        marker.openPopup();
                    })
                    .on('mouseout', function() {
                        marker.closePopup();
                    })
                markers.addLayer(marker);

            });

            map.addLayer(markers);
            self.water_points = markers;
        },
        addNavigationLayer: function(features, layer_info) {
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
            map.addLayer(baseLayer, true);
            if (self.water_points != null)
                self.water_points.bringToFront();

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
        getLayers: function() {
            return self.navigation_layers;
        },
        getSelectedLayer: function(layer_name) {
            for (var key in self.layers) {
                var layer_group = self.layers[key];
                var layer = DT.first(layer_group, function(layer) {
                    return layer.name == layer_name && layer.isSelected();
                });
                if (layer != null)
                    return layer.location;
            }
            return null;
        },
        getHighlightedLayer: function(layer_name) {
            var layer = DT.first(self.layers, function(layer) {
                return layer.name == layer_name && layer.isHighlighted();
            });
            if (layer == null)
                return null;
            return layer.location_name;
        },
        highlightLayer: function(layer_name, location_name) {
            $.each(self.layers, function(index, layer) {
                layer.unhighlight();
            });
            findLayer(layer_name, location_name).leafletLayer.fire("mouseover");
        },
        clickLayer: function(layer_name, location_name) {
            findLayer(layer_name, location_name).select();
        },
        unselect: function(location){
            unselect(location);
        },
        selectLayer: function(location) {
            // unselect(location);
            findLayer(location).focusLayer();
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
        // location_name: self.hierarchy[self.hierarchy.length - 1],
        unselect: self.unselect,
        leafletLayer: leafletLayer,
        hierarchy: self.hierarchy,
        unhighlight: self.unhighlight,
        highlight: self.highlight,
        select: self.select,
        // name: options.name,
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