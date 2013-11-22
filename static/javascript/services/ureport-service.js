angular.module("dashboard")
    .service("ureportService", function(jsonService, $q) {

        var self = this;

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

        // this could be a server side service, to avoid the many ajax calls
        
        this.all = function(location) {
            return self.questions().then(function(questions) {

                var promises = questions.map(function(question) {
                    var top5Promise = self.top5(location, question).then(function(top5) {
                        question.top5 = top5;
                    });
                    var resultsPromise = self.results(location, question).then(function(results) {
                        question.results = results;
                    });

                    return [top5Promise, resultsPromise];
                });

                return $q.all(promises).then(function() {
                    return questions;
                });
            })

        } 
    });