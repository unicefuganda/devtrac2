describe("Services", function() {
    // var mock, indicatorService, districtsGeoJson;

    // beforeEach(function() {
    //     mock = {
    //         districts: function() {
    //             return { then: function(func) { func(districtsGeoJson); } };
    //         }
    //     };

    //     module('dashboard', function($provide) {
    //         $provide.value('districtService', mock);
    //     });

    //     districtsGeoJson = {
    //         features: [{
    //             type: "Polygon",
    //             properties: {
    //                 "Reg_2011": "NORTH",
    //                 "DNAME_2010": "GULU",
    //                 "Measles_Perc": "1.05"
    //             }
    //         }, {
    //             type: "Polygon",
    //             properties: {
    //                 "Reg_2011": "SOUTH",
    //                 "DNAME_2010": "KAMPALA",
    //                 "Measles_Perc": "2.07"
    //             }
    //         }]
    //     }
    // });

    // it('should give indicator for district', inject(function(indicatorService) {
    //     var guluLocation = new DT.Location({
    //         region: "north",
    //         district: "gulu"
    //     });

    //     // expect(indicatorService.find(guluLocation)).toEqual({
    //     //     "Measles_Perc": "1.05"
    //     // });
    // }));

});

describe("Geojson Service", function() {

    var mock;
    var testData = {features: ["A", "B", "A", "C"]}
    beforeEach(function() {
        mock = function(options) {
            return { success: function(func) { func(testData); } };
        };

        module('dashboard', function($provide) {
            $provide.value('$http', mock);
        });
    });


    it('should get geoJson and applyFilter', inject(function($rootScope, geoJsonService){
        var getFinished = false;
        geoJsonService.get("test_url", function(feature) { return feature == "A"; }).then(function(data) {
            expect(data).toEqual(['A', 'A']);
            getFinished = true;
        });
        
        waitsFor(function() {
            $rootScope.$apply();
            return getFinished;
        })
    }));

});