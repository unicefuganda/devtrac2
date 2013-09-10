angular.module("dashboard").service('districtService', function($http, $filter) {
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