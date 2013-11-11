mockThen = function (testData) {
    return { 
        then: function(func) { 
            var result = func(testData); 
            return mockThen(result);
        }
    };
}

mockGeoJson = function(testData) {
    return {
        get: function (options) {
            return mockThen(testData);
        }
    };
};

describe("Site Visit Service", function () {
    var testResponses = [
        {
            'Reg_2011': 'test region', 
            'DNAME_2010': 'test district', 
            'Title': 'title 1'
        },
        {
            'Reg_2011': 'test region', 
            'DNAME_2010': 'test district', 
            'Title': 'title 2'
        },
        {
            'Reg_2011': 'test region', 
            'DNAME_2010': 'test district 2', 
            'Title': 'title 3'
        }
    ];

    var mock = mockGeoJson(testResponses);

    beforeEach(function($q){
        module('dashboard',function($provide){
            spyOn(mock,'get').andCallThrough();
            $provide.value('jsonService',mock);
        });
    });



    it('should get list site visit from json service', inject(function(siteVisitService) {
        var siteVisits;

        var location = new DT.Location({region: 'test region', district: 'test district'});
        siteVisitService.siteVisits(location).then(function(data) {
            siteVisits = data;
        });
        expect(siteVisits.map(function(siteVisit) { return siteVisit.title })).toEqual(['title 1', 'title 2']);

        var location = new DT.Location({region: 'test region'});
        siteVisitService.siteVisits(location).then(function(data) {
            siteVisits = data;
        });
        expect(siteVisits.map(function(siteVisit) { return siteVisit.title })).toEqual(['title 1', 'title 2', 'title 3']);

        var location = new DT.Location({region: 'test region', district: 'test district 3'});
        siteVisitService.siteVisits(location).then(function(data) {
            siteVisits = data;
        });
        expect(siteVisits.map(function(siteVisit) { return siteVisit.id })).toEqual([]);
    }));
});