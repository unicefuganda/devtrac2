angular.module("dashboard").service('districtService', function($http, $filter, $rootScope, $q) {
    var self = this;
    if (typeof(callbacks) == 'undefined') {
        callbacks = {}
        callbackCounter = 0
    }

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
        var districtsCallback = function(data) {
            if (region_name == undefined) {
                return data;
            } else {
                var districts = $.grep(data.features, function(feature, index) {
                    return feature.properties["Reg_2011"] != null && feature.properties["Reg_2011"].toLowerCase() == region_name;
                });
                return {
                    type: "FeatureCollection",
                    features: districts
                };
            }
        }

        var url = "/static/javascript/geojson/uganda_districts_2011_with_indicators.json";

        $http({method: 'GET', url: url} ).success(function(data) { 
            var fitleredData = districtsCallback(data); 
            deffered.resolve(fitleredData);
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
            cache: true,
            callback: ""
        });
        return deffered.promise;
    };

    this.subcounties_geojson = function(district_name) {
        var deffered = $q.defer();

        subcountiesCallback = function(data) {
            deffered.resolve(data);
        }
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:subcounties_with_regions" + "&outputFormat=json&format_options=callback:subcountiesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";
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
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_parish_2011_50" + "&outputFormat=json&propertyName=the_geom,DNAME_2010,SNAME_2010,PNAME_2006,Reg_2011,SUBREGION&format_options=callback:parishesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";

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
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:water_points_replottted" + "&outputFormat=json&propertyName=the_geom,District,SubcountyN,ParishName,SourceType," + "Management,Functional&format_options=callback:water_pointsCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>District</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo>" + "</Filter>";

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
})
.service("heatmapService", function() {
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
})
.service("summaryService", function($q, $http) {
    this.find = function (locator) {
        var deffered = $q.defer();

        locator = locator == "" ? "UGANDA" : "UGANDA, " + locator

        $http({
            method: 'GET',
            url: "/aggregation/" + locator,
            cache: true})
                .success(function(data, status, headers, config) {
                    deffered.resolve(data);
                 });
        return deffered.promise;
    }
})
.service("geoJsonService", function($q, $http) 
{
    this.get = function(url) {
        var deffered = $q.defer();
        $http({method: 'GET', url: url, cache: true})
            .success(function(data) { 
                deffered.resolve(data.features); 
            });

        return deffered.promise;
    }
})
.service("boundaryService", function(geoJsonService){

    this.districts = function (locator) {
        var self = this;
        url = "/static/javascript/geojson/uganda_districts_2011_with_indicators.json";
        return geoJsonService.get(url).then(function(data) { return $.grep(data, self.locatorFilter(locator)); })
    };

    this.locatorFilter = function(locator) {
        return function(feature) {
            var featureLocator = new DT.Location({
              region: feature.properties["Reg_2011"],
              district: feature.properties["DNAME_2010"],
              subcounty: feature.properties["SNAME_2010"],
              parish: feature.properties["PNAME_2006"]
            })
            return featureLocator.equals(locator);
        };
    };
})
.service("indicatorService", function(boundaryService) {

    this.find = function(locator) {
        return boundaryService.districts(locator).then(this.mapFeature);
    }

    this.mapFeature = function (data) {
        var config = new DT.IndicatorConfig(DT.IndicatorConfig.district)
        if (data.length == 0)
            return [];
        var formatedValues = $.map(data[0].properties, function(value, key) { return [config.format(key, value)] });
        return $.grep(formatedValues, function(value) { return value != null; })
    }
});


