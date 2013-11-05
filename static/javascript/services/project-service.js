angular.module("dashboard")
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

            if(projectFilter.years && projectFilter.years.length > 0){
                features = $.grep(features,function(project){

                    var startYear = Number(project.properties['START_PLAN'].substring(6));                        
                    var endYear = Number(project.properties['END_PLANNE'].substring(6));

                    return DT.any(projectFilter.years, function(year) {
                        var testYear = Number(year)
                        return testYear >= startYear && testYear <= endYear;
                    });
                });     
            };

            return features.sort(function (project1, project2) { 
                if ((project1.properties['PROJ_NAME'] + project1.properties['START_PLAN']) > (project2.properties['PROJ_NAME'] + project2.properties['START_PLAN']))
                  return 1;
                if ((project1.properties['PROJ_NAME'] + project1.properties['START_PLAN']) < (project2.properties['PROJ_NAME'] + project2.properties['START_PLAN']))
                  return -1;
                return 0;
            });
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

        var projectsGeojsonPromise = geonodeService.get('projects');
        var projectsPromise = projectsGeojsonPromise.then(function(data) {
            return $.map(data.features, function (projectFeature, index) {
                return new DT.Project(projectFeature.properties);
            });
        });

        var getPartnersWithColorMap = function(dataFeatures){
            DT.markerColorLegend = {};
            var colors = DT.markerColors;

            var partnersWithColors = $.map(getUniquePartners(dataFeatures), function(partner, index){
                partner.color = colors[index];
                DT.markerColorLegend[partner.id] = partner.color;
                return partner;
            });
            return partnersWithColors;
        };

        this.partnersWithColors = function() {
            return projectsGeojsonPromise.then(function(data) {
                return getPartnersWithColorMap(data.features);
            });
        };

        this.partners = function() {
            return projectsGeojsonPromise.then(function(data) { return getUniquePartners(data.features) });
        };

        this.sectors = function () {
            return ["Basic Education", "Agriculture", "Basic life skills for youths and Adults", "Social, Small and medium-sized enterprises (SME) development"];
        };

        this.statuses = function () {
            return ["Pipeline/identification","Implementation","Completion","Post-completion","Cancelled"];
        };

        this.years = function () {
            return ["2008","2009","2010","2011","2012","2013"];
        };

        this.implementingPartners = function () {
            return projectsGeojsonPromise.then(function(data) { 
                var result =  getUniqueImplementingPartners(data.features);
                return result;
            });
        }

        this.aggregation = function (location, projectFilter) {
            return projectsGeojsonPromise.then(function(data) {
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
            return projectsGeojsonPromise.then(function(data) {
                var results = filterProjects(data, location, projectFilter)
                return {
                    type: "FeatureCollection",
                    features: results
                };
            });
        };

        this.projects = function(location, projectFilter){
            return self.projects_geojson(location, projectFilter).then(function(data){
                return $.map(data.features, function (projectFeature, index) {
                    return new DT.Project(projectFeature.properties)
                });
            });
        }

        this.findById = function(projectId) {
            return projectsPromise.then(function(projects) { 
                return DT.first(projects, function(project) { 
                    return project.id == projectId; 
                }); 
            });
        }
    });;