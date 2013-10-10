angular.module("dashboard").controller("DashboardCtrl", function($rootScope, $routeParams) {
    DT.timings["urlchange"] = new Date().getTime();
    $rootScope.location = new DT.Location($routeParams);
    if ($rootScope.filter == undefined)
        $rootScope.filter = new DT.Filter({health_center: true, water_point: true, school: true});

}).controller("IndicatorsCtrl", function($scope, $rootScope, heatmapService) {
    $rootScope.indicator = { selected: null } 
    $scope.indicators = heatmapService.all();
}).controller("SummaryCtrl", function($scope, $rootScope, summaryService, indicatorService) {

    $rootScope.$watch("location", function(newLocation, oldLocation) {
        if (newLocation == null)
            return;
        summaryService.find(newLocation.getName()).then(function(summary) {

            var summaryLabels = [];
            $.each(DT.AgregationConfig.labels, function(index, label) {

                if (summary.info[label.key] != null)
                    summaryLabels.push([label.label, label.formatter(summary.info[label.key]) ])
            });

            $scope.summary = summaryLabels;
        });

        indicatorService.find(newLocation).then(function(indicatorSummary) {
            $scope.indicatorSummary = indicatorSummary;
        });
    });
});