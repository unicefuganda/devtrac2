angular.module("dashboard")
    .service("projectService", function(jsonService, geonodeService, summaryService) {
        var self = this;
        var getUniquePartners = function(features) {
            var features = $.map(features, function(project, index) { 
            	return project.properties['PARTNER']
            });
            return DT.unique(features).sort();
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
            if (optionsHash == undefined)
                return [];
            return $.map(optionsHash, function(value, key){
                if(value)
                    return key;
            });
        };
        
        var filterProjects = function(features, projectFilter) {
            var partners = getUniquePartners(features);

            if (projectFilter.sectors && projectFilter.sectors.length > 0 ) {
                features = $.grep(features, function(project) {
                    return $.inArray(project.properties['SECTOR'], projectFilter.sectors) != -1
                });
            }

            if(projectFilter.status && DT.values(projectFilter.status).some(function(isSelected) { return isSelected; })){
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



        var partnerLegend = function(projectFilter, features) {
            if (projectFilter.partners != null && projectFilter.partners.length > 0)
            {
                return { partners: projectFilter.partners, type: 'PARTNER'};
            } else if(projectFilter.financialOrgs != null && projectFilter.financialOrgs.length > 0) {
                return { partners: projectFilter.financialOrgs, type: 'FINANCIAL'};
            }

            if(projectFilter.organisation == "FUNDING")
            	return { partners: DT.defaultFundingPartners, type: 'PARTNER' };
            else
            	return { partners: DT.defaultFinancialPartners, type: 'FINANCIAL' };
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

                var features = filterByLocation(data.features, location);
                var results = filterProjects(features, projectFilter)

                return {
                    geojson: {
                        type: "FeatureCollection",
                        features: results,
                    },
                    legendPartners: partnerLegend(projectFilter, results)
                };
            });
        };

        this.allProjects = function(location, projectFilter) {
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
        }

        this.projects = function(location, projectFilter, startingIndex, number){
            return self.allProjects(location, projectFilter).then(function(projects) {
                return {
                    list: projects.slice(startingIndex, startingIndex + number),
                    total: projects.length 
                };
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

                var locationFeatures = filterByLocation(data.features, location);
                var filteredProjects = filterProjects(locationFeatures, projectFilter);

                var filterList = function(filterFunc, filterItems) {
                    var isFilterSet = filterItems != undefined && filterItems.length > 0;
                    if (isFilterSet)
                        return DT.unique(filterFunc(locationFeatures).concat(filterItems));
                    else 
                        return DT.unique(filterFunc(filteredProjects));
                };
                var impPartners = filterList(getUniqueImplementingPartners, projectFilter.implementingPartners);
                return {
                    partners: filterList(getUniquePartners, projectFilter.partners),
                    financialOrgs: filterList(getUniqueFinancialOrgs, projectFilter.financialOrgs),
                    implementingPartners: impPartners,
                    sectors: filterList(getUniqueSectors, projectFilter.sectors),
                    statuses: filterList(getUniqueStatuses, filterOutCheckedOptions(projectFilter.status))
                };
            });
        }
        var projectsGeojsonPromise = geonodeService.get('projects');
        var projectsPromise = self.allProjects(new DT.Location({}), {});
    });
