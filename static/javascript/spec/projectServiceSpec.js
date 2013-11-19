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
            'PROJECT_ID': 'UNICEF-1'
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
            'PROJECT_ID': 'UNICEF-1'

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
            'PROJECT_ID': 'USAID-1'

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

    // var mockSummaryService = mockSummaryServiceFactory(testSummaryChildrenLocations);

    beforeEach(function($q){
        module('dashboard',function($provide){
            spyOn(mock,'get').andCallThrough();
            $provide.value('geonodeService',mock);
            // spyOn(mockSummaryService,'get').andCallThrough();
            // $provide.value('summaryService',mockSummaryService);
        });



    });
    function mapProjectId(data) {
        return $.map(data.geojson.features, function(feature) { return feature.properties.ID; } );
    }

    it('should get list of partners from project', inject(function(projectService) {
        var partners;
        projectService.partners().then(function(data) {
            partners = data;
        });
        expect(partners).toEqual(['USAID', 'Unicef'])
    }));

    it('should filter projects by location', inject(function(projectService) {
        var filter = { partner: { unicef: true, usaid: true}};
        var projects;
        projectService.projects_geojson(new DT.Location({region: 'test region', district: 'test district'}), filter).then(function(data) {
            projects = data;
        });

        expect(mapProjectId(projects)).toEqual([1, 2])

        projectService.projects_geojson(new DT.Location({region: 'test region', district: 'test district 2'}), filter).then(function(data) {
            projects = data;
        });
        
        expect(mapProjectId(projects)).toEqual([3]);

        projectService.projects_geojson(new DT.Location({region: 'test region', district: 'test district 3'}), filter).then(function(data) {
            projects = data;
        });

        expect(mapProjectId(projects)).toEqual([])
    }));

    it('should filter projects by partner', inject(function(projectService) {
        var location = new DT.Location({region: 'test region'});
        var projects;

        projectService.projects_geojson(location, { partners: ['Unicef', 'USAID']}).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3])

         projectService.projects_geojson(location, { partners: ['Unicef']}).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2]);

        projectService.projects_geojson(location, { partners: [] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);
    }));

    it('should filter projects by sector', inject(function(projectService){
        var location = new DT.Location({region: 'test region'});
        var projects;
        projectService.projects_geojson(location,{ sector: {'Education': true} }).then(function(data) {
            projects = data;
        });

        expect(mapProjectId(projects)).toEqual([1,3]);

        projectService.projects_geojson(location,{ sectors: [] }).then(function(data) {
            projects = data;
        });

        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by status', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects;
        projectService.projects_geojson(location,{ status: {'Completion': true} }).then(function(data) {
            projects = data;
        });

        expect(mapProjectId(projects)).toEqual([1,2]);

        projectService.projects_geojson(location,{ status: {'Completion': true, 'Post-completion':true } }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        projectService.projects_geojson(location,{ statuses: null }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by funding partner', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects;

        projectService.projects_geojson(location,{ financialOrgs: ['DFID'] }).then(function(data) {
            projects = data;
        });

        expect(mapProjectId(projects)).toEqual([1,3]);

        projectService.projects_geojson(location,{ financialOrgs: ['DFID', 'Japan'] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        projectService.projects_geojson(location,{ financialOrgs: null }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by implementing partner', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects;
        projectService.projects_geojson(location, { implementingPartners: ['Africare'] }).then(function(data) {
            projects = data;
        });

        expect(mapProjectId(projects)).toEqual([1,2]);

        projectService.projects_geojson(location, { implementingPartners: ['Africare', 'Arbeiter Samariter Bund'] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        projectService.projects_geojson(location, { implementingPartners:  null }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

    }));

    it('should filter projects by Year', inject(function(projectService){
        var location =new DT.Location({region: 'test region'});
        var projects;

        projectService.projects_geojson(location,{ years: ['2010'] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2]);

        projectService.projects_geojson(location,{ years: ['2009'] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([2]);

        projectService.projects_geojson(location,{ years: ['2012', '2013'] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);

        projectService.projects_geojson(location,{ years: ['2013'] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([3]);

        projectService.projects_geojson(location,{ years: [] }).then(function(data) {
            projects = data;
        });
        expect(mapProjectId(projects)).toEqual([1, 2, 3]);
    }));

    it('map locations into projects', inject(function(projectService) {
        var filter = { partner: { unicef: true, usaid: true}};
        var projects;

        projectService.projects(new DT.Location({region: 'test region'}), filter).then(function(data) {
            projects = data;
        });

        expect(projects.length).toEqual(2)

        expect(projects[0].id).toEqual('UNICEF-1');
        expect(projects[0].locations[0]).toEqual(new DT.Location({'district': 'test district', 'region': 'test region'}))
        expect(projects[0].locations[1]).toEqual(new DT.Location({'district': 'test district', 'region': 'test region', 'subcounty': 'test subcounty'}))

        expect(projects[1].id).toEqual('USAID-1');
        expect(projects[1].locations[0]).toEqual(new DT.Location({'district': 'test district 2', 'region': 'test region'}))
    }));


    it('should list partners selected in filter', inject(function(projectService) { 
        var location = new DT.Location({region: 'test region'});

        var filter = { partners: [], financialOrgs: [], organisation:"FUNDING" }
        var legendPartners;
        projectService.projects_geojson(location, filter).then(function(data) {
            legendPartners = data.legendPartners;
        });

        expect(legendPartners).toEqual({ partners: DT.defaultFundingPartners, type: 'PARTNER'})

        var filter = { partners: ["Unicef", "USAID"], financialOrgs: [], organisation:"FUNDING"}
        projectService.projects_geojson(location, filter).then(function(data) {
            legendPartners = data.legendPartners;
        });

        expect(legendPartners).toEqual({ partners: ["Unicef", "USAID"], type: 'PARTNER'});

        var filter = { partners: [], financialOrgs: ["DFID", "Japan"], organisation:"FINANCIAL" }
        
        projectService.projects_geojson(location, filter).then(function(data) {
            legendPartners = data.legendPartners
        });

        expect(legendPartners).toEqual({partners: ["DFID", "Japan"], type: 'FINANCIAL'});
    }));

});
