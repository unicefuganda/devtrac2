angular.module("dashboard").controller("DashboardCtrl", function($rootScope, $routeParams, $location) {
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

    var showUReportResults = function (location, ureportQuestion) {
        

        if (ureportQuestion == null || ureportQuestion.selected == null) {
            $scope.ureportTop5 = []
        } else {
            ureportService.top5(location, ureportQuestion.selected).then(function (data) {
                $scope.ureportTop5 = data
            });
        }
    }

    $rootScope.$watch("location", function(newLocation, oldLocation) {
        if (newLocation == null)
            return;

        showSummary($rootScope.location);
        showUReportResults($rootScope.location, $rootScope.ureportQuestion);
    });
   

    $rootScope.$watch("ureportQuestion", function(newQuestion) {
        showUReportResults($rootScope.location, $rootScope.ureportQuestion);
    }, true);

}).controller("UReportCtrl", function($scope, $rootScope, ureportService) {
    $rootScope.ureportQuestion = { selected: null } 
    ureportService.questions().then(function(data) {
        $scope.questions = data;
    });
});