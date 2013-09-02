 $(function(){
    var map, layer,polygonControl;

    function init(){
        map = new OpenLayers.Map( 'map');
        layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
        format = 'image/png';


        tiled = new OpenLayers.Layer.WMS(
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
            
        
       var polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");

        map.addLayers([tiled, layer, polygonLayer]);
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(new OpenLayers.Control.MousePosition());


            var geojson_format = new OpenLayers.Format.GeoJSON({
                'internalProjection': map.baseLayer.projection,
                'externalProjection': new OpenLayers.Projection("EPSG:4326")
            });
            

         polyOptions = {sides: 4};
            polygonControl = new OpenLayers.Control.DrawFeature(polygonLayer,
                                            OpenLayers.Handler.RegularPolygon,
                                            {handlerOptions: polyOptions});
            
            map.addControl(polygonControl);


        map.setCenter(
            new OpenLayers.LonLat(32.5811, 0.3136).transform(
                new OpenLayers.Projection("EPSG:4326"),
                map.getProjectionObject()
            ), 7
        );

      document.getElementById('noneToggle').checked = true;
      document.getElementById('irregularToggle').checked = false;
    }

    function setOptions(options) {
            polygonControl.handler.setOptions(options);
        }

        function setSize(fraction) {
            var radius = fraction * map.getExtent().getHeight();
            polygonControl.handler.setOptions({radius: radius,
                                               angle: 0});
        }


    init();
 });

 
  vectorLayer = new OpenLayers.Layer.Vector("Lines");


  function geo_json(){
 var myGeoJSON = { "type": "FeatureCollection",
                "features": 
                [

                    { "type": "Feature", "properties": 
                    { "LENGTH": 756.304000}, 
                    "geometry": { "type": "LineString", 
                    "coordinates": [
                     [ 18.105018, 59.231027 ], [ 18.104176, 59.230737 ],
                     [ 18.103928, 59.230415 ], [ 18.103650, 59.230336 ]
                      
                      ] } }
                    ,                   
            { "type": "Feature", "properties": 
            { "LENGTH": 1462.390000}, 
            "geometry": 
            { "type": "LineString",
             "coordinates": [ 
             [ 17.877073, 59.461653 ], 
             [ 17.877116, 59.461598 ], 
             [ 17.876936, 59.461507 ], 
             [ 17.876936, 59.461323 ], 
             [ 17.876773, 59.461098 ], 
             [ 17.876430, 59.460885 ], 
             [ 17.876413, 59.460553 ], 
             [ 17.876576, 59.460280 ], 
             [ 17.876575, 59.460078 ]

              ] } }

                ]
            };

  }

           

