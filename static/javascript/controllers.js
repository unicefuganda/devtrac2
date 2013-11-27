angular.module("dashboard")
.controller("LocationCtrl", function($rootScope, $routeParams) {
    DT.timings["urlchange"] = new Date().getTime();
    $rootScope.location = new DT.Location($routeParams);
})
.controller("DashboardCtrl", function($rootScope) {
    $rootScope.project = { list: null, selected: null };
    $rootScope.siteVisit = { list: null, selected: null };
    $rootScope.filter = new DT.Filter({ health_center: false, water_point: false, school: true, site_visit_point: true, project: { organisation:"FUNDING", status:{} } } );
})
.controller("IndicatorsCtrl", function($scope, $rootScope, heatmapService) {
    $rootScope.indicator = { selected: null }
    $scope.datasets = heatmapService.datasets();
    $scope.ureport_datasets = heatmapService.ureport();
}).controller("SummaryCtrl", function($scope, $rootScope, summaryService, indicatorService, ureportService) {

    $rootScope.$watch("location", function(newLocation, oldLocation) {
        if (newLocation == null)
            return;

        summaryService.find(newLocation).then(function(summary) {
            $scope.summary = summary.info;
        });

        indicatorService.find(newLocation).then(function(indicatorSummary) {
            $scope.indicatorSummary = indicatorSummary;
        });
    });

}).controller("UReportCtrl", function($scope, $rootScope, ureportService) {
    ureportService.questions().then(function(data) {
        $scope.questions = data;
        $rootScope.ureportQuestion = { selected: data[0] }
    });
}).controller("UReportResponsesCtrl", function($rootScope, $scope, ureportService){

    var showUReportResults = function (location, ureportQuestion) {
        $scope.question = {}

        if (ureportQuestion == null || ureportQuestion.selected == null) {
            $scope.ureportTop5 = []
        } else {
            
            ureportService.top5(location, ureportQuestion.selected).then(function (data) {
                $scope.question.top5 = data
            });

            ureportService.results(location, ureportQuestion.selected).then(function (data) {
                $scope.question.results = data
            });
        }
    }

    $rootScope.$watch("location", function(newLocation, oldLocation) {
        if (newLocation == null)
            return;

        showUReportResults($rootScope.location, $rootScope.ureportQuestion);
    });

    $rootScope.$watch("ureportQuestion", function(newQuestion) {
        showUReportResults($rootScope.location, $rootScope.ureportQuestion);
    }, true);

}).controller("PartnersCtrl", function($rootScope, $scope, projectService, $timeout){

    $scope.isSelected = function(id, collection) {
        if($scope.filter.project == undefined )
            return false;

        return $scope.filter.project[collection] && $scope.filter.project[collection].indexOf(id) != -1
    };

    $scope.partners = projectService.partners();
    $scope.financialOrgs = projectService.financialOrgs();
    $scope.sectors = projectService.sectors();
    $scope.statuses = projectService.statuses();
    $scope.implementingPartners = projectService.implementingPartners();
    $scope.years = projectService.years();

    var isFilterSelected = function(filterLabel){

        var filters = $scope.filter.project[filterLabel];
        if (angular.isObject(filters)) {
            var result = DT.values(filters).some( function(isSelected){ return isSelected; } );
            return result;
        } else if (angular.isArray(filters)) {
            return filters.length > 0;
        }

        return false;
    }

    var updateProjectFilters = function() {
        if ($scope.filter == null || $scope.location == null)
            return;

        projectService.syncProjectFilters($scope.location, $scope.filter.project).then(function(data){
            $scope.partners = data.partners;
            $scope.financialOrgs = data.financialOrgs;
            $scope.sectors = data.sectors;
            $scope.implementingPartners = data.implementingPartners;
            $scope.statuses = data.statuses;
        })

    }

    $scope.$watch("location", updateProjectFilters, true);
    $scope.$watch("filter.project", updateProjectFilters, true);

    
})
.controller("ProjectsCtrl", function($scope, projectService){
    $scope.currentPage = 1;

    var pageList = function(currentPage) {
        var listChucks = DT.splitIntoChuncks($scope.project.list, 5);
        $scope.project.pagedList = listChucks[$scope.currentPage - 1];
        $scope.startCount = ((currentPage - 1) * 5) + 1;
        $scope.endCount = ((currentPage - 1) * 5) + $scope.project.pagedList.length;
    };

    $scope.$watch('currentPage', function() {
        if ($scope.project == null || $scope.project.list == null)
            return;

        pageList($scope.currentPage);
    })

    $scope.$watch('project.list', function(newValues, oldValues){
        if ($scope.project == null || $scope.project.list == null)
            return;

        $scope.totalItems = $scope.project.list.length;
        $scope.currentPage = 1;

        pageList($scope.currentPage);
    });

    var updateProjectList = function() {
        if ($scope.filter == null)
            return;
        projectService.projects($scope.location, $scope.filter.project).then(function(data){
            $scope.project.list = data;
        });
    };

    $scope.$watch("filter.project", updateProjectList, true);
    $scope.$watch("location", updateProjectList, true);
})
.controller("SiteVisitCtrl", function($scope,siteVisitService){
    $scope.currentPage = 1;

    var pageList = function(currentPage) {
        var listChucks = DT.splitIntoChuncks($scope.siteVisit.list, 5);
        $scope.siteVisit.pagedList = listChucks[$scope.currentPage - 1];
        $scope.startCount = ((currentPage - 1) * 5) + 1;
        $scope.endCount = ((currentPage - 1) * 5) + $scope.siteVisit.pagedList.length;
    };

    $scope.maxSize = 5;
    $scope.currentPage = 1;

    $scope.$watch('currentPage', function() {

        if ($scope.siteVisit == null || $scope.siteVisit.list == null)
            return;
        pageList($scope.currentPage);
    })

    $scope.$watch('siteVisit.list', function(newValues, oldValues){
        if ($scope.siteVisit == null || $scope.siteVisit.list == null)
            return;

        $scope.totalItems = $scope.siteVisit.list.length;
        $scope.currentPage = 1;

        pageList($scope.currentPage);
    });

    var updateSiteVisitList = function() {
        if ($scope.location == null)
            return;

        siteVisitService.siteVisits($scope.location).then(function(data){
            $scope.siteVisit.list = data;
        });
    }

    $scope.$watch("location", updateSiteVisitList, true);
})
.controller("PrintCtrl", function($rootScope, $scope, projectService, summaryService, siteVisitService, $location, ureportService) {    

    var locator = $location.search()['locator']
    var location = DT.Location.fromName(locator);

    $rootScope.location = location;
    projectService.projects(location, {}).then(function(projects) {
        $rootScope.projects = projects;    
    });

    projectService.projects(location, {}).then(function(projects) {
        $rootScope.projects = projects;    
    });

    summaryService.find(location).then(function(summary) {
        $rootScope.summary = summary;
    })

    siteVisitService.siteVisits(location).then(function(siteVisits) {
        $rootScope.siteVisits = siteVisits;  
    })

    ureportService.all(location).then(function(ureportQuestions) {
        $rootScope.ureportQuestions = ureportQuestions;  
    })

});
