var map;

function loadLeafletMap(lng, lat, zoom) {  
  map.setView(new L.LatLng(lat, lng), zoom);
}

$(function(){
  $.getJSON("/static/javascript/version.json", function(data, textStatus, jqXHR) {
    $("#environment").html(data.environment);
    $("#sha").html(data.sha);
    $("#time").html(data.time);
  });  
  map = L.map('map');
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 15, attribution: osmAttrib});   
  

  var uganda_districts = L.tileLayer.wms("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms", {
      layers: 'geonode:uganda_districts_2010',
      format: 'image/png',
      transparent: true,
      attribution: "Uganda disctrict data"
  });

  map.addLayer(osm);
  map.addLayer(uganda_districts);


});