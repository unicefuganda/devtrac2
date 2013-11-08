angular.module("dashboard")
    .service('districtService', function($q, summaryService, projectService, geonodeService, jsonService) {

        this.getData = function(locationkeys, filter) {
            var promises = $.map(locationkeys, function(locationkey) {
                var key = locationkey[0];
                var location = locationkey[1];
                return serviceMap[key](location, filter);
            });
            return $q.all(promises);
        }

        var locationFilter = function (location) {
            return function (data) {
                var features = $.grep(data.features, function(feature, index) {
                    return location.contains(DT.Location.fromFeatureProperties(feature.properties));
                });
                return { type: "FeatureCollection", features: features };            
            }
        };

        this.projects_geojson = function(location, filter) {
            return projectService.projects_geojson(location, filter.project);
        }

        this.regions_geojson = function(location) {
            var propertyNames = ["the_geom", "Reg_2011"];
            return geonodeService.get("uganda_regions_2011_01", null, propertyNames).then(locationFilter(location));
        };

        this.districts = function(location) {
            var url = "/static/javascript/geojson/uganda_districts_2011_with_indicators.json";
            return jsonService.get(url).then(locationFilter(location));
        };

        this.subcounties_geojson = function(location) {
            var propertyNames = ["the_geom", "Reg_2011", "DNAME_2010", "SNAME_2010"];
            var filter = { 'DNAME_2010': location.district.toUpperCase() };
            return geonodeService.get("subcounties_2011_0005", filter, propertyNames).then(locationFilter(location));
        };

        this.parishes_geojson = function(location) {
            var propertyNames = ["the_geom","Reg_2011", "DNAME_2010", "SNAME_2010", "PNAME_2006"];
            var filter = { 'DNAME_2010': location.district.toUpperCase() };
            return geonodeService.get("uganda_parish_2011_50", filter, propertyNames).then(locationFilter(location));
        };

        this.water_points = function(location) {
            var filter = { 'DNAME_2010': location.district.toUpperCase() };
            return geonodeService.get("water_points_replottted", filter).then(locationFilter(location));
        };

        this.health_centers = function(location) {
            var filter = { 'DNAME_2010': location.district.toUpperCase() };
            return geonodeService.get("uganda_health_centers_replotted", filter).then(locationFilter(location));
        };

        this.schools = function(location) {
            var filter = { 'DNAME_2010': location.district.toUpperCase() };
            return geonodeService.get("uganda_schools_with_regions", filter).then(locationFilter(location));
        };

        var serviceMap = {
            "region": this.regions_geojson,
            "district": this.districts,
            "district_outline": this.districts,
            "subcounty": this.subcounties_geojson,
            "parish": this.parishes_geojson,
            "water-point": summaryService.find,
            "health-center": summaryService.find,
            "school": summaryService.find,
            "water-point-point": this.water_points,
            "health-center-point": this.health_centers,
            "school-point": this.schools,
            "project-point": this.projects_geojson
        };
    })
    .service("summaryService", function($q, jsonService) {
        this.find = function(location) {
            var url = "/aggregation/" + location.getName(true) 
            return jsonService.get(url);
        }
    })
    .service("jsonService", function($q, $http) {
        this.get = function(url) {
            var deffered = $q.defer();
            $http({
                method: 'GET',
                url: url,
                cache: true
            }).success(function(data) {
                deffered.resolve(data);
            });

            return deffered.promise;
        }
    })
    .service("geonodeService", function($q, $http) {

        var filterQuery = function(filter) {
            var query = "<Filter xmlns=\"http://www.opengis.net/ogc\">";

            for(key in filter) {
                query += "<PropertyIsEqualTo><PropertyName>" + key + "</PropertyName><Literal>" + filter[key] + "</Literal></PropertyIsEqualTo>";
            }
            query += "</Filter>";
            return "&filter=" + query;
        }

        this.get = function(dataset, filter, propertyNames) {
            var deffered = $q.defer();

            DT.JSONPCallbacks[dataset] = function(data) {
                deffered.resolve(data);
            };

            var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?"
            url += "service=WFS&version=1.0.0&request=GetFeature&outputFormat=json";
            url += "&typeName=geonode:" + dataset
            url += "&format_options=callback:DT.JSONPCallbacks." + dataset;
            url += filter != undefined ? filterQuery(filter) : ""
            url += propertyNames != undefined ? "&propertyName=" + propertyNames.join(",") : ""
            $http.jsonp(url, {
                cache: true
            });
            return deffered.promise;
        };
    })
    .service("indicatorService", function(jsonService, $q) {

        var district_geojson = function(locator) {
            var url = "/static/javascript/geojson/uganda_districts_2011_with_indicators.json";
            return jsonService.get(url).then(function(data) {
                return DT.first(data.features, function(feature) {
                    return DT.Location.fromFeatureProperties(feature.properties).equals(locator);
                });
            })
        };

        this.find = function(locator) {
            if (locator.level() != "district") {
                var deffered = $q.defer();
                deffered.resolve(null);
                return deffered.promise;
            }
            return district_geojson(locator).then(function(data) { return data.properties; });
        }
    });