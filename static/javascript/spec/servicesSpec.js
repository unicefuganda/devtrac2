mockGeoJson = function(testData) {
    return { 
        get: function (options) {
            return { then: function(func) { return func(testData); } };
        }
    };
};

describe("Geonode Service", function() {

    var mock = { jsonp: function() {}};
    beforeEach(function() {

        module('dashboard', function($provide) {
            spyOn(mock, 'jsonp')
            $provide.value('$http', mock);
        });
    });

    it('should make geonode for dataset', inject(function($rootScope, geonodeService){
        var promise = geonodeService.get("test")
        DT.JSONPCallbacks["test"]("test_data")
        var finished = false;
        
        promise.then(function(data) {
            expect(data).toEqual("test_data");
            url = mock.jsonp.mostRecentCall.args[0]
            expect(url).toMatch("&typeName=geonode:test")
            finished = true;                
        });

        waitsFor(function() {
            $rootScope.$apply();
            return finished;
        });
    }));

    it('should make apply filter for dataset', inject(function($rootScope, geonodeService){
        var promise = geonodeService.get("test", {"key": "something"})
        DT.JSONPCallbacks["test"]("test_data")
        var finished = false;
        
        promise.then(function(data) {
            url = mock.jsonp.mostRecentCall.args[0]
            expect(url).toMatch("&filter=<Filter xmlns=\"http://www.opengis.net/ogc\"><PropertyIsEqualTo><PropertyName>key</PropertyName><Literal>something</Literal></PropertyIsEqualTo></Filter")
            finished = true;                
        });

        waitsFor(function() {
            $rootScope.$apply();
            return finished;
        });
    }));

    it('should make select propernames for dataset', inject(function($rootScope, geonodeService){
        var promise = geonodeService.get("test", null, ["test1", "test2"])
        DT.JSONPCallbacks["test"]("test_data")
        var finished = false;
        
        promise.then(function(data) {
            url = mock.jsonp.mostRecentCall.args[0]
            expect(url).toMatch("&propertyName=test1,test2")
            finished = true;                
        });

        waitsFor(function() {
            $rootScope.$apply();
            return finished;
        });
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
        indicatorService.find(new DT.Location({})).then(function(data){
            expect(data).toEqual(testData[0].properties)
        });
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
    var testResponses = [{id: 1, text: "some text"}, {id: 2, text: "some text"}]
    var mock = mockGeoJson(testResponses);

    beforeEach(function(){

        module('dashboard', function($provide) {
            spyOn(mock, 'get').andCallThrough();
            $provide.value('jsonService', mock);
        });
    });

    it ('should get ureport questions', inject(function(ureportService) {
        ureportService.top5(new DT.Location({region: 'north'}), {id: 100}).then(function(data){

            expect(data).toEqual(testResponses);
            expect(mock.get).toHaveBeenCalledWith('/ureport/questions/100/top5/UGANDA, NORTH');
        });
    }));
})

describe("Ureport Service question results", function(){
    var testResponses = {results: [{percent:20}, {percent:30}, {percent:50}]};
    var mock = mockGeoJson(testResponses);

    beforeEach(function(){
        module('dashboard',function($provide){
            spyOn(mock,'get').andCallThrough();
            $provide.value('jsonService',mock);
        });

    });

    it('should fetch and reorder Ureport questions', inject(function(ureportService){
        ureportService.results(new DT.Location({region: 'north'}), {id: 100}).then(function(data){
            expect(data).toEqual(testResponses);
            expect(mock.get).toHaveBeenCalledWith('/ureport/questions/100/results/UGANDA, NORTH');
        });
        
    }));
});

