angular.module("dashboard")
    .service("ureportService", function(jsonService, $filter) {
        this.questions = function() {
            return jsonService.get("/ureport/questions");
        }

        this.top5 = function(location, question) {
            var url = "/ureport/questions/" + question.id + "/top5/" + location.getName(true).toUpperCase();
            return jsonService.get(url);
        }

        this.results = function(location, question) {
            var url = "/ureport/questions/" + question.id + "/results/" + location.getName(true).toUpperCase();
            return jsonService.get(url);
        }
    });