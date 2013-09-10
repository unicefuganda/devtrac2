
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
  
   polygon.map.addLayers([tiled, layer]);

   var geojson_format = new OpenLayers.Format.GeoJSON();
   
   var vector_layer = new OpenLayers.Layer.Vector(); 
   var vector_points_layer = new OpenLayers.Layer.Vector("Layer",
    {styleMap: polygon.stylesMap()}); 

   polygon.map.setCenter(new OpenLayers.LonLat(32.5811, 0.3136), 7); 


   polygon.map.addLayer(vector_layer);
   polygon.map.addLayer(vector_points_layer);
   vector_layer.addFeatures(geojson_format.read(polygon.featureCollections()));
   vector_points_layer.addFeatures(geojson_format.read(polygon.pointsCollection()));

   polygon.addMarkers();

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

polygon.stylesMap = function(){

var styleMap = new OpenLayers.StyleMap({
            pointRadius: 20,
            fillColor: "green",
            strokeColor: "green",
            fillOpacity: 0.7,
            label: "5",
            fontFamily: "Arial"
          });

return styleMap;

}

polygon.pointsCollection = function(){

var featurecollection = {
              "type": "FeatureCollection", 
              "features": [
                {"geometry": {
                    "type": "GeometryCollection", 
                    "geometries": [
                        {
                            "type": "Point", 
                            "coordinates": [32.5811, 0.3136],
                        },
                        {
                            "type": "Point", 
                            "coordinates": [31.5811, 0.3136],
                        },
                        {
                            "type": "Point", 
                            "coordinates": [30.5811, 0.3136],
                        }
                    ]
                }, 
                "type": "Feature", 
                "properties": {}}
              ]
           };

           return featurecollection;

}
polygon.featureCollections = function(){
 var featurecollection = {
              "type": "FeatureCollection", 
              "features": [
                {"geometry": {
                    "type": "GeometryCollection", 
                    "geometries": [
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
                        }                        
                    ]
                }, 
                "type": "Feature", 
                "properties": {}}
              ]
           };
           return featurecollection;

}

polygon.addMarkers = function(){

           var markers = new OpenLayers.Layer.Markers( "Markers" );
            polygon.map.addLayer(markers);

            var size = new OpenLayers.Size(21,25);
            var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
            var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
            markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(31.77492046,1.849122047),icon));

            var halfIcon = icon.clone();
            markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(34.20936203,1.008804351),halfIcon));

            marker = new OpenLayers.Marker(new OpenLayers.LonLat(90,10),icon.clone());
            marker.setOpacity(0.2);
            marker.events.register('mousedown', marker, function(evt) { alert(this.icon.url); OpenLayers.Event.stop(evt); });
            markers.addMarker(marker); 
            //map.addControl(new OpenLayers.Control.LayerSwitcher());
            //map.zoomToMaxExtent();

            halfIcon.setOpacity(0.5);


}

$(function(){

polygon.init();

});