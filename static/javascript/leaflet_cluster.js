
var leafletCluster = {};

leafletCluster.sample = function(){


var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
			cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, Points &copy 2012 LINZ',
			cloudmade = L.tileLayer(cloudmadeUrl, {maxZoom: 17, attribution: cloudmadeAttribution}),
			latlng = L.latLng(-37.82, 175.24);

		var map = L.map('map', {center: latlng, zoom: 13, layers: [cloudmade]});

		var markers = L.markerClusterGroup();
		var addressPoints = leafletCluster.data();
		for (var i = 0; i < addressPoints.length; i++) {
			var a = addressPoints[i];
			var title = a[2];
			var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
			marker.bindPopup(title);
			markers.addLayer(marker);
		}

		map.addLayer(markers);

}

leafletCluster.data = function(){

	var addressPoints = [
[0.31628,32.58219, "2"],
[0.28,32.54, "3"],
[1.066667,32.883333, "3A"],
[0.316284, 32.582188, "1"],
[0.424444,33.204167, "5"],
[0.316284,32.582188, "7"],
[0.35,32.583333, "537"],
[0.424444,33.204167, "454"],
[2.235,32.909722 , "176"],
[2.495833,34.669444 , "178"]
]
return addressPoints;
}

leafletCluster.uganda = function(){
var map = L.map('map');
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 15})
	map.setView(new L.LatLng(0.3136,32.5811),7);

	var uganda_disricts = L.tileLayer.wms("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms", {
	    layers: 'geonode:uganda_districts_2010',
	    format: 'image/png',
	    transparent: true,
	    attribution: "Uganda disctrict data"
	});
	var addressPoints = leafletCluster.data();
	var markers = L.markerClusterGroup();
	for (var i = 0; i < addressPoints.length; i++) {
			var a = addressPoints[i];
			var title = a[2];
			var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
			marker.bindPopup(title);
			markers.addLayer(marker);
		}

	map.addLayer(osm);
	map.addLayer(uganda_disricts);
	map.addLayer(markers);

}

$(function(){
	//leafletCluster.sample();
	leafletCluster.uganda();
});