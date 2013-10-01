var q = require('q')
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
if (typeof(test) == 'undefined' || !test)
    test = false;
else
    console.log("TESTING MODE");
var mongodb_url = test ? 'mongodb://127.0.0.1:27017/devtrac2_test' : 'mongodb://127.0.0.1:27017/devtrac2'


function importWFS(dataset) {
    var deffered = q.defer();

    if (test) {
        var url = "http://localhost:8080/" + dataset + ".json"
    } else {
        var url = "http://ec2-54-218-182-219.us-west-2.compute.amazonaws.com/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:" + dataset + "&outputFormat=json";
    }

    http = require('http');
    http.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

         res.on('end', function() {
            result = JSON.parse(body);
            deffered.resolve(result);
        });
    })
    return deffered.promise;
}

var districtMapReduce = {
    map: function() {
            if (this.id.match(/uganda_health_centers_replotted/))
            {
                emit(this.properties["DNAME_2010"], { health_center: 1, school: 0});

            } else if (this.id.match(/uganda_schools_with_regions/))
            {
                emit(this.properties["DNAME_2010"], { health_center: 0, school: 1});
            }
        },
    reduce: function(key, values) {
            var total = { 
                health_center: 0,
                school: 0
            };

            values.forEach(function(v) {
                total.health_center += v.health_center;
                total.school += v.school;
            });
            return total; 
        },
    out: { out: "district_totals" }
}

function aggregate_by_district(data) {
    var featuresMap = data.map(function(element) { return element.features });
    var features = [];
    features = features.concat.apply(features, featuresMap);

    MongoClient.connect(mongodb_url, function(err, db) {
        var collection = db.collection('points');
        collection.remove({}, function() {
            features.forEach(function(element, index) {
                collection.insert(element, {safe: false});
            })
            collection.mapReduce(districtMapReduce.map, districtMapReduce.reduce, districtMapReduce.out, function(){ 
                db.close() 
            });
        });
    });
}

exports.importData = function(dataSets) { 
    var deffered = q.defer();

    if (dataSets == undefined) {
        var dataSets = [
            "uganda_health_centers_replotted",
            "uganda_schools_with_regions"
        ];
    }
    var promises = dataSets.map(importWFS);
    q.all(promises).then(function(data) { aggregate_by_district(data); deffered.resolve(); }) 
    return deffered.promise
};




  