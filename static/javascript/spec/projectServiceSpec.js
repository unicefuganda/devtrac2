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
            'END_PLANNE': '25/07/2012',
            'FINANCIAL': 'DFID',
            'PROJ_ID': 'UNICEF-1'
        }},
        {properties: {
            PARTNER: 'Unicef', 'Reg_2011': 'test region', 'DNAME_2010': 'test district', 'SNAME_2010': 'test subcounty', 'ID': 2,
            'SECTOR': 'Agriculture',
            'STATUS': 'Completion',
            'PROJ_NAME': 'B',
            'IMPLEMENTE': 'Africare',
            'START_PLAN': '25/07/2008',
            'END_PLANNE': '25/07/2012',
            'FINANCIAL': 'Japan',
            'PROJ_ID': 'UNICEF-1'

        }},
        {properties: {
            PARTNER: 'USAID', 'Reg_2011': 'test region', 'DNAME_2010': 'test district 2', 'ID': 3 ,
            'SECTOR': 'Education',
            'STATUS': 'Post-completion',
            'PROJ_NAME': 'C',
            'IMPLEMENTE': 'Arbeiter Samariter Bund',
            'START_PLAN': '25/07/2013',
            'END_PLANNE': '25/07/2013',
            'FINANCIAL': 'DFID',
            'PROJ_ID': 'USAID-1'

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
        return $.map(data.geojson.features, function(feature) { return feature.properties.ID; } );
    }

    it('should get list of partners from project', inject(function(projectService) {
        var partners = projectService.partners();
        expect(partners).toEqual([{id: 'Unicef', name: 'Unicef'}, {id: 'USAID', name: 'USAID'}])
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

    it('should filter projects by partner', inject(function(projectService) {
        var location = new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location, { partners: ['Unicef', 'USAID']});
        expect(mapProjectId(projects)).toEqual([1, 2, 3])

        var projects = projectService.projects_geojson(location, { partners: ['Unicef']});
        expect(mapProjectId(projects)).toEqual([1, 2]);

        var projects = projectService.projects_geojson(location, { partners: [] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);
    }));

    it('should filter projects by sector', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ sectors: ['Education'] });

        expect(mapProjectId(projects)).toEqual([1,3]);

        var projects = projectService.projects_geojson(location,{ sectors: [] });

        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by status', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ statuses: ['Completion'] });

        expect(mapProjectId(projects)).toEqual([1,2]);

        var projects = projectService.projects_geojson(location,{ statuses: ['Completion', 'Post-completion'] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        var projects = projectService.projects_geojson(location,{ statuses: null });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by funding partner', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ financialOrgs: ['DFID'] });

        expect(mapProjectId(projects)).toEqual([1,3]);

        var projects = projectService.projects_geojson(location,{ financialOrgs: ['DFID', 'Japan'] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        var projects = projectService.projects_geojson(location,{ financialOrgs: null });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by implementing partner', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ implementingPartners: ['Africare'] });

        expect(mapProjectId(projects)).toEqual([1,2]);

        var projects = projectService.projects_geojson(location,{ implementingPartners: ['Africare', 'Arbeiter Samariter Bund'] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        var projects = projectService.projects_geojson(location,{ implementingPartners:  null });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by Year', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects = projectService.projects_geojson(location,{ years: ['2010'] });

        expect(mapProjectId(projects)).toEqual([1, 2]);

        var projects = projectService.projects_geojson(location,{ years: ['2009'] });
        expect(mapProjectId(projects)).toEqual([2]);

        var projects = projectService.projects_geojson(location,{ years: ['2012', '2013'] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        var projects = projectService.projects_geojson(location,{ years: ['2013'] });
        expect(mapProjectId(projects)).toEqual([3]);

        var projects = projectService.projects_geojson(location,{ years: [] });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);
    }));

    // it('map locations into projects', inject(function(projectService) {
    //     var filter = { partner: { unicef: true, usaid: true}};
    //     var projects = projectService.projects(new DT.Location({region: 'test region'}), filter);

    //     expect(projects.length).toEqual(2)

    //     expect(projects[0].id).toEqual('UNICEF-1');
    //     expect(projects[0].locations[0].location).toEqual(new DT.Location({'DNAME_2010': 'test district', 'Reg_2011': 'test region'}))
    //     expect(projects[0].locations[1].location).toEqual(new DT.Location({'DNAME_2010': 'test district', 'Reg_2011': 'test region', 'SNAME_2010': 'test subcounty'}))

    //     expect(projects[1].id).toEqual('USAID-2');
    //     expect(projects[1].locations[0].location).toEqual(new DT.Location({'DNAME_2010': 'test district 2', 'Reg_2011': 'test region'}))
    // }));


    it('should list partners selected in filter', inject(function(projectService) { 
        var location = new DT.Location({region: 'test region'});

        var filter = { partners: [], financialOrgs: [] }
        expect(projectService.projects_geojson(location, filter).legendPartners).toEqual({ partners: [], type: 'PARTNER'});

        var filter = { partners: ["Unicef", "USAID"], financialOrgs: [] }
        expect(projectService.projects_geojson(location, filter).legendPartners).toEqual({ partners: ["Unicef", "USAID"], type: 'PARTNER'});

        var filter = { partners: [], financialOrgs: ["DFID", "Japan"] }
        
        expect(projectService.projects_geojson(location, filter).legendPartners).toEqual({partners: ["DFID", "Japan"], type: 'FINANCIAL'});
    }));

});
