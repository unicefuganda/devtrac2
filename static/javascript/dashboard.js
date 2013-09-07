var map;

function loadLeafletMap(lng, lat, zoom) {  
  map.setView(new L.LatLng(lat, lng), zoom);
}

$(function(){
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

var dashboard = angular.module('dashboard', []).
  config(function($routeProvider, $interpolateProvider, $locationProvider) {  
    // $locationProvider.html5Mode(true);    
    $routeProvider
      .when('/', {controller:ListCtrl, templateUrl:'/static/templates/list.html'})  
      .when('/spikes', {controller:SpikesCtrl, templateUrl:'/static/templates/spikes.html'})  
      .when('/district/:district', { controller:ShowCtrl, templateUrl:'/static/templates/show.html'})
      // .otherwise({redirectTo:'/'});
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
  });

var myApp = dashboard.service('districtService', function($http, $filter) {
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
});

function ListCtrl($scope, $http, districtService) {
  districtService.all(function(districts){
    $scope.districts = districts;
    loadLeafletMap(31.8833, 1.0667, 7)
  });
}

function SpikesCtrl() {}

function ShowCtrl($scope, $http, $filter, $routeParams, districtService) {
  districtService.find_by_name($routeParams.district, function(district){
    $scope.district = district;
    loadLeafletMap(district.centroid.coordinates[0], district.centroid.coordinates[1], 10)
  });


}