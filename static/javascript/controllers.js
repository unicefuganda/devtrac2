angular.module("dashboard").controller("DashboardCtrl", function($rootScope, $routeParams) {
    DT.timings["urlchange"] = new Date().getTime();
    $rootScope.location = new DT.Location($routeParams);
    if ($rootScope.filter == undefined)
        $rootScope.filter = new DT.Filter({health_center: true, water_point: true, school: true});
});