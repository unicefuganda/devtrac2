var DT = {};
DT.testing = false;

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

    self.layers = [];
    self.selectedLayer;
    self.navigation_layers = [];

    self.markerPopupMessage = function(property){
                var message = '<p> Water point at parish <b>'+property.ParishName+'</b>';
                    message += ' of type  <b>'+property.SourceType+'.</b> ';                    
                    message += ' Functional status : <b>'+property.Functional+'</b>';
                    message += ' Management :  <b>'+property.Management+'</b> </p>' ;                   
                                         
                return message;
       };

    function findLayer(layer_name, location_name) {
        return DT.first(self.layers, function(layer) {
            return layer.name == layer_name && layer.location_name == location_name
        });
    }

    function unselect() {
        if (self.water_points != null)
            map.removeLayer(self.water_points);

        $.each(self.layers, function(index, layer) {
            layer.unselect();
            if (layer.hierarchy.length > 2) {
                map.removeLayer(layer.leafletLayer);
            }

        });

        self.layers = $.grep(self.layers, function(layer, index) {
            return layer.hierarchy.length <= 2;
        });
        DT.timings["unselectend"] = new Date().getTime();
    }

    return {
        addPointsLayer: function(features, layer_info) {
            var waterIcon = L.icon({
                iconUrl: '/static/javascript/lib/images/water-icon.png',
                shadowUrl: null,

                iconSize: [16, 16], // size of the icon
                shadowSize: [0, 0], // size of the shadow
                iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 0], // the same for the shadow
                popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
            });

            var geojsonMarkerOptions = {
                radius: 5,
                fillColor: "#0000ff",
                color: "#333",
                weight: 0,
                opacity: 1,
                fillOpacity: 0.3
            };

            self.navigation_layers.push(layer_info.name);

            var markers = L.markerClusterGroup({
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false,
                spiderfyOnMaxZoom: false,
                removeOutsideVisibleBounds: false,

                iconCreateFunction: function(cluster) {
                    return new L.DivIcon({iconSize: new L.Point([20, 20]), className: "cluster-icon" , html: '<b>' + cluster.getChildCount() + '</b>' });
                }
            });

            L.Icon.Default.imagePath = '/static/javascript/lib/images/';

            $.each(features.features, function(index, feature) {
                var coordinates = feature.geometry.coordinates;
                var marker = L.circleMarker(new L.LatLng(coordinates[1], coordinates[0]), geojsonMarkerOptions);
                marker.bindPopup(self.markerPopupMessage(feature.properties))
                .on('mouseover',function(){
                    marker.openPopup();
                }).on('mouseout',function(){
                    marker.closePopup();
                });                                
                markers.addLayer(marker);
            });            

            map.addLayer(markers);

            self.water_points = markers;
        },
        addNavigationLayer: function(features, layer_info) {
            self.navigation_layers.push(layer_info.name);

            var baseLayer = L.geoJson(features, {
                style: {
                    weight: 2,
                    fillOpacity: 0,
                    color: "0000ff"
                },
                onEachFeature: function(data, layer) {

                    var options = $.extend({}, layer_info, {
                        clickLayerHandler: function(featureProperties, hierarchy) {
                            self.clickDistrictHandler(featureProperties, hierarchy);
                        }
                    });
                    var layer = new DT.Layer(layer, options, data.properties, map)
                    self.layers.push(layer);
                },
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
            $.each(self.layers, function(index, layer) {
                layer.unhighlight();
            });
            findLayer(layer_name, location_name).leafletLayer.fire("mouseover");
        },
        clickLayer: function(layer_name, location_name) {
            findLayer(layer_name, location_name).select();
        },
        unselect: function() {
            unselect();
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