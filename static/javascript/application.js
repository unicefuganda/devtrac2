$(function(){
  $.getJSON("/static/javascript/version.json", function(data, textStatus, jqXHR) {
    $("#environment").html(data.environment);
    $("#sha").html(data.sha);
    $("#time").html(data.time);
  });  
<<<<<<< HEAD
=======
  map = L.map('map');
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 15, attribution: osmAttrib});   

  var myStyle = {
    "color": "#ff0000",
    "weight": 2,
    "opacity": 0.65
  };
  

  var uganda_districts = L.tileLayer.wms("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/gwc/service/wms", {
      layers: 'geonode:uganda_districts_2010',
      format: 'image/png',
      transparent: true,
      attribution: "Uganda disctrict data"
  });

  map.addLayer(osm);

  $.getJSON("/static/javascript/geojson/uganda_districts_2011_005.json", function(geojsonFeature, textStatus, jqXHR) {
    var geoJson = L.geoJson(geojsonFeature, { style: myStyle});

    L.control.layers({simplified: geoJson, tiles: uganda_districts}).addTo(map);
    map.addLayer(geoJson)
  });  






>>>>>>> simplified dataset [#56493186]
});