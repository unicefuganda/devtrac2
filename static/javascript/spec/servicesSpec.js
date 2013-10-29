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
        var results = ureportService.results(new DT.Location({region: 'north'}), {id: 100});
        expect(results).toEqual(testResponses);
        expect(mock.get).toHaveBeenCalledWith('/ureport/questions/100/results/UGANDA, NORTH');
    }));
});

describe("Project Service", function () {
    var testResponses = {features: [
        {properties: {PARTNER: 'Unicef', 'Reg_2011': 'test region', 'DNAME_2010': 'test district', 'ID': 1,'SECTOR': 'Education','STATUS': 'Completion'}}, 
        {properties: {PARTNER: 'Unicef', 'Reg_2011': 'test region', 'DNAME_2010': 'test district', 'SNAME_2010': 'test subcounty', 'ID': 2,'SECTOR': 'Agriculture','STATUS': 'Completion'}}, 
        {properties: {PARTNER: 'USAID', 'Reg_2011': 'test region', 'DNAME_2010': 'test district 2', 'ID': 3 ,'SECTOR': 'Education','STATUS': 'Post-completion'}}] }

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
        var projects = projectService.projects_geojson(location, { partner: { unicef: true, usaid: false}});
        expect(mapProjectId(projects)).toEqual([1, 2])

        var projects = projectService.projects_geojson(location, { partner: { unicef: false, usaid: false}});
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