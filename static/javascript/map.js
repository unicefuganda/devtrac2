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

    function addBoundaryLayer(name, location, features, layer_info,aggregate) {                   
        var baseLayer = L.geoJson(features, {
            onEachFeature: function(data, layer) {  
                var options = $.extend({}, layer_info, {
                    clickLayerHandler: function(layer) {
                        self.clickDistrictHandler(layer.location);
                    },
                    location: layer_info.getLocation(data),
                });

                if (aggregate !==undefined) {
                    layer = negotiateAddLayerBadges(layer,aggregate,layer_info.getLocation(data)); 
                }
                
                var layer = new DT.Layer(layer, options, data.properties, map);
                               
                self.layerMap.addChildLayer(name, location, options.location, layer);
            },
        });     
       

        self.layerMap.addLayer(name, location, baseLayer);
        map.addLayer(baseLayer, true);
    }

    function negotiateAddLayerBadges(childLayer,aggregateList,options){ 
       
        var targetLayer = childLayer;      
        //console.log(aggregateList.length);   
        $.each(aggregateList,function(index,aggregate){ 
        if (aggregate[0] == options['region'] && options['district'] == null) {
            targetLayer = addLayerBadges(childLayer,aggregate);
            console.log("regions only");
        }else if (aggregate[0] == options['region'] && aggregate[1] == options['district']) {               
               targetLayer = addLayerBadges(childLayer,aggregate);
            }          
        });         

        return childLayer;
    }

    function negotiateAddLayerPoints(name, location, features, layer_info){ 
        if (location.parish !=null) {       
       addPointsLayer(name, location, features, layer_info);
        }
    }

function addLayerBadges(baseLayer,aggregate){        
       var bounds = baseLayer.getBounds();
       var center = bounds.getCenter(); 
       var sw = bounds.getSouthWest();
       var ne = bounds.getNorthEast();       
       var coords = [[center.lng,center.lat],[ne.lng,ne.lat],[sw.lng,sw.lat]];              
       var classNames = {
        'Schools':'school',
        'Health Centers':'health-center',
        'Water Points':'water-point'};
       var map_layers = ['Health Centers','Schools','Water Points']; 
       var count = 0;  

        $.each(aggregate[2].info,function(index,info){
            
        if (info[0] =='Water Points' || info[0] =='Schools' || info[0] =='Health Centers') {
             var coordinate = [coords[count][0],coords[count][1]];                          
             //var coordinate = [center.lng,center.lat];
             var circleCluster = new L.DivIcon({
                iconSize: new L.Point([20, 20]),
                className: classNames[info[0]] +"-cluster-icon cluster-icon medium",
                html: "<div data-lat='"+ coordinate[1].toFixed(4) +"' data-lng='" + coordinate[0].toFixed(4) + "'>" 
                    + info[1]
                    + '</div>'
                });
             var geojsonMarkerOptions = {
                zIndexOffset: 10000,
                icon: circleCluster
            };          
            var marker = new L.Marker(new L.LatLng(coordinate[1], coordinate[0]), geojsonMarkerOptions);            
               map.addLayer(marker,true); 
               
               count++; 
            }                        
           
              });

        return baseLayer;      
       
    }

  

    function addPointsLayer(name, location, features, layer_info) {
        // TODO: refactor        
        var markerPopupMessage = function(summaryInformation) {

            var message = '<h4>' + summaryInformation.title + '</h4>';
            $.each(summaryInformation.lines, function(index, line) {
                message += '<label>' + line[0] + ':</label> ' + line[1] + '</br>';    
            })
            return message;
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

                var childCount = cluster.getChildCount();

                var className = "small";
                   if (childCount > 10)
                       className = "medium";
                   if (childCount > 25)
                       className = "large";
                   if (childCount > 50)
                       className = "extra-large";
                return new L.DivIcon({
                    iconSize: new L.Point([20, 20]),
                    className: layer_info.name +"-cluster-icon cluster-icon " + className,

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
                className: layer_info.name + "-icon marker-icon ",
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
                className: "marker-popup" ,
                closeButton: false
            }).setContent(markerPopupMessage(layer_info.summaryInformation(feature.properties)));

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

    var removeWMSLayer = function() {
        if (self.wmsLayer != null) {
            map.removeLayer(self.wmsLayer);
            self.wmsLayer = null;
        };
    }

    return {
        addLayer: function(name, location, features, layer_info,aggregate) {

            if (layer_info.type == "boundary") {

                addBoundaryLayer(name, location, features, layer_info,aggregate);
            } else {
               negotiateAddLayerPoints(name, location, features, layer_info);
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