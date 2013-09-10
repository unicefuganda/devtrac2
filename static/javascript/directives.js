angular.module("dashboard").directive('map', function() {
    return {
      link: function(scope, element, attrs) {        
        var map = new DevTrac.Map(element);
        window.map = map;
        var simplified_layers = ["01", "005", "001", "0005", "0002", "0001" ];
        $.each(simplified_layers, function(index, tolerence) {
          // this need to move to a controller
          $.getJSON("/static/javascript/geojson/uganda_districts_2011_" + tolerence + ".json", function(geojsonFeature, textStatus, jqXHR) {
            map.addGeoJsonLayer(geojsonFeature, tolerence);
          });  
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