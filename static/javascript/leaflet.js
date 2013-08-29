$(function(){

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
	
	map.addLayer(osm);
	map.addLayer(uganda_disricts);
});


