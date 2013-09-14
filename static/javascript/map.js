var DT = {};

DT.Map = function(element) {

    var self = this,
        map = L.map(element.attr("id"));

    map.on("baselayerchange", function(layer) {
        self.activeLayer = layer;
    });

    map.on("movestart", function(layer) {
        DT.timings["movestart"] = new Date().getTime();
    });

    map.on("moveend", function(layer) {
        DT.timings["moveend"] = new Date().getTime();
    })

    map.on("zoomstart", function(layer) {
        DT.timings["zoomstart"] = new Date().getTime();
    });

    map.on("zoomend", function(layer) {
        DT.timings["zoomend"] = new Date().getTime();
    });

    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: 7,
        maxZoom: 18
    });
    map.addLayer(osm);

    var uganda_districts = L.tileLayer.wms("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms", {
        layers: 'geonode:uganda_districts_2010',
        format: 'image/png',
        transparent: true,
        attribution: "Uganda disctrict data"
    });

    var layer_control = L.control.layers({
        tiles: uganda_districts
    })
    layer_control.addTo(map);

    self.layers = [];
    self.selectedLayer;
    self.navigation_layers = [];

    self.clearHighlight = function() {
        $.each(self.layers, function(index, layer) {
            layer.unhighlight();
        });
    };

    function findLayer(layer_name, location_name) {
        return DT.first(self.layers, function(layer) {
            return layer.name == layer_name && layer.location_name == location_name
        });
    }

    return {

        addNavigationLayer: function(features, layer_info) {
            self.navigation_layers.push(layer_info.name);

            function unselectLayers(level) {
               
                $.each(self.layers, function(index, layer) {
                    layer.unselect();

                    if (layer.hierarchy.length > 2 && layer.hierarchy.length > level) {
                        map.removeLayer(layer.leafletLayer);
                    }
                });

                self.layers = $.grep(self.layers, function(layer, index) {
                    return layer.hierarchy.length <= level;
                });
                DT.timings["unselectend"] = new Date().getTime();
            };

            var baseLayer = L.geoJson(features, {
                style: {
                    weight: 2,
                    fillOpacity: 0,
                    color: "0000ff"
                },
                onEachFeature: function(data, layer) {

                    var options = $.extend({}, layer_info, {
                        clickLayerHandler: function(featureProperties, hierarchy) {
                            unselectLayers(hierarchy.length);
                            self.clickDistrictHandler(featureProperties, hierarchy);
                        },
                        selectLayerHandler: function(featureProperties, hierarchy) {
                            // unselectLayers(hierarchy.length);
                        }
                    });

                    var layer = new DT.Layer(layer, options, data.properties, map)
                    self.layers.push(layer);
                },
            });
            map.addLayer(baseLayer);
            var date = new Date();

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
            var layer = DT.first(self.layers, function(layer) {
                return layer.name == layer_name && layer.isSelected();
            });
            if (layer == null)
                return null;
            return layer.location_name;
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
            self.clearHighlight();
            findLayer(layer_name, location_name).leafletLayer.fire("mouseover");
        },
        clickLayer: function(layer_name, location_name) {
            findLayer(layer_name, location_name).select();
        },
        selectLayer: function(layer_name, location_name) {
            findLayer(layer_name, location_name).focusLayer();
        }
    }
};


DT.Layer = function(leafletLayer, options, featureProperties, map) {
    var self = this;
    self.options = options;
    self.featureProperties = featureProperties;

    leafletLayer.setStyle(options.unselectedStyle);
    self.hierarchy = options.getHierarchy(featureProperties);

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
            options.clickLayerHandler(featureProperties, self.hierarchy);
        }
    };

    self.focusLayer = function() {
        if (options.selectLayerHandler) {
            options.selectLayerHandler(featureProperties, self.hierarchy);
        }

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

    return {
        location_name: self.hierarchy[self.hierarchy.length - 1],
        unselect: self.unselect,
        leafletLayer: leafletLayer,
        hierarchy: self.hierarchy,
        unhighlight: self.unhighlight,
        highlight: self.highlight,
        select: self.select,
        name: options.name,
        isSelected: function() {
            return self.selected;
        },
        focusLayer: self.focusLayer,
        isHighlighted: function() {
            return self.highlighted;
        }
    };
};