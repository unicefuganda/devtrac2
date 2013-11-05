mockGeoJson = function(testData) {
    return { 
        get: function (options) {
            return { then: function(func) { return func(testData); } };
        }
    };
};

describe("Project Service", function () {
    var testResponses = {features: [
        {properties: {
            PARTNER: 'Unicef', 'Reg_2011': 'test region', 'DNAME_2010': 'test district', 'ID': 1,
            'SECTOR': 'Education',
            'STATUS': 'Completion', 
            'IMPLEMENTE': 'Africare',
            'PROJ_NAME': 'A',
            'START_PLAN': '25/07/2010',
            'END_PLANNE': '25/07/2012'
        }}, 
        {properties: {
            PARTNER: 'Unicef', 'Reg_2011': 'test region', 'DNAME_2010': 'test district', 'SNAME_2010': 'test subcounty', 'ID': 2,
            'SECTOR': 'Agriculture',
            'STATUS': 'Completion', 
            'PROJ_NAME': 'B',
            'IMPLEMENTE': 'Africare',
            'START_PLAN': '25/07/2008',
            'END_PLANNE': '25/07/2012'
        }}, 
        {properties: {
            PARTNER: 'USAID', 'Reg_2011': 'test region', 'DNAME_2010': 'test district 2', 'ID': 3 ,
            'SECTOR': 'Education',
            'STATUS': 'Post-completion', 
            'PROJ_NAME': 'C',
            'IMPLEMENTE': 'Arbeiter Samariter Bund',
            'START_PLAN': '25/07/2013',
            'END_PLANNE': '25/07/2013'
        }}] }

    var testSummaryChildrenLocations = [
        new DT.Location({region: 'test region', district: 'test district'}),
        new DT.Location({region: 'test region', district: 'test district 2'}), 
        new DT.Location({region: 'test region', district: 'test district 3'})
    ];

    var mock = mockGeoJson(testResponses);

    var mockSummaryServiceFactory = function(testData) {
        return { 
            childLocations: function (options) {
                return { then: function(func) { return func(testData); } };
            }
        };
    };

    var mockSummaryService = mockSummaryServiceFactory(testSummaryChildrenLocations);

    beforeEach(function(){
        module('dashboard',function($provide){
            spyOn(mock,'get').andCallThrough();
            $provide.value('geonodeService',mock);
            // spyOn(mockSummaryService,'get').andCallThrough();   
            $provide.value('summaryService',mockSummaryService);
        });

    });
    function mapProjectId(data) {
        return $.map(data.features, function(feature) { return feature.properties.ID; } );
    }

    it('should get list of partners from project', inject(function(projectService) {
        var partners = projectService.partners();
        expect(partners).toEqual([{id: 'unicef', name: 'Unicef'}, {id: 'usaid', name: 'USAID'}])
    }));

    it('should filter projects by location', inject(function(projectService) {
        var filter = { partner: { unicef: true, usaid: true}};
        var projects = projectService.projects_geojson(new DT.Location({region: 'test region', district: 'test district'}), filter);
        expect(mapProjectId(projects)).toEqual([1, 2])

        var projects = projectService.projects_geojson(new DT.Location({region: 'test region', district: 'test district 2'}), filter);
        expect(mapProjectId(projects)).toEqual([3]);

        var projects = projectService.projects_geojson(new DT.Location({region: 'test region', district: 'test district 3'}), filter);
        expect(mapProjectId(projects)).toEqual([])
    }));

    it('should fitler projects by partner', inject(function(projectService) {
        var location = new DT.Location({region: 'test region', district: 'test district'});
        var projects = projectService.projects_geojson(location, { partners: ['unicef', 'usaid']});
        expect(mapProjectId(projects)).toEqual([1, 2])

        var projects = projectService.projects_geojson(location, partners: []]});
        expect(mapProjectId(projects)).toEqual([]);
    }));

    it('should filter projects by sector', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, sectors: ['Education'] });

        expect(mapProjectId(projects)).toEqual([1,3]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, sectors: [] });

        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by status', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, statuses: ['Completion'] });

        expect(mapProjectId(projects)).toEqual([1,2]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, statuses: ['Completion', 'Post-completion'] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, statuses: null });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by implementing partner', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, implementingPartners: ['Africare'] });

        expect(mapProjectId(projects)).toEqual([1,2]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, implementingPartners: ['Africare', 'Arbeiter Samariter Bund'] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, implementingPartners:  null });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by Year', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, years: ['2010'] });

        expect(mapProjectId(projects)).toEqual([1, 2]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, years: ['2009'] });
        expect(mapProjectId(projects)).toEqual([2]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, years: ['2012', '2013'] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, years: ['2013'] });
        expect(mapProjectId(projects)).toEqual([3]);

        var projects = projectService.projects_geojson(location,{ partner: {unicef: true, usaid: true}, years: [] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);
    }));

    it('should aggregate by partner', inject(function(projectService) {
        var filter = { partner: { unicef: true, usaid: true}};
        var aggregation = projectService.aggregation(new DT.Location({region: 'test region'}), filter);
        expect(aggregation.children).toEqual([{ 
                locator: 'test region, test district',
                info: { unicef: 2, usaid: 0}
            },{
                locator: 'test region, test district 2', 
                info: { unicef: 0, usaid: 1}
            },{
                locator: 'test region, test district 3',
                info: { unicef: 0, usaid: 0}
            }]
        )
    }));

});
