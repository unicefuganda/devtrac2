angular.module("dashboard")
    .service('districtService', function($http, $filter, $rootScope, $q, summaryService, ureportService, projectService) {
        var self = this;
        if (typeof(callbacks) == 'undefined') {
            callbacks = {}
            callbackCounter = 0
        }

        this.getData = function(locationkeys, filter) {

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
                    
                    summaryService.find(location, true).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    });


                } else if (key == "health-center") {
                    summaryService.find(location, true).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    })
                } else if (key == "school") {
                    summaryService.find(location, true).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    })
                } else if (key == "water-point-point") {
                    self.water_points(location).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    })
                } else if (key == "health-center-point") {
                    self.health_centers(location).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    })
                } else if (key == "school-point") {
                    self.schools(location).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    })
                } else if (key == "ureport") {
                    if ($rootScope.ureportQuestion == undefined || $rootScope.ureportQuestion.selected == null) {
                        allData[locationkey] = {
                            children: []
                        };
                        deffered2.resolve();
                    } else {
                        ureportService.child_results(location, $rootScope.ureportQuestion.selected).then(function(data) {
                            allData[locationkey] = data;
                            deffered2.resolve();
                        });
                    }
                } else if (key == "project-point") {
                    projectService.projects_geojson(location, filter.project).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    });
                } else if (key == "unicef") {
                    projectService.aggregation(location, filter.project).then(function(data) {
                        allData[locationkey] = data;
                        deffered2.resolve();
                    });
                } else if (key == "usaid") {
                    projectService.aggregation(location, filter.project).then(function(data) {
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

            $http({
                method: 'GET',
                url: url,
                cache: true
            }).success(function(data) {
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
            var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:subcounties_2011_0005" + "&outputFormat=json&propertyName=the_geom,DNAME_2010,SNAME_2010,Reg_2011&format_options=callback:subcountiesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district_name.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";
            $http.jsonp(url, {
                cache: true
            });
            return deffered.promise;
        };

        this.parishes_geojson = function(district) {
            var deffered = $q.defer();

            parishesCallback = function(data) {
                deffered.resolve(data);
            }

            var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_parish_2011_50" + "&outputFormat=json&propertyName=the_geom,DNAME_2010,SNAME_2010,PNAME_2006,Reg_2011&format_options=callback:parishesCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + district.toUpperCase() + "</Literal></PropertyIsEqualTo></Filter>";

            $http.jsonp(url, {
                cache: true
            });
            return deffered.promise;
        };

        this.water_points = function(location) {
            var deffered = $q.defer();

            water_pointsCallback = function(data) {

                var parish_points = $.grep(data.features, function(feature, index) {
                    return feature.properties["SNAME_2010"].toLowerCase() == location.subcounty && feature.properties["PNAME_2006"].toLowerCase() == location.parish;
                });

                deffered.resolve({
                    type: "FeatureCollection",
                    features: parish_points
                });
            }
            var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:water_points_replottted" + "&outputFormat=json&propertyName=the_geom,District,SubcountyN,ParishName,SourceType,SNAME_2010,PNAME_2006,Management,Functional&format_options=callback:water_pointsCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>District</PropertyName><Literal>" + location.district.toUpperCase() + "</Literal></PropertyIsEqualTo>" + "</Filter>";

            $http.jsonp(url, {
                cache: true
            });
            return deffered.promise;
        };

        this.health_centers = function(location) {
            var deffered = $q.defer();

            health_centersCallback = function(data) {
                var parish_points = $.grep(data.features, function(feature, index) {
                    return feature.properties["SNAME_2010"].toLowerCase() == location.subcounty && feature.properties["PNAME_2006"].toLowerCase() == location.parish;
                });

                deffered.resolve({
                    type: "FeatureCollection",
                    features: parish_points
                });
            }
            var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_health_centers_replotted" + "&outputFormat=json" + "&format_options=callback:health_centersCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + location.district.toUpperCase() + "</Literal></PropertyIsEqualTo>" + "</Filter>";

            $http.jsonp(url, {
                cache: true
            });
            return deffered.promise;
        };

        this.schools = function(location) {
            var deffered = $q.defer();

            schoolsCallback = function(data) {
                var parish_points = $.grep(data.features, function(feature, index) {
                    return feature.properties["SNAME_2010"].toLowerCase() == location.subcounty && feature.properties["PNAME_2006"].toLowerCase() == location.parish;
                });

                deffered.resolve({
                    type: "FeatureCollection",
                    features: parish_points
                });
            }
            var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?" + "service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:uganda_schools_with_regions" + "&outputFormat=json" + "&format_options=callback:schoolsCallback&filter=<Filter xmlns=\"http://www.opengis.net/ogc\">" + "<PropertyIsEqualTo><PropertyName>DNAME_2010</PropertyName><Literal>" + location.district.toUpperCase() + "</Literal></PropertyIsEqualTo>" + "</Filter>";

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
        }, {
            layer: "ureport_poll_165",
            name: "Barriers to farming",
            wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:ureport_poll_165&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;",
            ureport_poll: 165
        }, {
            layer: "ureport_poll_551",
            name: "Youth Day",
            wmsUrl: "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/wms",
            legendUrl: "request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode:ureport_poll_551&format=image%2Fpng&legend_options=fontAntiAliasing:true;fontSize:12;",
            ureport_poll: 551
        }]

        this.ureport = function() {
            return $.grep(indicators, function(indicator) {
                return indicator.ureport_poll != null;
            });
        }

        this.datasets = function() {
            return $.grep(indicators, function(indicator) {
                return indicator.ureport_poll == null;
            });
        }
    })
    .service("summaryService", function($q, $http) {
        var self = this;
        this.find = function(location) {

            var deffered = $q.defer();

            var locator = location.getName() == "" ? "UGANDA" : "UGANDA, " + location.getName();

            $http({
                method: 'GET',
                url: "/aggregation/" + locator + "?include_children=" + true,
                cache: true
            })
                .success(function(data, status, headers, config) {
                    deffered.resolve(data);
                });
            return deffered.promise;
        }

        this.childLocations = function (location) {
            return self.find(location).then(function(data) {
                return $.map(data.children, function(childSummary, index) { 
                    return DT.Location.fromName(childSummary.locator);
                });
            });
        };
    })
    .service("jsonService", function($q, $http) {
        this.get = function(url) {
            var deffered = $q.defer();
            $http({
                method: 'GET',
                url: url,
                cache: true
            })
                .success(function(data) {
                    deffered.resolve(data);
                });

            return deffered.promise;
        }
    })
    .service("geonodeService", function($q, $http) {
        this.get = function(dataset) {
            var deffered = $q.defer();

            DT.JSONPCallbacks[dataset] = function(data) {
                deffered.resolve(data);
            };

            var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:" + dataset + "&outputFormat=json" + "&format_options=callback:DT.JSONPCallbacks." + dataset;
            $http.jsonp(url, {
                cache: true
            });
            return deffered.promise;
        };
    })
    .service("boundaryService", function(jsonService) {

        this.districts = function(locator) {
            var self = this;
            url = "/static/javascript/geojson/uganda_districts_2011_with_indicators.json";
            return jsonService.get(url).then(function(data) {
                return $.grep(data.features, self.locatorFilter(locator));
            })
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

        this.mapFeature = function(data) {
            var config = new DT.IndicatorConfig(DT.IndicatorConfig.district)
            if (data.length == 0)
                return [];
            var formatedValues = $.map(data[0].properties, function(value, key) {
                return [config.format(key, value)]
            });
            return $.grep(formatedValues, function(value) {
                return value != null;
            })
        }
    })
    .service("ureportService", function(jsonService, $filter) {

        this.questions = function() {
            var url = "/ureport/questions"

            return jsonService.get(url);
        }

        this.top5 = function(location, question) {
            var url = "/ureport/questions/" + question.id + "/top5/" + location.getName(true).toUpperCase();
            return jsonService.get(url);
        }

        this.results = function(location, question) {


            var url = "/ureport/questions/" + question.id + "/results/" + location.getName(true).toUpperCase();
            return jsonService.get(url).then(function(data) {
                if (data == "null")
                    return null;
                return data;
            });
        }

        this.child_results = function(location, question) {
            var url = "/ureport/questions/" + question.id + "/child_results/" + location.getName(true).toUpperCase();
            return jsonService.get(url);
        }
    })
    .service("projectService", function(jsonService, geonodeService, summaryService) {
        var self = this;
        
        var getUniquePartners = function(features) {
            var features = $.map(features, function(project, index) { return {
                id: project.properties['PARTNER'].toLowerCase(),
                name: project.properties['PARTNER']
            }})
            return DT.unique(features).sort(function (partner1, partner2) { return partner1.name < partner2.name; });
        };

        var getUniqueImplementingPartners = function(features) {
            var features = $.map(features, function(project, index) {
                return project.properties['IMPLEMENTE']
            });
            return DT.unique(features).sort();  
        }

        var filterByLocation = function(features, location) {
            return $.grep(features, function(feature) { 
                var featureLocation = new DT.Location({
                    region: feature.properties['Reg_2011'],
                    district: feature.properties['DNAME_2010'],
                    subcounty: feature.properties['SNAME_2010'],
                    parish: feature.properties['PNAME_2006']
                });
                return location.contains(featureLocation);
            });
        };

        var filterProjects = function(data, location, projectFilter) {
            var features = filterByLocation(data.features, location);            
            var partners = getUniquePartners(data.features);

            $.each(partners, function(index, partner) {
                if (projectFilter.partner[partner.id] == undefined || projectFilter.partner[partner.id] == false) {
                    features =  $.grep(features, function(feature) { 
                        return feature.properties['PARTNER'].toLowerCase() != partner.id; 
                    });
                }
            })
            if (projectFilter.sectors && projectFilter.sectors.length > 0) {
                features = $.grep(features, function(project) {
                    return $.inArray(project.properties['SECTOR'], projectFilter.sectors) != -1
                });
            }

            if(projectFilter.statuses && projectFilter.statuses.length > 0){
                features = $.grep(features,function(project){
                    return $.inArray(project.properties['STATUS'], projectFilter.statuses) != -1
                });
            }  

            if(projectFilter.implementingPartners && projectFilter.implementingPartners.length > 0){
                features = $.grep(features,function(project){
                    return $.inArray(project.properties['IMPLEMENTE'], projectFilter.implementingPartners) != -1
                });
            }    

            return features;
        };

        var calculateAggregation = function (partners, location, projects) {
            var locationProjects = filterByLocation(projects, location);
            var projectAggregation = {};
            $.each(partners, function(index, partner) {
                var partnerProjects = $.grep(locationProjects, function(project) { return project.properties["PARTNER"] == partner.name});
                projectAggregation[partner.id] = partnerProjects.length;
            });
            return projectAggregation;
        };

        var projectsGeojson = geonodeService.get('projects');

        this.partners = function() {
            return projectsGeojson.then(function(data) { return getUniquePartners(data.features) });
        };

        this.sectors = function () {
            return ["Basic Education", "Agriculture", "Basic life skills for youths and Adults", "Social, Small and medium-sized enterprises (SME) development"];
        };

        this.statuses = function () {
            return ["Pipeline/identification","Implementation","Completion","Post-completion","Cancelled"];
        };

        this.implementingPartners = function () {
            return projectsGeojson.then(function(data) { 
                var result =  getUniqueImplementingPartners(data.features) 
                console.log(result);
                return result;
            });
        }

        this.aggregation = function (location, projectFilter) {
            return projectsGeojson.then(function(data) {
                var partners = getUniquePartners(data.features)
                var filteredProjects = filterProjects(data, location, projectFilter);
                return summaryService.childLocations(location).then(function(locations) {
                    var children = $.map(locations, function(location, index) {
                        return {
                            locator: location.getName(),
                            info: calculateAggregation(partners, location, filteredProjects)
                        }
                    });

                    return { children: children};
                });  
            });
        };

        this.projects_geojson = function (location, projectFilter) {
            return projectsGeojson.then(function(data) {
                return {
                    type: "FeatureCollection",
                    features: filterProjects(data, location, projectFilter)
                };
            });
        };
    });;