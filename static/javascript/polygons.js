
var polygon = {};

polygon.map = null;
polygon.Baselayer = null;
polygon.polygonLayer = null;
polygon.Control = null;

polygon.init = function(){
  polygon.map = new OpenLayers.Map( 'map');
  polygon.Baselayer = new OpenLayers.Layer.OSM( "Simple OSM Map");
  layer = new OpenLayers.Layer.WMS( "OpenLayers WMS", 
                    "http://vmap0.tiles.osgeo.org/wms/vmap0",
                    {layers: 'basic'} );

  var tiled = polygon.tiles();
  console.log(tiled);

   polygon.map.addLayers([tiled, layer]);

   var geojson_format = new OpenLayers.Format.GeoJSON();
   var vector_layer = new OpenLayers.Layer.Vector(); 

   polygon.map.setCenter(new OpenLayers.LonLat(32.5811, 0.3136), 7); 


   polygon.map.addLayer(vector_layer);
   vector_layer.addFeatures(geojson_format.read(polygon.featureCollections()));

}

polygon.tiles = function(){

var map = polygon.map;
var format = 'image/png';

  var tiles = new OpenLayers.Layer.WMS(
            "geonode:uganda_districts_2010 - Tiled", "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            {
                LAYERS: 'geonode:uganda_districts_2010',
                STYLES: '',
                format: format,
                tiled: true,
                tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
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


polygon.featureCollections = function(){
 var featurecollection = {
              "type": "FeatureCollection", 
              "features": [
                {"geometry": {
                    "type": "GeometryCollection", 
                    "geometries": [
                        {
                            "type": "LineString", 
                            "coordinates": 
                                [[32.5830574,0.337122083], 
                                [32.4055481,0.463387102]]
                        }, 
                        {
                            "type": "Polygon", 
                            "coordinates": 
                                [[
[31.73174667,3.231184721],
[32.78620529,1.639039993],
[32.75101471,2.301280737],
[30.89932728,3.041703939],
[30.96674156,2.840301633]
]]
                        },
                        {
                            "type":"Point", 
                            "coordinates":[31.60180569,-0.367727906]
                        }
                    ]
                }, 
                "type": "Feature", 
                "properties": {}}
              ]
           };
           return featurecollection;

}


$(function(){

polygon.init();

});