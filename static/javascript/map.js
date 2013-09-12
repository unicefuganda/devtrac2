DevTrac = {}
DevTrac.Map = function(element) {

    var self = this;
    var map = L.map(element.attr("id"));

    map.on("baselayerchange", function(layer) {
        self.activeLayer = layer;
    });

    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {
        minZoom: 7,
        maxZoom: 15
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
        addGeoJsonLayer: function(geojsonFeature, name) {
            var geoJsonLayer = L.geoJson(geojsonFeature, {
                style: {
                    "color": "#ff0000",
                    "weight": 1.5,
                    "opacity": 0.65
                }
            });

            layer_control.addBaseLayer(geoJsonLayer, name);
        },

        addNavigationLayer: function(features, layer_info) {
            self.navigation_layers.push(layer_info.name);

            function unselectLayers(level) {
                if (self.selectedLayer != null) {
                    self.selectedLayer.unselect();
                }

                $.each(self.layers, function(index, layer) {
                    if (layer.hierarchy.length > 2 && layer.hierarchy.length > level) {
                        map.removeLayer(layer.leafletLayer);
                    }
                });
            };


            var baseLayer = L.geoJson(features, {
                style: {
                    weight: 2,
                    fillOpacity: 0,
                    color: layer_info.unselectedColor
                },
                onEachFeature: function(data, layer) {

                    var options = $.extend({}, layer_info, {
                        selectLayerHandler: function(featureProperties, hierarchy) {
                            unselectLayers(hierarchy.length);

                            self.selectedLayer = layer;
                            self.clickDistrictHandler(featureProperties, hierarchy);
                        }
                    });



                    var layer = new DevTrac.Layer(layer, options, data.properties, map)
                    self.layers.push(layer);
                }
            });

            map.addLayer(baseLayer);

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
        getSelectedDistrict: function() {
            return self.selectedLayer.hierarchy[self.selectedLayer.hierarchy.length - 1];
        },
        getHighlightedDistrict: function() {
            var highlightedLayer = $.grep(self.layers, function(layer, index) {
                console.log(layer);
                return layer.isHighlighted();
            })[0];
            return highlightedLayer.hierarchy[highlightedLayer.hierarchy.length - 1];
        },
        selectDistrict: function(district_name) {
            self.clearHighlight();
            var layers = $.grep(self.layers, function(layer, index) {
                return layer.name == "districts" && layer.hierarchy[layer.hierarchy.length - 1] == district_name
            });
            layers[0].select();

        },
        highlightDistrict: function(district_name) {
            self.clearHighlight();
            var layers = $.grep(self.layers, function(layer, index) {
                return layer.name == "districts" && layer.hierarchy[layer.hierarchy.length - 1] == district_name
            });
            layers[0].highlight();
        },
    }
};


DevTrac.Layer = function(leafletLayer, options, featureProperties, map) {
    var self = this;
    self.options = options;
    self.featureProperties = featureProperties;

    leafletLayer.setStyle(options.unselectedStyle);
    self.hierarchy = options.getHierarchy(featureProperties);

    leafletLayer.on("click", function() {
        self.select();
    });

    leafletLayer.on("mouseout", function() {
        self.unhighlight();
    });

    leafletLayer.on("mouseover", function() {
        self.highlight();
    });


    self.calculateZoomLevel = function(bounds) {

        var zoomLevels = [
            [0, 14],
            [0.1, 13],
            [0.18, 12],
            [0.35, 11],
            [0.6, 10]
        ];

        var height = bounds.getNorth() - bounds.getSouth();
        var width = bounds.getEast() - bounds.getWest();
        var longestDimension = width > height ? width : height;
        var levels = $.grep(zoomLevels, function(zoomLevel, index) {
            return longestDimension > zoomLevel[0];
        });
        return levels[levels.length - 1][1];
    };

    self.unselect = function() {
        leafletLayer.setStyle(options.unselectedStyle);
        self.selected = false;
    };
    self.select = function() {
        leafletLayer.setStyle(options.selectedStyle);
        self.selected = true;

        var center = leafletLayer.getBounds().getCenter();
        var zoomLevel = self.calculateZoomLevel(leafletLayer.getBounds());
        map.setView(center, zoomLevel);

        if (options.selectLayerHandler) {
            options.selectLayerHandler(featureProperties, self.hierarchy);
        }

    };

    self.highlight = function() {
        leafletLayer.setStyle(options.highlightedStyle);
        self.highlighted = true;
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
        isHighlighted: function() {
            return self.highlighted;
        }
    };
};