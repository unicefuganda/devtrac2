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

    var layers = L.control.layers({
        tiles: uganda_districts
    })
    layers.addTo(map);

    return {
        addGeoJsonLayer: function(geojsonFeature, name) {
            var geoJsonLayer = L.geoJson(geojsonFeature, {
                style: {
                    "color": "#ff0000",
                    "weight": 1.5,
                    "opacity": 0.65
                }
            });

            layers.addBaseLayer(geoJsonLayer, name);
        },
        addBaseLayer: function(features, name) {
            var selectedLayer;
            var baseLayer = L.geoJson(features, {
                style: {
                    weight: 1,
                    fillOpacity: 0,
                    color: "#333"
                },
                onEachFeature: function(data, layer) {
                    layer.properties = data.properties;

                    layer.on("click", function() {
                        if (selectedLayer != null) {
                            selectedLayer.setStyle({
                                "fillOpacity": 0,
                                "color": "#666"
                            })
                        }
                        layer.setStyle({
                            "fillOpacity": 0.5,
                            "color": "#ff0000"
                        });
                        selectedLayer = layer;
                        console.log("selected layer is " + layer.properties["DNAME_2006"])
                    });

                    layer.on("mouseout", function() {
                        if (selectedLayer != layer) {
                            layer.setStyle({
                                "fillOpacity": 0,
                                "color": "#666"
                            });
                        }
                    });

                    layer.on("mouseover", function() {
                        if (selectedLayer != layer) {
                            layer.setStyle({
                                "fillOpacity": 0.2,
                                "color": "#ff0000"
                            });
                        }
                    });
                }
            });
            map.addLayer(baseLayer);
            layers.addBaseLayer(baseLayer, name);
            self.activeLayer = baseLayer;
        },
        setView: function(lat, lng, zoom) {
            map.setView(new L.LatLng(lat, lng), zoom);
        },
        getCenter: function() {
            var center = map.getCenter();
            return [center.lat, center.lng];
        },
        getZoom: function() {
            return map.getZoom();
        },
        getLayer: function() {
            return self.activeLayer.name;
        }
    }
};