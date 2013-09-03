var cluster = {};
cluster.Long = 32.5811;
cluster.Lat = 0.3136;
cluster.zoom = 7;
cluster.map = null;
cluster.baseLayer = null;
cluster.lowRule = null;
cluster.middleRule = null;
cluster.highRule = null;
cluster.styles = null;
cluster.ug_projects_url = '/static/javascript/projects_uganda.json';
cluster.world_cities_URL = '/static/javascript/world_cities.json';

cluster.init = function(){

	this.load = function(){
     cluster.map = new OpenLayers.Map("map");
     cluster.baseLayer = new OpenLayers.Layer.OSM();
     cluster.map.addLayer(cluster.baseLayer);
     var initial_location = new OpenLayers.LonLat(cluster.Long, cluster.Lat);
     
     initial_location.transform(new OpenLayers.Projection("EPSG:4326"), 
     	new OpenLayers.Projection("EPSG:900913"));

     cluster.map.setCenter(initial_location, cluster.zoom);
     cluster.map.addControl(new OpenLayers.Control.LayerSwitcher());

	}

	this.addVectorLayer = function(vector){		
     cluster.map.addLayer(vector);
	}
}

cluster.getColors = function(){

var colors = {
                low: "rgb(181, 226, 140)", 
                middle: "rgb(241, 211, 87)", 
                high: "rgb(253, 156, 115)"
            };

            return colors;
}

cluster.setRules = function(){

	var colors = cluster.getColors();
cluster.lowRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: "count",
                    value: 15
                }),
                symbolizer: {
                    fillColor: colors.low,
                    fillOpacity: 0.9, 
                    strokeColor: colors.low,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 10,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });

cluster.middleRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "count",
                    lowerBoundary: 15,
                    upperBoundary: 50
                }),
                symbolizer: {
                    fillColor: colors.middle,
                    fillOpacity: 0.9, 
                    strokeColor: colors.middle,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 15,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });

cluster.highRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: "count",
                    value: 50
                }),
                symbolizer: {
                    fillColor: colors.high,
                    fillOpacity: 0.9, 
                    strokeColor: colors.high,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 20,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });

}

cluster.vectorLayer = function(){
 
 cluster.setRules();
 cluster.applyRules();

 var vector = new OpenLayers.Layer.Vector("Features", {
                protocol: new OpenLayers.Protocol.HTTP({
                    url: cluster.world_cities_URL,
                    format: new OpenLayers.Format.GeoJSON()
                }),
                renderers: ['Canvas','SVG'],
                strategies: [
                    new OpenLayers.Strategy.Fixed(),
                    new OpenLayers.Strategy.AnimatedCluster({
                        distance: 45,
                        animationMethod: OpenLayers.Easing.Expo.easeOut,
                        animationDuration: 10
                    })
                ],
                styleMap:  new OpenLayers.StyleMap(cluster.styles)
            });

 return vector;

}

cluster.applyRules = function(){
	 cluster.styles = new OpenLayers.Style(null, {
                rules: [cluster.lowRule, cluster.middleRule, cluster.highRule]
            });
}

$(function(){
	var clusters = new cluster.init();
	clusters.load();
	clusters.addVectorLayer(cluster.vectorLayer())

});



