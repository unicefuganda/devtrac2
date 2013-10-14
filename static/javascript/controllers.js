angular.module("dashboard").controller("DashboardCtrl", function($rootScope, $routeParams) {
    DT.timings["urlchange"] = new Date().getTime();
    $rootScope.location = new DT.Location($routeParams);
    if ($rootScope.filter == undefined)
        $rootScope.filter = new DT.Filter({health_center: true, water_point: true, school: true});

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
        if ($rootScope.ureportQuestion.selected == null) {
            $scope.ureportTop5 = []
        } else {
            ureportService.top5(location, ureportQuestion.question_id).then(function (data) {
                $scope.ureportTop5 = data
            });
        }
    }


    $rootScope.$watch("location", function(newLocation, oldLocation) {
        if (newLocation == null)
            return;

        showSummary($rootScope.location);
        showUReportResults($rootScope.location, $rootScope.ureportQuestion.selected);
    });

   

    $rootScope.$watch("ureportQuestion", function() {
        showUReportResults($rootScope.location, $rootScope.ureportQuestion.selected);
    }, true);

}).controller("UReportCtrl", function($scope, $rootScope, ureportService) {
    $rootScope.ureportQuestion = { selected: null } 
    ureportService.questions().then(function(data) {
        $scope.questions = data;
    });
});