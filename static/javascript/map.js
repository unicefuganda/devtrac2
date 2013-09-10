DevTrac = {}
DevTrac.Map = function(element) {

  var map = L.map(element.attr("id"));
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osm = new L.TileLayer(osmUrl, {minZoom: 7, maxZoom: 12});   
  map.addLayer(osm);

  var uganda_districts = L.tileLayer.wms("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms", {
      layers: 'geonode:uganda_districts_2010',
      format: 'image/png',
      transparent: true,
      attribution: "Uganda disctrict data"
  });
  var layers = L.control.layers({tiles: uganda_districts})
  layers.addTo(map);

  return {
    addGeoJsonLayer: function(geojsonFeature, name) {
      var geoJsonLayer = L.geoJson(geojsonFeature, { 
        style: {
        "color": "#ff0000",
        "weight": 1,
        "opacity": 0.65        
        }
      });
      layers.addBaseLayer(geoJsonLayer, name);
    },
    setView: function(lat, lng, zoom) {
      map.setView(new L.LatLng(lat, lng), 10);
    },
    getCenter: function() {
      var center = map.getCenter();
      return [center.lat, center.lng];
    }
  }
};

