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
            }).then(function(siteVisits){
                return siteVisits.sort(function (siteVisit1, siteVisit2) {
                    if (siteVisit1.title > siteVisit2.title)
                      return 1;
                    if (siteVisit1.title < siteVisit2.title)
                      return -1;
                    return 0;
                });
            });
        };


        this.site_visits_geojson = function(location) {
            
        }
    });