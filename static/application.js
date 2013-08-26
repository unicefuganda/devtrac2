$(function(){
	$.getJSON("/static/districts.json", function(districts) {  

		var map = L.map('map');
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 15})
		map.setView(new L.LatLng(0.3136,32.5811),7);
		map.addLayer(osm);
		
		L.geoJson(districts, {style:  { "color": "red", "weight": 1 } }).addTo(map);
	});

});


