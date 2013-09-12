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

    self.layers = [];
    self.subcountyLayer;
    self.selectedLayers = {};
    self.navigation_layers = [];

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

        addNavigationLayer: function(features, layer_info) {
            self.navigation_layers.push(layer_info.name);

            function unselectLayers(level) {

                $.each(self.selectedLayers, function(index, layer){
                    layer.unselect();
                });

                $.each(self.layers, function(index, layer) {
                    if (layer.hierarchy.length > 2 && layer.hierarchy.length > level) {
                        map.removeLayer(layer);
                    }
                });
            };

            function removeChildLayer() {
                $.each(self.selectedLayers, function(index, layer){
                    layer.unselect();
                });
            };

            var baseLayer = L.geoJson(features, {
                style: {
                    weight: 2,
                    fillOpacity: 0,
                    color: layer_info.unselectedColor
                },
                onEachFeature: function(data, layer) {
                    layer.properties = data.properties;
                    layer.name = data.properties["DNAME_2010"].toLowerCase();

                    layer.layer_info = layer_info;
                    layer.hierarchy = layer.layer_info.hierarchy.concat([layer.name]);
                    self.layers.push(layer);

                    layer.unselect = function() {
                        this.setStyle({
                            "fillOpacity": 0,
                            "color": this.layer_info.unselectedColor,
                            "weight": 1
                        });
                    };

                    self.layers[layer.name] = layer;

                    layer.on("click", function() {
                        unselectLayers(layer.hierarchy.length);

                        layer.setStyle({
                            "fillOpacity": 0,
                            "color": layer_info.selectedColor,
                            "weight": 10
                        });
                        self.selectedLayers[layer_info.name] = layer;
                        var hierarchy = layer_info.hierarchy.concat([layer.name])
                        self.clickDistrictHandler(layer.properties, hierarchy);
                    });

                    layer.on("mouseout", function() {
                        if (self.selectedLayers[layer_info.name] != layer) {
                            layer.setStyle({
                                "fillOpacity": 0,
                                "color": layer_info.unselectedColor
                            });

                            self.highlightedDistrict = null;
                        }
                    });

                    layer.on("mouseover", function() {
                        if (self.selectedLayers[layer_info.name] != layer) {
                            layer.setStyle({
                                "fillOpacity": 0.2,
                                "color": layer_info.selectedColor
                            });
                            self.highlightedDistrict = layer;
                        }
                    });
                }
            });

            baseLayer.name = layer_info.name;
            map.addLayer(baseLayer);

            // self.activeLayer = baseLayer;


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
            return self.navigation_layers;
        },
        getSelectedDistrict: function() {
            return self.selectedLayers["Districts"].name;
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
        },
    }
};