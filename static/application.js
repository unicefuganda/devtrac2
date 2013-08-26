var map = L.map('map');

var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 7, maxZoom: 12, attribution: osmAttrib})
map.setView(new L.LatLng(0.3136,32.5811),7);
map.addLayer(osm);