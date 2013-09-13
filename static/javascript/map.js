var DevTrac = {};
DevTrac.Map = function(element) {

    var self = this,
        map = L.map(element.attr("id"));

    map.on("baselayerchange", function(layer) {
        self.activeLayer = layer;
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

    return {

        addNavigationLayer: function(features, layer_info) {
            
            self.navigation_layers.push(layer_info.name);

            function unselectLayers(level) {
               
                $.each(self.layers, function(index, layer) {
                    // $.each(layer_group, function(index, layer) {
                        layer.unselect();

                        if (layer.hierarchy.length > 2 && layer.hierarchy.length > level) {
                            map.removeLayer(layer.leafletLayer);
                        }
                });

                self.layers = $.grep(self.layers, function(layer, index) {
                    return layer.hierarchy.length <= level;
                });
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

                    var layer = new DevTrac.Layer(layer, options, data.properties, map)
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
            var layers = $.grep(self.layers, function(layer, index) {
                return layer.name == layer_name && layer.isSelected() == true
            });
            if (layers.length == 0)
                return null;
            return layers[0].hierarchy[layers[0].hierarchy.length - 1];
        },
        getHighlightedLayer: function(layer_name) {
            var highlightedLayers = $.grep(self.layers, function(layer, index) {
                return layer.isHighlighted() && layer.name == layer_name;
            });
            if (highlightedLayers.length == 0)
                return null;
            return highlightedLayers[0].hierarchy[highlightedLayers[0].hierarchy.length - 1];
        },
        highlightLayer: function(name, layer_name) {
            self.clearHighlight();
            var layers = $.grep(self.layers, function(layer, index) {
                return layer.name == layer_name && layer.hierarchy[layer.hierarchy.length - 1] == name
            });
            layers[0].leafletLayer.fire("mouseover");
        },
        clickLayer: function(location_name, layer_name) {
            var layers = $.grep(self.layers, function(layer, index) {
                return layer.name == layer_name && layer.hierarchy[layer.hierarchy.length - 1] == location_name.toLowerCase()
            });
            layers[0].select();
        },
        selectLayer: function(location_name, name) {
            var layers = $.grep(self.layers, function(layer, index) {
                return layer.name == name && layer.hierarchy[layer.hierarchy.length - 1] == location_name.toLowerCase()
            });
            layers[0].focusLayer();
        }
    }
};


DevTrac.Layer = function(leafletLayer, options, featureProperties, map) {
    var self = this;
    self.options = options;
    self.featureProperties = featureProperties;

    leafletLayer.setStyle(options.unselectedStyle);
    self.hierarchy = options.getHierarchy(featureProperties);

    leafletLayer.on("click", function() {
        var date = new Date();
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