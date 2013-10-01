test = true;
var wfs_service = require("../wfs-services.js", {test: true});
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var mongodb_url = 'mongodb://127.0.0.1:27017/devtrac2_test';


describe("Import", function() {

    it("should load and aggregate data", function(done) {
        wfs_service.importData(["test"]).then(function(data) {
            MongoClient.connect(mongodb_url, function(err, db) { 
                var aggregates = db.collection("district_totals").find().toArray(function(err, results) {
                    
                    expect(results[0]._id).toBe("district 1");
                    expect(results[0].value.health_center).toBe(2);
                    expect(results[0].value.school).toBe(1);

                    expect(results[1]._id).toBe("district 2");
                    expect(results[1].value.health_center).toBe(0);
                    expect(results[1].value.school).toBe(1);

                    db.close();
                    done();
                });
            });
        })
    });
});