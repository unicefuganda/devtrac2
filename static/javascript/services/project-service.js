angular.module("dashboard")
    .service("projectService", function(jsonService, geonodeService, summaryService) {
        var self = this;
        var getUniquePartners = function(features) {
            var features = $.map(features, function(project, index) { return {
                id: project.properties['PARTNER'],
                name: project.properties['PARTNER'],
            }});
            return DT.unique(features).sort(function (partner1, partner2) { return partner1.name < partner2.name; });
        };

        var getUniqueFinancialOrgs = function(features) {
            var features = $.map(features, function(project, index) {
                return project.properties['FINANCIAL']
            });
            return DT.unique(features).sort();
        };

        var getUniqueImplementingPartners = function(features) {
            var features = $.map(features, function(project, index) {
                return project.properties['IMPLEMENTE']
            });
            return DT.unique(features).sort();
        };

        var getUniqueSectors = function(features) {
            var features = $.map(features, function(project, index) {
                return project.properties['SECTOR']
            });
            return DT.unique(features).sort();
        }

        var getUniqueStatuses = function(features) {
            var features = $.map(features, function(project, index) {
                return project.properties['STATUS']
            });
            return DT.unique(features).sort();
        }

        var filterByLocation = function(features, location) {
            return $.grep(features, function(feature) {
                var featureLocation = DT.Location.fromFeatureProperties(feature.properties);
                return location.contains(featureLocation);
            });
        };

        var filterOutCheckedOptions = function(optionsHash){
            return $.map(optionsHash, function(option, index){
                if(option)
                    return index;
            });
        }
        var isChoiceSetChecked = function(optionsHash){
            var checkedOptions = filterOutCheckedOptions(optionsHash);
            if (checkedOptions.length > 0)
                return true;
            return false;
        }

        var allChoicesUnchecked = function(optionsHash){
            var unchecked = true;
            $.each(optionsHash, function(index, option){
                if(option){
                    unchecked = false;
                    return;
                }
            });
            return unchecked;
        }

        var filterProjects = function(data, location, projectFilter) {
            var features = filterByLocation(data.features, location);
            var partners = getUniquePartners(data.features);

            if (projectFilter.sectors && projectFilter.sectors.length > 0) {
                features = $.grep(features, function(project) {
                    return $.inArray(project.properties['SECTOR'], projectFilter.sectors) != -1
                });
            }

            if(projectFilter.status && Object.keys(projectFilter.status).length > 0){
                features = $.grep(features,function(project){
                    var checkedStatuses = filterOutCheckedOptions(projectFilter.status);
                    return $.inArray(project.properties['STATUS'], checkedStatuses) != -1
                });
            }

            if( projectFilter.partners && projectFilter.partners.length > 0){
                features = $.grep(features,function(project){
                    return $.inArray(project.properties['PARTNER'], projectFilter.partners) != -1
                });
            }

            if( projectFilter.financialOrgs && projectFilter.financialOrgs.length > 0){
                features = $.grep(features,function(project){
                    return $.inArray(project.properties['FINANCIAL'], projectFilter.financialOrgs) != -1
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



        this.partnerLegend = function(projectFilter, features) {
            if (projectFilter.partners != null && projectFilter.partners.length > 0)
            {
                return { partners: projectFilter.partners, type: 'PARTNER'};
            } else if(projectFilter.financialOrgs != null && projectFilter.financialOrgs.length > 0) {
                return { partners: projectFilter.financialOrgs, type: 'FINANCIAL'};
            }
            return { partners: [], type: 'PARTNER' };
        }

        this.partners = function() {
            return projectsGeojsonPromise.then(function(data) { return getUniquePartners(data.features) });
        };

        this.financialOrgs = function() {
            return projectsGeojsonPromise.then(function(data) { return getUniqueFinancialOrgs(data.features) });
        };

        this.sectors = function () {
            return projectsGeojsonPromise.then(function(data) { return getUniqueSectors(data.features) });
        };

        this.statuses = function () {
            return projectsGeojsonPromise.then(function(data) { return getUniqueStatuses(data.features) });
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

        this.projects_geojson = function (location, projectFilter) {
            return projectsGeojsonPromise.then(function(data) {

                var results = filterProjects(data, location, projectFilter)

                return {
                    geojson: {
                        type: "FeatureCollection",
                        features: results,
                    },
                    legendPartners: self.partnerLegend(projectFilter, results)
                };
            });
        };

        this.projects = function(location, projectFilter){
            return self.projects_geojson(location, projectFilter).then(function(data){

                var projectHash = data.geojson.features.reduce(function(projects, projectFeature) {
                    var projectId = projectFeature.properties['PROJECT_ID']

                    if (projects[projectId] == null)
                    {
                        projects[projectId] = new DT.Project(projectFeature.properties);
                    }
                    projects[projectId].addLocation(projectFeature.properties);

                    return projects;
                }, {})

                var values = DT.values(projectHash);

                values = values.sort(function (project1, project2) {
                    if (project1.name > project2.name)
                      return 1;
                    if (project1.name < project2.name)
                      return -1;
                    return 0;
                });

                return values;
            });
        };

        this.findById = function(projectId) {

            return projectsPromise.then(function(projects) {
                var project = DT.first(projects, function(project) {
                    return project.id == projectId;
                });

                return project;
            });
        };

        this.syncProjectFilters = function(location, projectFilter){
            return projectsGeojsonPromise.then(function(data) {

                var filteredProjects = filterProjects(data, location, projectFilter);
                return {
                    partners: getUniquePartners(filteredProjects),
                    financialOrgs: getUniqueFinancialOrgs(filteredProjects),
                    sectors: getUniqueSectors(filteredProjects),
                    implementingPartners: getUniqueImplementingPartners(filteredProjects),
                    statuses: getUniqueStatuses(filteredProjects)
                };
            });
        }

        var projectsGeojsonPromise = geonodeService.get('projects');
        var projectsPromise = self.projects(new DT.Location({}), {});
    });
