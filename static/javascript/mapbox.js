
var mapbox = {};

$(function(){  
  var map = L.mapbox.map('map', 'jopima.map-qiqfxyek');

  var uganda_disricts = L.tileLayer.wms("http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms", {
	    layers: 'geonode:uganda_districts_2010',
	    format: 'image/png',
	    transparent: true,
	    attribution: "Uganda disctrict data"
	});	
	
	map.addLayer(uganda_disricts);

})