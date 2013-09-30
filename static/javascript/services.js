angular.module("dashboard").service('districtService', function($http, $filter, $rootScope, $q) {
    var self = this;

    this.getData = function(locationkeys) {

        var deffered3 = $q.defer();
        var allData = {};

        var promises = $.map(locationkeys, function(locationkey) {
            var deffered2 = $q.defer();
            var key = locationkey[0]
            var location = locationkey[1];

            if (key == "region") {
                self.regions_geojson().then(function(data) {
                    allData[locationkey] = data;
                    deffered2.resolve();
                });
            } else if (key == "district") {
                self.districts(location.region).then(function(data) {
                    allData[locationkey] = data;
                    deffered2.resolve();
                });
            } else if (key == "district_outline") {
                self.districts().then(function(data) {
                    allData[locationkey] = data;
                    deffered2.resolve();
                });
            } else if (key == "subcounty") {
                self.subcounties_geojson(location.district)
                    .then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    });

            } else if (key == "parish") {

                self.parishes_geojson(location.district)
                    .then(function(data) {
                        var parishes = $.grep(data.features, function(feature, index) {
                            return feature.properties["SNAME_2010"].toLowerCase() == location.subcounty;
                        });
                        allData[locationkey] = {
                            type: "FeatureCollection",
                            features: parishes
                        };
                        deffered2.resolve();
                    });
            } else if (key == "water-point") {
                self.water_points(location.district)
                    .then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    });
            } else if (key == "health-center") {
                self.health_centers(location.region)
                    .then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    });
            } else if (key == "school") {
                self.schools(location.region)
                    .then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    });
            }
            return deffered2.promise;
        });

        $q.all(promises).then(function() {
            deffered3.resolve(allData);
        });

        return deffered3.promise;
    }

    this.districts = function(region_name) {
        var deffered = $q.defer();
        $http({
            method: 'GET',
            url: '/static/javascript/geojson/uganda_districts_2011_005.json',
            cache: true
        }).
        success(function(data, status, headers, config) {
            if (region_name == undefined) {
                deffered.resolve(data)
            } else {
                var districts = $.grep(data.features, function(feature, index) {
                    return feature.properties["Reg_2011"] != null && feature.properties["Reg_2011"].toLowerCase() == region_name;
                });
                deffered.resolve({
                    type: "FeatureCollection",
                    features: districts
                });
            }

        });
        return deffered.promise;
    };

    this.regions_geojson = function() {
        var deffered = $q.defer();

        regionsCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_regions_2011_01" + "&outputFormat=json&format_options=callback:regionsCallback";
        $http.jsonp(url, {
            cache: true
        });
        return deffered.promise;
    };

    this.subcounties_geojson = function(district_name) {
        var deffered = $q.defer();

        subcountiesCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_subcounties_2011_0005" + "&outputFormat=json&format_options=callback:subcountiesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";
        $http.jsonp(url, {
            cache: true
        });
        return deffered.promise;
    };

    this.parishes_geojson = function(district_name) {
        var deffered = $q.defer();

        parishesCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_parish_2011_50" + "&outputFormat=json&propertyName=the_geom,DNAME_2010,SNAME_2010,PNAME_2006,SUBREGION&format_options=callback:parishesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";

        $http.jsonp(url, {
            cache: true
        });
        return deffered.promise;
    };


    this.water_points = function(district_name) {
        var deffered = $q.defer();

        water_pointsCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://192.237.187.62:6081/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:waterpoints_wgs84" + "&outputFormat=json&propertyName=the_geom,District,SubcountyN,ParishName,SourceType," + "Management,Functional&format_options=callback:water_pointsCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>District</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo>" + "</Filter>";

        $http.jsonp(url, {
            cache: true
        });
        return deffered.promise;
    };

    this.health_centers = function(region_name) {
        var deffered = $q.defer();

        health_centersCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_health_centers_replotted" + "&outputFormat=json" + "&format_options=callback:health_centersCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>Reg_2011</PropertyName><Literal>" + region_name.toUpperCase() + "</Literal></PropertyIsEqualTo>" + "</Filter>";

        $http.jsonp(url, {
            cache: true
        });
        return deffered.promise;
    };

    this.schools = function(region_name) {
        var deffered = $q.defer();

        schoolsCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_schools_with_regions" + "&outputFormat=json" + "&format_options=callback:schoolsCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>Reg_2011</PropertyName><Literal>" + region_name.toUpperCase() + "</Literal></PropertyIsEqualTo>" + "</Filter>";

        $http.jsonp(url, {
            cache: true
        });
        return deffered.promise;
    };
}).service("indicatorService", function() {
    var indicators = [{
        layer: "uganda_district_indicators_2",
        key: "CompletePS_Perc",
        name: "Percentage of children completing Primary School",
        wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
        legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:uganda_district_indicators_2&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;"
    }, {
        layer: "uganda_districts_2011_with_school_start",
        key: "School_Start_at6_Perc",
        name: "Percentage of children starting school at 6",
        wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
        legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:uganda_districts_2011_with_school_start&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;"
    }];

    this.all = function() {
        return indicators;
    }
});