if (typeof DT == "undefined")
    DT = {};
DT.testing = false;
DT.Map = function(element) {

    var self = this;
    var map = L.map(element.attr("id"), {
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
        minZoom: 6,
        maxZoom: 18
    });
    map.addLayer(osm);
    self.layerMap = new DT.LayerMap();
    window.mapmap = map;

    function unselect() {
        $.each(self.layerMap.allChildLayers(), function(index, layer) {
            layer.unselect();
        });

        DT.timings["unselectend"] = new Date().getTime();
    }

    function addBoundaryLayer(name, location, features, layer_info) {
        var baseLayer = L.geoJson(features, {
            onEachFeature: function(data, layer) {

                var options = $.extend({}, layer_info, {
                    clickLayerHandler: function(layer) {
                        self.clickDistrictHandler(layer.location);
                    },
                    location: layer_info.getLocation(data),
                });
                var layer = new DT.Layer(layer, options, data.properties, map)
                self.layerMap.addChildLayer(name, location, options.location, layer);
            },
        });
        self.layerMap.addLayer(name, location, baseLayer);
        map.addLayer(baseLayer, true);
    }

    function addPointsLayer(name, location, features, layer_info) {
        // TODO: refactor
        var markerPopupMessage = function(property) {
            var message = '<h4>' + property.SourceType + '</h4>';
            message += '<label>Functional status:</label> ' + property.Functional + '</br>';
            message += '<label>Management:</label> ' + property.Management + '</br>';
            return message;
        };
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
                var latlng = cluster.getLatLng()
                var childCount = cluster.getChildCount();
                var className = "";
                // if (childCount > 10)
                //     className = "medium";
                // if (childCount > 25)
                //     className = "large";
                // if (childCount > 50)
                //     className = "extra-large";


                return new L.DivIcon({
                    iconSize: new L.Point([20, 20]),
                    className: layer_info.name +"-cluster-icon " + className,

                    html: "<div data-lat='"+ latlng.lat.toFixed(4) +"' data-lng='" + latlng.lng.toFixed(4) + "'>" 
                        + cluster.getChildCount()
                        + '</div>'
                });
            }
        });

        L.Icon.Default.imagePath = '/static/javascript/lib/images/';
        window.markers = []

        $.each(features.features, function(index, feature) {
            var coordinates = feature.geometry.coordinates;

            var circleIcon = new L.DivIcon({
                iconSize: new L.Point([10, 10]),
                className: layer_info.name + "-icon",
                html: "<div data-lat='"+ coordinates[1].toFixed(4) +"' data-lng='" + coordinates[0].toFixed(4) + "'></div>",
                // html:"",
                popupAnchor: [5, -10]
            });
            var geojsonMarkerOptions = {
                zIndexOffset: 10000,
                icon: circleIcon
            };

            
            var marker = new L.Marker(new L.LatLng(coordinates[1], coordinates[0]), geojsonMarkerOptions);

            window.markers.push(marker);
            // window.marker = marker;
            var popup = L.popup({
                className: "marker-popup",
                closeButton: false
            }).setContent(markerPopupMessage(feature.properties));

            marker.bindPopup(popup)
                .on('mouseover', function() {
                    marker.openPopup();
                })
                .on('mouseout', function() {
                    marker.closePopup();
                })
            window.basemarkers = markers;
            markers.addLayer(marker);


        });

        self.layerMap.addLayer(name, location, markers);
        map.addLayer(markers);
    }

    return {
        addLayer: function(name, location, features, layer_info) {
            if (layer_info.type == "boundary") {
                addBoundaryLayer(name, location, features, layer_info);
            } else {
                addPointsLayer(name, location, features, layer_info);
            }
        },
        onClickDistrict: function(handler) {
            self.clickDistrictHandler = handler;
        },
        getSelectedLayer: function() {
            var layer = DT.first(self.layerMap.allChildLayers(), function(layer) {
                return layer.isSelected();
            });
            return layer.location.getName();
        },
        getHighlightedLayer: function(layer_name) {
            var layer = DT.first(self.layerMap.allChildLayers(), function(layer) {
                return layer.isHighlighted();
            });
            if (layer == null)
                return null;
            return layer.location.getName();
        },
        highlightLayer: function(location) {
            $.each(self.layerMap.allChildLayers(), function(index, layer) {
                layer.unhighlight();
            });
            self.layerMap.findChildLayer(new DT.Location(location)).highlight();
        },
        clickLayer: function(location) {
            self.layerMap.findChildLayer(new DT.Location(location)).select();
        },
        unselect: function() {
            unselect();
        },
        selectLayer: function(location) {
            if (location.isNational()) {
                var layer = self.layerMap.findLayer("district", location);
                map.fitBounds(layer);
            } else {
                self.layerMap.findChildLayer(location).focusLayer();
            }
        },
        isDisplayed: function(location) {
            return self.layerMap.findChildLayer(new DT.Location(location)) != null;
        },
        displayedLayers: function() {
            return self.layerMap.displayedLayerKeys();
        },
        removeLayer: function(key) {
            var layer = self.layerMap.removeLayer(key);
            map.removeLayer(layer);
        },
        openPopupForMarkerAt: function(layer, lat, lng) {
            var markerLayer = self.layerMap.findLayerByKey(layer);
            for(var layerKey in markerLayer._featureGroup._layers) {
                var layer = markerLayer._featureGroup._layers[layerKey];
                var markerlat = layer.getLatLng().lat.toFixed(4).toString();
                var markerlng = layer.getLatLng().lng.toFixed(4).toString();
                if (markerlat == lat && markerlng == lng) {
                    layer.openPopup();  
                    return;
                }
            }
        },

        getMarker: function(layer, lat, lng) {
            var markerLayer = self.layerMap.findLayerByKey(layer);
            for(var layerKey in markerLayer._featureGroup._layers) {
                var layer = markerLayer._featureGroup._layers[layerKey];
                var markerlat = layer.getLatLng().lat.toFixed(4).toString();
                var markerlng = layer.getLatLng().lng.toFixed(4).toString();
                if (markerlat == lat && markerlng == lng) {
                    // return layer._icon.text();
                }
            }
        }
    }
};


DT.Layer = function(leafletLayer, options, featureProperties, map) {
    var self = this;
    self.options = options;
    self.featureProperties = featureProperties;
    leafletLayer.setStyle(options.unselectedStyle);

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