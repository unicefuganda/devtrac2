angular.module("dashboard").controller("DashboardCtrl", function($rootScope, $routeParams, $location) {
    DT.timings["urlchange"] = new Date().getTime();

    if ($rootScope.project == undefined) {
        $rootScope.project = {};
        $rootScope.project.list = null;
    }

    $rootScope.project.selected = null;
    $rootScope.siteVisit = null;

    $rootScope.location = new DT.Location($routeParams);
    if ($rootScope.filter == undefined)
        $rootScope.filter = new DT.Filter({health_center: false, water_point: false, school: true, site_visit_point: true, project:{} } );


}).controller("IndicatorsCtrl", function($scope, $rootScope, heatmapService) {
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
    $rootScope.ureportQuestion = { selected: null }
    ureportService.questions().then(function(data) {
        $scope.questions = data;
    });
}).controller("UReportResponsesCtrl", function($rootScope, $scope, ureportService){

    var showUReportResults = function (location, ureportQuestion) {
        if (ureportQuestion == null || ureportQuestion.selected == null) {
            $scope.ureportTop5 = []
        } else {
            ureportService.top5(location, ureportQuestion.selected).then(function (data) {
                $scope.ureportTop5 = data
            });

            ureportService.results(location, ureportQuestion.selected).then(function (data) {
                $scope.ureportResults = data
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

}).controller("PartnersCtrl", function($rootScope, $scope, projectService){
    $scope.organisation = "accountable-agency";
    $scope.partners = projectService.partners();
    $scope.financialOrgs = projectService.financialOrgs();
    $scope.sectors = projectService.sectors();
    $scope.statuses = projectService.statuses();
    $scope.implementingPartners = projectService.implementingPartners();
    $scope.years = projectService.years();

    var isFilterSelected = function(filterLable){
        if($scope.filter.project[filterLable]){
            if( ($scope.filter.project[filterLable]).length > 0 )
                return true;
        }
        return false;
    }

    var updateProjectFilters = function() {
        if ($scope.filter == null)
            return;

        projectService.syncProjectFilters($scope.location, $scope.filter.project).then(function(data){
            
            if( !isFilterSelected('partners') ) $scope.partners = data.partners;
            if( !isFilterSelected('financialOrgs') ) $scope.financialOrgs = data.financialOrgs;
            if( !isFilterSelected('sectors') ) $scope.sectors = data.sectors;
            if( !isFilterSelected('statuses') )  $scope.statuses = data.statuses;
            if( !isFilterSelected('implementingPartners') ) $scope.implementingPartners = data.implementingPartners;
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

    var pageList = function(currentPage) {
        var listChucks = DT.splitIntoChuncks($scope.siteVisits, 5);
        $scope.pagedList = listChucks[$scope.currentPage - 1];
        $scope.startCount = ((currentPage - 1) * 5) + 1;
        $scope.endCount = ((currentPage - 1) * 5) + $scope.pagedList.length;
    };

    $scope.maxSize = 5;
    $scope.currentPage = 1;

    $scope.$watch('currentPage', function() {
        if ($scope.siteVisits == null)
            return;

        pageList($scope.currentPage);
    })

    $scope.$watch('siteVisits', function(newValues, oldValues){
        if ($scope.siteVisits == null)
            return;

        $scope.totalItems = $scope.siteVisits.length;
        $scope.currentPage = 1;

        pageList($scope.currentPage);
    });

    var updateSiteVisitList = function() {
        if ($scope.location == null)
            return;

        siteVisitService.siteVisits($scope.location).then(function(data){
            $scope.siteVisits = data;
        });
    }

    $scope.$watch("location", updateSiteVisitList, true);
});
