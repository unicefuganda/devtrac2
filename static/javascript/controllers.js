angular.module("dashboard").controller("DashboardCtrl", function($rootScope, $routeParams, $location) {
    console.log("dashboard here");
    DT.timings["urlchange"] = new Date().getTime();

    $rootScope.location = new DT.Location($routeParams);
    if ($rootScope.filter == undefined)
        $rootScope.filter = new DT.Filter({health_center: true, water_point: true, school: true});
    $rootScope.feature_toggles = DT.feature_toggles($location.absUrl());

}).controller("IndicatorsCtrl", function($scope, $rootScope, heatmapService) {
    $rootScope.indicator = { selected: null } 
    $scope.indicators = heatmapService.all();
}).controller("SummaryCtrl", function($scope, $rootScope, summaryService, indicatorService, ureportService) {

    var showSummary = function (location) {
        summaryService.find(location.getName()).then(function(summary) {

            var summaryLabels = [];
            $.each(DT.AgregationConfig.labels, function(index, label) {

                if (summary.info[label.key] != null)
                    summaryLabels.push([label.label, label.formatter(summary.info[label.key]) ])
            });

            $scope.summary = summaryLabels;
        });

        indicatorService.find(location).then(function(indicatorSummary) {
            $scope.indicatorSummary = indicatorSummary;
        });
    };

    $rootScope.$watch("location", function(newLocation, oldLocation) {
        if (newLocation == null)
            return;
        showSummary($rootScope.location);
    });

}).controller("UReportCtrl", function($scope, $rootScope, ureportService) {
    $rootScope.ureportQuestion = { selected: null } 
    ureportService.questions().then(function(data) {
        $scope.questions = data;
    });
}).controller("RightPanelCtrl", function($scope, $timeout) {
    $scope.show_bottom_panel = false;

    $scope.$watch("ureportQuestion", function(newQuestion) {
        if (newQuestion == null)
            return;
        $scope.show_bottom_panel = newQuestion.selected != null;
        // Give time for the map to resize
        $timeout($scope.mapResize, 300);
    }, true)
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

});