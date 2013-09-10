angular.module("dashboard").directive('map', function() {
    return {
      link: function(scope, element, attrs) {        
        var map = new DevTrac.Map(element);
        window.map = map;
        var simplified_layers = ["01", "005", "002", "0015", "001", "0005", "0002" ];
        $.each(simplified_layers, function(index, tolerence) {
          // this need to move to a controller
          $.getJSON("/static/javascript/geojson/uganda_districts_2011_" + tolerence + ".json", function(geojsonFeature, textStatus, jqXHR) {
            map.addGeoJsonLayer(geojsonFeature, tolerence);  
          });  
        });

        scope.$watch("layers", function(layers) {
          if (layers != undefined) {
            map.addBaseLayer(layers[0].features, layers[0].name);  
          }
        });

        scope.$watch("district", function(){          
          if (scope.district != undefined) {
            var coords = scope.district.centroid.coordinates
            map.setView(coords[1], coords[0], 10);
          }
        });

        scope.$watch("level", function(){
          if (scope.level == "national") {    
            map.setView(1.0667, 31.8833, 7);
          }
        });
      }
    };
  })