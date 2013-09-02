
var polygon = {};

polygon.map = null;
polygon.layer = null;
polygon.polygonLayer = null;
polygon.Control = null;

polygon.init = function(){

this.start = function(){
polygon.map = new OpenLayers.Map( 'map');
polygon.polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");
polygon.layer = new OpenLayers.Layer.OSM( "Simple OSM Map");

var tiles = polygon.tiles();

 polygon.map.addLayers([tiles, polygon.layer, polygon.polygonLayer]);
 polygon.map.addControl(new OpenLayers.Control.LayerSwitcher());
 polygon.map.addControl(new OpenLayers.Control.MousePosition());

 var geo_format = polygon.geoFormat();
 
  polygon.polygonLayer.addFeatures(geo_format.read(polygon.geoJSon()));


 polygon.map.setCenter(
            new OpenLayers.LonLat(32.5811, 0.3136).transform(
                new OpenLayers.Projection("EPSG:4326"),
                polygon.map.getProjectionObject()
            ), 7
        );
}

}

polygon.tiles = function(){
 format = 'image/png';
 tiles = new OpenLayers.Layer.WMS(
            "geonode:uganda_districts_2010 - Tiled", "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            {
                LAYERS: 'geonode:uganda_districts_2010',
                STYLES: '',
                format: format,
                tiled: true,
                tilesOrigin : polygon.map.maxExtent.left + ',' + polygon.map.maxExtent.bottom
            },
            {
                buffer: 0,
                displayOutsideMaxExtent: true,
                isBaseLayer: false,
                yx : {'EPSG:4326' : true}
            } 
        );

return tiles;
}

polygon.geoFormat = function(){

var map = polygon.map;

	var geojson_format = new OpenLayers.Format.GeoJSON({
                'internalProjection': map.baseLayer.projection,
                'externalProjection': new OpenLayers.Projection("EPSG:4326")
            });

	return geojson_format;
}
polygon.geoJSon = function(){

 var geoJSON = { "type": "FeatureCollection",
                "features": 
                [

                    { "type": "Feature", "properties": { "LENGTH": 756.304000},
                     "geometry": { "type": "LineString", 
                     "coordinates": [ 
                     [ 18.105018, 59.231027 ], [ 18.104176, 59.230737 ],
                      [ 18.103928, 59.230415 ], [ 18.103650, 59.230336 ], 
                      [ 18.103028, 59.230463 ], [ 18.102491, 59.230418 ], 
                      [ 18.101976, 59.230237 ], [ 18.100893, 59.230110 ], 
                      [ 18.100117, 59.230016 ], [ 18.097715, 59.230262 ], 
                      [ 18.096907, 59.230376 ], [ 18.096637, 59.230405 ],
                       [ 18.096578, 59.230428 ], [ 18.096429, 59.230450 ],
                        [ 18.096336, 59.230479 ], [ 18.096108, 59.230534 ], 
                        [ 18.095971, 59.230600 ], [ 18.095925, 59.230633 ], 
                        [ 18.095891, 59.230665 ], [ 18.094000, 59.231676 ], 
                        [ 18.093864, 59.231720 ] ] } }
                    ,                   
            { "type": "Feature", "properties": { "LENGTH": 1462.390000},
             "geometry": { "type": "LineString", 
             "coordinates": [ 
             [ 17.877073, 59.461653 ], [ 17.877116, 59.461598 ], 
             [ 17.876936, 59.461507 ], [ 17.876936, 59.461323 ],
              [ 17.876773, 59.461098 ], [ 17.876430, 59.460885 ], 
              [ 17.876413, 59.460553 ], [ 17.876576, 59.460280 ], 
              [ 17.876575, 59.460078 ], [ 17.876762, 59.460060 ], 
              [ 17.877371, 59.460042 ], [ 17.877808, 59.460046 ], 
              [ 17.878641, 59.460046 ], [ 17.879010, 59.460078 ], 
              [ 17.879337, 59.460044 ], [ 17.879526, 59.459878 ], 
              [ 17.879749, 59.459563 ], [ 17.880058, 59.459538 ], 
              [ 17.880435, 59.459503 ], [ 17.887550, 59.453608 ], 
              [ 17.887696, 59.453430 ], [ 17.887971, 59.453150 ], 
              [ 17.888221, 59.452843 ], [ 17.888246, 59.452721 ], 
              [ 17.888435, 59.452609 ], [ 17.888470, 59.452568 ], 
              [ 17.888517, 59.452410 ] ] } }

                ]
            };

return geoJSON;
}


$(function(){

var load_map = new polygon.init();
load_map.start();

});