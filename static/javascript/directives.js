angular.module("dashboard").directive('map', function() {
    return {
      link: function(scope, element, attrs) {        
        var map = new DevTrac.Map(element);
        var simplified_layers = ["01", "005", "001", "0005", "0002", "0001" ];
        $.each(simplified_layers, function(index, tolerence) {
          // this need to move to a controller
          $.getJSON("/static/javascript/geojson/uganda_districts_2011_" + tolerence + ".json", function(geojsonFeature, textStatus, jqXHR) {
            map.addGeoJsonLayer(geojsonFeature, tolerence);
          });  
        });

        scope.$watch("district", function(){          
          if (scope.district != undefined) {
            console.log("watching district scope is on ... after validation ");
            var coords = scope.district.centroid.coordinates
            map.setView(coords[1], coords[0], 10);
          }
        });

        scope.$watch("level", function(){
          if (scope.level != "national") {            
            map.setView(0.3136, 32.5811, 7);
          }
        });
      }
    };
  })