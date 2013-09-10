var dashboard = angular.module('dashboard', []).
  config(function($routeProvider, $interpolateProvider, $locationProvider) {  
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', { controller: "DashboardCtrl", templateUrl: '/static/templates/show.html' })  
      .when('/district/:district', { controller: "DashboardCtrl", templateUrl: '/static/templates/show.html' })
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
  }).
  directive('map', function() {
    return {
      link: function(scope, element, attrs) {
        var map = new DevTrac.Map(element);
        var simplified_layers = ["01", "005", "001", "0005", "0002", "0001" ]
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
          if (scope.level != "national") {
            map.setView(0.3136, 32.5811, 7);
          }
        });
      }
    };
  }).service('districtService', function($http, $filter) {
  var self = this;
  this.all = function(result) {
    if (self.districts) {
      result(self.districts);
      return;
    }

    $http({method: 'GET', url: '/districts.json'}).
      success(function(data, status, headers, config) {  
        self.districts = data.districts;
        result(data.districts); 
      });
  };

  this.find_by_name = function(name, result) {
    self.all(function(districts) {
      var district = $filter('filter')(districts, function(district) { return district.name.toLowerCase() == name.toLowerCase(); })[0]; 
      result(district);
    });
  };
}).controller("DashboardCtrl", function($rootScope, districtService, $routeParams) {
  if (!$routeParams.district) {
    $rootScope.level = "national";
  }
  else {
    districtService.find_by_name($routeParams.district, function(district){
      $rootScope.district = district;
    });
  }
});

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
    }
  }
};