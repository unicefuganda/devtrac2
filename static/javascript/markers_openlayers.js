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

 