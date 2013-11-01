describe("Layers", function() { 
    var ugandaLocation = new DT.Location({});
    var regionLocation = new DT.Location({ region: "north"});
    var districtLocation = new DT.Location({ region: "north", district: "gulu" });
    var subcountyLocation = new DT.Location({region: "north", district: "gulu", subcounty: "patiko" });
    var parishLocation = new DT.Location({region: "north", district: "gulu", subcounty: "patiko", parish: "a_parish" });

    it("should show region layer at national level", function() {
        var location1 = new DT.Location({});

        var uganda_location = new DT.Location({});
        var north_location = new DT.Location({ region: "north"});

        expect(DT.Layers.boundaryLayers(location1)).toEqual([
            ["region", uganda_location],
            ["district_outline", uganda_location],
        ]);
    });

    it("should show district layer at region level", function() {
        var uganda_location = new DT.Location({});
        var north_location = new DT.Location({ region: "north"});

        expected_layers = [
            ["region", uganda_location],
            ["district_outline", uganda_location],
            ["district", north_location],
        ];
        assertLayers(DT.Layers.boundaryLayers(north_location), expected_layers);
    });

    it("should show layer subcounties and water-points for district", function() {
        var location1 = new DT.Location({
            region: "north",
            district: "gulu"
        });

        var gulu_location = new DT.Location({ region: "north", district: "gulu" });
        var north_location = new DT.Location({ region: "north" });
        var uganda_location = new DT.Location({});

        expect(DT.Layers.boundaryLayers(location1)).toEqual([
            ["region", uganda_location],
            ["district_outline", uganda_location],
            ["district", north_location],
            ["subcounty", gulu_location],
        ]);
    });

    it("should show layer subcounties, water-points and parishes for subcounty", function() {
        var location1 = new DT.Location({
            region: "north",
            district: "gulu",
            subcounty: "patiko",
            parish: null
        });
        var uganda_location = new DT.Location({});
        var north_location = new DT.Location({region: "north"})
        var gulu_location = new DT.Location({region: "north", district: "gulu" });
        var patiko_location = new DT.Location({region: "north", district: "gulu", subcounty: "patiko" });

        var expected_layers = [
            ["region", uganda_location],
            ["district_outline", uganda_location],
            ["district", north_location],
            ["subcounty", gulu_location],
            ["parish", patiko_location],
        ]
        assertLayers(DT.Layers.boundaryLayers(location1), expected_layers);
    });

    function assertLayers(result, expected) {
        result_pp = $.map(result, function(layer_info) { return layer_info[0] + " - " +layer_info[1].getName() });
        expected_pp = $.map(expected, function(layer_info) { return layer_info[0] + " - " + layer_info[1].getName() });
        expect(result_pp).toEqual(expected_pp);
    }

    function containLayer(result, expected) {
        expected_pp = expected[0] + " - " + expected[1].getName();
        expect(ppLayers(result)).toContain(expected_pp);
    }

    function notContainLayer(result, expected) {
        expected_pp = expected[0] + " - " + expected[1].getName();
        expect(ppLayers(result)).toNotContain(expected_pp);
    }

    function ppLayers(layers) {
        return $.map(layers, function(layer_info) { return layer_info[0] + " - " +layer_info[1].getName() });
    }

    it("should show layer subcounties, water-points and parishes for parish", function() {
        var location1 = new DT.Location({
            region: "north",
            district: "gulu",
            subcounty: "patiko",
            parish: "a_parish"
        });
        var uganda_location = new DT.Location({});
        var north_location = new DT.Location({region: "north"})
        var gulu_location = new DT.Location({ region: "north", district: "gulu" });
        var patiko_location = new DT.Location({ region: "north", district: "gulu", subcounty: "patiko" });

        assertLayers(DT.Layers.boundaryLayers(location1),[
            ["region", uganda_location],
            ["district_outline", uganda_location],
            ["district", north_location],
            ["subcounty", gulu_location],
            ["parish", patiko_location],
        ]);
    });

    it ("should display project points for districts and below", function() {
        containLayer(DT.Layers.filterLayers(districtLocation, []), ["project-point", districtLocation]);
        containLayer(DT.Layers.filterLayers(subcountyLocation, []), ["project-point", subcountyLocation]);
        containLayer(DT.Layers.filterLayers(parishLocation, []), ["project-point", parishLocation]);
        containLayer(DT.Layers.filterLayers(regionLocation, []), ["project-point", regionLocation]);
    });

    it ("should display health aggregation for all layers above parish", function() {
        containLayer(DT.Layers.filterLayers(ugandaLocation, []), ["health-center", ugandaLocation]);
        containLayer(DT.Layers.filterLayers(regionLocation, []), ["health-center", regionLocation]);
        containLayer(DT.Layers.filterLayers(districtLocation, []), ["health-center", districtLocation]);
        containLayer(DT.Layers.filterLayers(subcountyLocation, []), ["health-center", subcountyLocation]);
        notContainLayer(DT.Layers.filterLayers(parishLocation, []), ["health-center", parishLocation]);
    });

    it ("should display water-point aggregation for all layers above parish", function() {
        containLayer(DT.Layers.filterLayers(ugandaLocation, []), ["water-point", ugandaLocation]);
        containLayer(DT.Layers.filterLayers(regionLocation, []), ["water-point", regionLocation]);
        containLayer(DT.Layers.filterLayers(districtLocation, []), ["water-point", districtLocation]);
        containLayer(DT.Layers.filterLayers(subcountyLocation, []), ["water-point", subcountyLocation]);
        notContainLayer(DT.Layers.filterLayers(parishLocation, []), ["water-point", parishLocation]);
    });

    it ("should display school aggregation for all layers above parish", function() {
        containLayer(DT.Layers.filterLayers(ugandaLocation, []), ["school", ugandaLocation]);
        containLayer(DT.Layers.filterLayers(regionLocation, []), ["school", regionLocation]);
        containLayer(DT.Layers.filterLayers(districtLocation, []), ["school", districtLocation]);
        containLayer(DT.Layers.filterLayers(subcountyLocation, []), ["school", subcountyLocation]);
        notContainLayer(DT.Layers.filterLayers(parishLocation, []), ["school", parishLocation]);
    });

    it ("should filer by keys", function () {
        notContainLayer(DT.Layers.filterLayers(ugandaLocation, ["school"]), ["school", ugandaLocation]);
    });

    it("should only remove boundaryLayers if not displyed in new location", function() {
        var changes = DT.Layers.getChanges([["district", districtLocation, "boundary"], ["region", ugandaLocation, "boundary"]], ugandaLocation);

        containLayer(changes.toRemove, ["district", districtLocation]);
        containLayer(changes.toAdd, ["district_outline", ugandaLocation]);
        containLayer(changes.toAdd, ["school", ugandaLocation]);
        notContainLayer(changes.toAdd, ["region", ugandaLocation]);
    });

    it("should always add and remove non-boundary layers", function() {
        var changes = DT.Layers.getChanges([["district", districtLocation, "boundary"], ["school", ugandaLocation, "other"]], ugandaLocation);

        containLayer(changes.toRemove, ["district", districtLocation]);
        containLayer(changes.toRemove, ["school", ugandaLocation]);
        containLayer(changes.toAdd, ["school", ugandaLocation]);
        
    });

    it("should compare layers to see which layers are missing", function() {
        var patikoLocation = new DT.Location({
            region: "north",
            district: "gulu",
            subcounty: "patiko"
        });

        var guluLocation = new DT.Location({
            region: "north",
            district: "gulu"
        });

        expect(DT.Layers.compareLayerKeys([["district", guluLocation]], [["district", patikoLocation]])).toEqual({
            toAdd: [["district", patikoLocation]],
            toRemove: [["district", guluLocation]],
        });

        expect(DT.Layers.compareLayerKeys([["district", guluLocation], ["district", patikoLocation]], [["district", patikoLocation]])).toEqual({
            toAdd: [],
            toRemove: [["district", guluLocation]]
        });

        expect(DT.Layers.compareLayerKeys([["district", patikoLocation]], [["district", patikoLocation], ["district", guluLocation]])).toEqual({
            toAdd: [["district", guluLocation]],
            toRemove: []
        });
    });

});