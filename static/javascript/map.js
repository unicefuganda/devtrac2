if (typeof DT == "undefined")
    DT = {};
DT.testing = false;
DT.Map = function(element) {

    var self = this;
    self.wmsLayer = null;
    var map = L.map(element.attr("id"), {
        zoomControl: false
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
                
                var layer = new DT.Layer(layer, options, data.properties, map);                               
                self.layerMap.addChildLayer(name, location, options.location, layer);
            },
        });            
        self.layerMap.addLayer(name, location, baseLayer);
        map.addLayer(baseLayer, true);
    }
    function addAggregateLayer(name, location, data, layer_info) {
        var layerGroup = L.layerGroup();


        $.each(data.children, function(index, childStats) {
            var childLocation = DT.Location.fromName(childStats.locator);
            var childLayer = self.layerMap.findChildLayer(childLocation);
            if (childLayer != null) {

                var centerPoint = childLayer.getCenter();   
                var circleCluster = new L.DivIcon({
                iconSize: new L.Point([20, 20]),
                className: layer_info.name +"-cluster-icon cluster-icon medium",
                html: "<div data-locator='" + childLocation.getName() + "'>" 
                    + childStats.info[name]
                    + '</div>'
                });
                 var geojsonMarkerOptions = {
                    zIndexOffset: 10000,
                    icon: circleCluster
                };        
                var marker = new L.Marker(centerPoint, geojsonMarkerOptions);
                layerGroup.addLayer(marker);
            }
        });

        self.layerMap.addLayer(name, location, layerGroup);
        map.addLayer(layerGroup);
    }

    function addPointsLayer(name, location, features, layer_info) {
        var layerGroup = L.layerGroup();

        var markerPopupMessage = function(summaryInformation) {
            var message = '<h4>' + summaryInformation.title + '</h4>';
            $.each(summaryInformation.lines, function(index, line) {
                message += '<label>' + line[0] + ':</label> ' + line[1] + '</br>';    
            })
            return message;
        };

        $.each(features.features, function(index, feature) {
            var coordinates = feature.geometry.coordinates;

            var popup = L.popup({
                className: "marker-popup" ,
                closeButton: false
            }).setContent(markerPopupMessage(layer_info.summaryInformation(feature.properties)));

            var circleIcon = new L.DivIcon({
                iconSize: new L.Point([10, 10]),
                className: layer_info.name + "-icon marker-icon ",
                html: "<div data-lat='"+ coordinates[1].toFixed(4) +"' data-lng='" + coordinates[0].toFixed(4) + "'></div>",
                popupAnchor: [5, -10]
            });
            var geojsonMarkerOptions = {
                zIndexOffset: 10000,
                icon: circleIcon
            };
          
            var marker = new L.Marker(new L.LatLng(coordinates[1], coordinates[0]), geojsonMarkerOptions);

            marker.bindPopup(popup)
                .on('mouseover', function() {
                    marker.openPopup();
                })
                .on('mouseout', function() {
                    marker.closePopup();
                });
            layerGroup.addLayer(marker);
        });

        self.layerMap.addLayer(name, location, layerGroup);
        map.addLayer(layerGroup);
    }
  
    var removeWMSLayer = function() {
        if (self.wmsLayer != null) {
            map.removeLayer(self.wmsLayer);
            self.wmsLayer = null;
        };
    }   

    return {
        addLayer: function(name, location, data, layer_info) {
            if (layer_info.type == "boundary") {
                addBoundaryLayer(name, location, data, layer_info);
            } else if (layer_info.type == "aggregate"){
                addAggregateLayer(name, location, data, layer_info);
            } else if (layer_info.type == "point") {
                addPointsLayer(name, location, data, layer_info);
            }
        },
        orderLayers: function(layerOrder) {
            $.each(layerOrder, function(index, layerKey) {
                var layer = self.layerMap.findLayerByKey(layerKey);
                if (layer != null)
                    layer.bringToFront();
            });
        },
        addWMSLayer: function(wmsServer, layer) {
            removeWMSLayer();
            var wmsLayer = L.tileLayer.wms(wmsServer, {
                layers: layer,
                format: 'image/png',
                transparent: true
            });
            map.addLayer(wmsLayer);
            self.wmsLayer = wmsLayer;
        },
        removeWMSLayer: function() {
            removeWMSLayer();
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
            if (location.level() == "national") {
                var layer = self.layerMap.findLayer("region", location);
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
        displayedLayerNames: function() {
            return $.map(self.layerMap.displayedLayerKeys(), function(locationKey) {
                return locationKey[0] + " - " + locationKey[1].getName();
            });
        },
        removeLayer: function(key) {            
            var layer = self.layerMap.removeLayer(key);
            map.removeLayer(layer);
        },
        openPopupForMarkerAt: function(layer, lat, lng) {
            var markerLayer = self.layerMap.findLayerByKey(layer);
            for(var layerKey in markerLayer._layers) {
                var layer = markerLayer._layers[layerKey];
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
        },
        isIndicatorLayerHidden: function() {
            return self.wmsLayer == null;
        },
        getIndicatorValue: function(indicatorName) {
            return $("#indicator-select option:contains('"+ indicatorName + "')").val();
        },
        isIndicatorLayerDisplayed: function(layerName) {
            return self.wmsLayer.options.layers == layerName;
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

    self.getCenter = function() {
        return leafletLayer.getBounds().getCenter();
    }
    self.location = options.location;

    return {
        getCenter: self.getCenter,
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