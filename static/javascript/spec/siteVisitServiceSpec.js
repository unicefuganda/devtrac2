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
            'Title': 'title 1',
            'Latitude': 1,
            'Longitude': 2
        },
        {
            'Reg_2011': 'test region', 
            'DNAME_2010': 'test district', 
            'Title': 'title 2',
            'Latitude': 2,
            'Longitude': 4
        },
        {
            'Reg_2011': 'test region', 
            'DNAME_2010': 'test district 2', 
            'Title': 'title 3',
            'Latitude': 5,
            'Longitude': 6
        }
    ];

    var mock = mockGeoJson(testResponses);

    beforeEach(function($q){
        module('dashboard',function($provide){
            spyOn(mock,'get').andCallThrough();
            $provide.value('jsonService',mock);
        });
    });


    it('should page list of site visits', inject(function(siteVisitService) {
        var siteVisits;

        var location = new DT.Location({});
        siteVisitService.siteVisits(location, 1, 2).then(function(data) {
            siteVisits = data;
        });
        expect(siteVisits.list.map(function(siteVisit) { return siteVisit.title; })).toEqual(['title 2', 'title 3']);

    }));

    it('should give detail of site visit', inject(function(siteVisitService) {
        var siteVisits;

        var location = new DT.Location({});
        siteVisitService.siteVisitDetail('title 2').then(function(data) {
            siteVisit = data;
        });
        expect(siteVisit.title).toEqual(siteVisit.title);        
    }));

    it('should convert site visits into geojson', inject(function(siteVisitService) {
        var siteVisits;

        var location = new DT.Location({});
        siteVisitService.site_visits_geojson(location).then(function(data) {
            siteVisitGeoJson = data;
        });

        expect(siteVisitGeoJson.features[0]).toEqual({ 
            type : 'Feature', 
            properties : { Reg_2011 : 'test region', DNAME_2010 : 'test district', Title : 'title 1', Latitude : 1, Longitude : 2 }, 
            geometry : { type : 'Point', coordinates : [ 2, 1 ] }, 
            geometry_name : 'the_geom' });        
    }));

    it('should get list site visit from json service', inject(function(siteVisitService) {
        var siteVisits;

        var location = new DT.Location({region: 'test region', district: 'test district'});
        siteVisitService.siteVisits(location, 0, 10).then(function(data) {
            siteVisits = data;
        });
        expect(siteVisits.list.map(function(siteVisit) { return siteVisit.title })).toEqual(['title 1', 'title 2']);

        var location = new DT.Location({region: 'test region'});
        siteVisitService.siteVisits(location, 0, 10).then(function(data) {
            siteVisits = data;
        });
        expect(siteVisits.list.map(function(siteVisit) { return siteVisit.title })).toEqual(['title 1', 'title 2', 'title 3']);

        var location = new DT.Location({region: 'test region', district: 'test district 3'});
        siteVisitService.siteVisits(location, 0, 10).then(function(data) {
            siteVisits = data;
        });
        expect(siteVisits.list.map(function(siteVisit) { return siteVisit.id })).toEqual([]);
    }));
});