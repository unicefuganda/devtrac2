angular.module("dashboard").service('districtService', function($http, $filter) {
    var self = this;
    
    this.all = function(result) {
        if (self.districts) {
            result(self.districts);
            return;
        }
        $http({
            method: 'GET',
            url: '/districts.json'
        }).
        success(function(data, status, headers, config) {
            self.districts = data.districts;
            result(data.districts);
        });
    };

    this.find_by_name = function(name, result) {
        self.all(function(districts) {
            var district = $filter('filter')(districts, function(district) {
                return district.name.toLowerCase() == name.toLowerCase();
            })[0];
            result(district);
        });
    };

    this.geojson = function(result) {
        $http({
            method: 'GET',
            url: '/static/javascript/geojson/uganda_districts_2011_005.json'
        }).
        success(function(data, status, headers, config) {
            result(data);
        });
    };

    this.subcounties_geojson = function(district_name, result) {
        processJSON = function(data) {          
            result(data)
        }

        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?"
        +"service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_subcounties_2011_001"
        +"&outputFormat=json&format_options=callback:processJSON&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">"
        +"<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() 
        +"</Literal></PropertyIsEqualTo></Filter>";

        $.ajax({
            url: url,
            dataType: "jsonp",
            cache:true,
            jsonpCallback : 'rubbish'
        });

    }
});