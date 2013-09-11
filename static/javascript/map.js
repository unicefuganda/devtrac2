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
        maxZoom: 12
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

    self.layers = {};
    self.subcountyLayer;

    self.clearHighlight = function() {
        $.each(self.layers, function(index, layer) {
            layer.fire("mouseout");
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

        addSubcountyLayer: function(features, name) {
            var baseLayer = L.geoJson(features, {
                style: {
                    weight: 2,
                    fillOpacity: 0,
                    color: "#ff0000"
                },
                onEachFeature: function(data, layer) {
                    layer.properties = data.properties;
                    layer.name = data.properties["DNAME_2010"].toLowerCase();
                    self.layers[layer.name] = layer;
                }
            });
            baseLayer.name = name;
            if (self.subcountyLayer != null) {
                map.removeLayer(self.subcountyLayer);
            }
            map.addLayer(baseLayer);
            self.subcountyLayer = baseLayer;
        },

        addDistrictLayer: function(features, name) {
            var baseLayer = L.geoJson(features, {
                style: {
                    weight: 1,
                    fillOpacity: 0,
                    color: "#333"
                },
                onEachFeature: function(data, layer) {
                    layer.properties = data.properties;
                    layer.name = data.properties["DNAME_2010"].toLowerCase();
                    self.layers[layer.name] = layer;

                    layer.on("click", function() {
                        if (self.selectedDistrict != null) {
                            self.selectedDistrict.setStyle({
                                "fillOpacity": 0,
                                "color": "#666",
                                "weight": 1
                            })
                        }
                        layer.setStyle({
                            "fillOpacity": 0,
                            "color": "#ff0000",
                            "weight": 10
                        });
                        self.selectedDistrict = layer;
                        self.clickDistrictHandler(layer.name);
                    });

                    layer.on("mouseout", function() {
                        if (self.selectedDistrict != layer) {
                            layer.setStyle({
                                "fillOpacity": 0,
                                "color": "#666"
                            });

                            self.highlightedDistrict = null;
                        }
                    });

                    layer.on("mouseover", function() {
                        if (self.selectedDistrict != layer) {
                            layer.setStyle({
                                "fillOpacity": 0.2,
                                "color": "#ff0000"
                            });
                            self.highlightedDistrict = layer;
                        }
                    });
                }
            });
            baseLayer.name = name;
            map.addLayer(baseLayer);
            layer_control.addBaseLayer(baseLayer, name);

            self.activeLayer = baseLayer;

        },
        setView: function(lat, lng, zoom) {
            map.setView(new L.LatLng(lat, lng), zoom);
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
            if (self.subcountyLayer) {
                return [self.activeLayer.name, self.subcountyLayer.name];
            } 
            return [self.activeLayer.name];
        },
        getSelectedDistrict: function() {
            return self.selectedDistrict.name;
        },
        getHighlightedDistrict: function() {
            return self.highlightedDistrict.name;
        },
        selectDistrict: function(district_name) {
            self.clearHighlight();
            self.layers[district_name].fire("click");
        },
        highlightDistrict: function(district_name) {
            self.clearHighlight();
            self.layers[district_name].fire("mouseover");
        }
    }
};