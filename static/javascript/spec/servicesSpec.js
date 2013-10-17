mockGeoJson = function(testData) {
    return { 
        get: function (options) {
            return { then: function(func) { return func(testData); } };
        }
    };
};

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


    it('should get geoJson and applyFilter', inject(function($rootScope, jsonService){
        var getFinished = false;
        jsonService.get("test_url").then(function(data) {
            expect(data).toEqual({features: ['A', 'B']});
            getFinished = true;
        });
        
        waitsFor(function() {
            $rootScope.$apply();
            return getFinished;
        })
    }));

});

describe("Indicator Service", function() {

    var mock;
    var testData = [ { properties: { "Measles_Perc": 0.2, "other": 0.9 } } ]

    beforeEach(function() {
        mock = {districts: function(locator) {
            return { then: function(func) { return func(testData); } };
        }};

        module('dashboard', function($provide) {
            $provide.value('boundaryService', mock);
        });
    });


    it('should get geoJson and applyFilter', inject(function(indicatorService){
        expect(indicatorService.find("locator")).toEqual([["Children vaccinated against Measles", "20%"]])
    }));

});

describe("Ureport Service questions", function() {

    var mock;
    var testQuestions = [ { id: 1, question: "a question 1", abbreviation: "abbrev 1" }, { id: 1, question: "a question 2", abbreviation: "abbrev 2" } ]

    beforeEach(function(){
        module('dashboard', function($provide) {
            $provide.value('jsonService', mockGeoJson(testQuestions));
        });
    });

    it ('should get ureport questions', inject(function(ureportService) {
        ureportService.questions().then(function(data){
            expect(data).toEqual(testQuestions);
        });
    }));
})


describe("Ureport Service responses", function() {
    var testReponses = [{id: 1, text: "some text"}, {id: 2, text: "some text"}]
    var mock = mockGeoJson(testReponses);

    beforeEach(function(){

        module('dashboard', function($provide) {
            spyOn(mock, 'get').andCallThrough();
            $provide.value('jsonService', mock);
        });
    });

    it ('should get ureport questions', inject(function(ureportService) {
        ureportService.top5(new DT.Location({region: 'north'}), {id: 100}).then(function(data){

            expect(data).toEqual(testReponses);
            expect(mock.get).toHaveBeenCalledWith('/ureport/questions/100/top5/UGANDA, NORTH');
        });
    }));
})