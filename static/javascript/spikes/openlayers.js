 $(function(){
    var map, layer;

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
            
        map.addLayers([tiled, layer]);

        map.setCenter(
            new OpenLayers.LonLat(32.5811, 0.3136).transform(
                new OpenLayers.Projection("EPSG:4326"),
                map.getProjectionObject()
            ), 7
        );    
    }

    init();
 });

 