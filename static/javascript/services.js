angular.module("dashboard").service('districtService', function($http, $filter, $rootScope, $q) {
    var self = this;

    this.fetchDistrictData = function(district_name) {
        var deffered = $q.defer();

        // if ($rootScope.district_data != null && $rootScope.district_data.name == district_name) {
        //     deffered.resolve($rootScope.district_data.data);
        //     return deffered.promise
        // }

        var district_data = {};
        var subcounties_promise = self.subcounties_geojson(district_name)
            .then(function(data) {
                district_data.subcounties = data
            });

        var parishes_promise = self.parishes_geojson(district_name)
            .then(function(data) {
                district_data.parishes = data
            });

        var water_points_promise = self.water_points(district_name)
            .then(function(data) {
                district_data.water_points = data
            });

        $q.all([subcounties_promise, parishes_promise, water_points_promise])
            .then(function() {
                $rootScope.district_data = { name: district_name, data: district_data };
                deffered.resolve(district_data);
            });

        return deffered.promise;
    },

    this.geojson = function(result) {
        $http({
            method: 'GET',
            url: '/static/javascript/geojson/uganda_districts_2011_005.json'
        }).
        success(function(data, status, headers, config) {
            result(data);
        });
    };

    this.subcounties_geojson = function(district_name) {
        var deffered = $q.defer();

        subcountiesCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_subcounties_2011_0005" + "&outputFormat=json&format_options=callback:subcountiesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";
        $http.jsonp(url, { cache: true});
        return deffered.promise;
    };

    this.parishes_geojson = function(district_name) {
        var deffered = $q.defer();

        parishesCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_parish_2011_50" + "&outputFormat=json&propertyName=the_geom,DNAME_2010,SNAME_2010,PNAME_2006&format_options=callback:parishesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";

        $http.jsonp(url, { cache: true});
        return deffered.promise;
    };


    this.water_points = function(district_name) {
        var deffered = $q.defer();

        water_pointsCallback = function(data) {
            deffered.resolve(data);
        }
         var url = "http://92.237.187.62:6081/geoserver/geonode/ows?"
        +"service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:waterpoints_wgs84"
        +"&outputFormat=json&propertyName=the_geom,District,SubcountyN,ParishName,SourceType,"
        +"Management,Functional&format_options=callback:water_pointsCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">"
        +"<PropertyIsEqualTo><PropertyName>District</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo>"
        + "</Filter>";

        $http.jsonp(url, { cache: true});
        return deffered.promise;
    };
});