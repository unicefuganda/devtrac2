angular.module("dashboard").controller("DashboardCtrl", function($rootScope, $routeParams) {
    DT.timings["urlchange"] = new Date().getTime();
    $rootScope.location = new DT.Location($routeParams);
    if ($rootScope.filter == undefined)
        $rootScope.filter = new DT.Filter({health_center: true, water_point: true, school: true});

}).controller("IndicatorsCtrl", function($scope, $rootScope, indicatorService) {
    $rootScope.indicator = { selected: null } 
    $scope.indicators = indicatorService.all();
}).controller("SummaryCtrl", function($scope, $rootScope, summaryService) {

    $rootScope.$watch("location", function(newLocation, oldLocation) {
        if (newLocation == null)
            return;
        summaryService.find(newLocation.getName()).then(function(summary) {
            $scope.summary = summary;    
        });
    });
});