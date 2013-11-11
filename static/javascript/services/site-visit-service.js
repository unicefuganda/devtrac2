angular.module("dashboard")
    .service("siteVisitService", function(jsonService) {
        this.siteVisits = function (location) {
            var locationFilter = function (location) {
                return function (rows) {
                    return $.grep(rows, function(feature, index) {
                        return location.contains(DT.Location.fromFeatureProperties(feature));
                    });
                }
            };
            return jsonService.get('/site_visits').then(locationFilter(location)).then(function(siteVisitsJson) {
                return siteVisitsJson.map(function(siteVisitJson) { return new DT.SiteVisit(siteVisitJson);  })
                
            });
        };
    });