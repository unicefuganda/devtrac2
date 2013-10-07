describe("Boundary Service", function() {
    var testGeoJson, kampalaNorthJson, kampalaSouthJson, guluNorthJson;

    beforeEach(function() {
        kampalaNorthJson = {
                type: "Polygon",
                properties: {
                    "Reg_2011": "NORTH",
                    "DNAME_2010": "KAMPALA",
                    "Measles_Perc": "1.05"
                }
            };

        kampalaSouthJson = {
                type: "Polygon",
                properties: {
                    "Reg_2011": "SOUTH",
                    "DNAME_2010": "KAMPALA",
                    "Measles_Perc": "1.05"
                }
            };

        guluNorthJson = {
                type: "Polygon",
                properties: {
                    "Reg_2011": "NORTH",
                    "DNAME_2010": "GULU",
                    "Measles_Perc": "1.05"
                }
            };

        testGeoJson = {
            features: [kampalaNorthJson, kampalaSouthJson, guluNorthJson]
        }
        module('dashboard');
    });

    it ('should filter by district region and name', inject(function(boundaryService) {
        var location = new DT.Location({region: "north", district: "kampala"})

        expect(boundaryService.locatorFilter(location)(kampalaNorthJson)).toBeTruthy();
        expect(boundaryService.locatorFilter(location)(kampalaSouthJson)).toBeFalsy();
        expect(boundaryService.locatorFilter(location)(guluNorthJson)).toBeFalsy();

    }));

})

describe("Geojson Service", function() {

    var mock;
    var testData = {features: ["A", "B"]}
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
        geoJsonService.get("test_url").then(function(data) {
            expect(data).toEqual(['A', 'B']);
            getFinished = true;
        });
        
        waitsFor(function() {
            $rootScope.$apply();
            return getFinished;
        })
    }));

});