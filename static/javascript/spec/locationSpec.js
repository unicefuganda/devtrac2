describe("Location", function() {

    it("should have district, subcounty and parish", function() {
        var location = new DT.Location({
            district: "test_district",
            subcounty: "test_subcounty",
            parish: "test_parish"
        });

        expect(location.district).toBe("test_district");
        expect(location.subcounty).toBe("test_subcounty");
        expect(location.parish).toBe("test_parish");
    });

    it("should equal to other location with same properties", function() {
        var location1 = new DT.Location({
            district: "test_district",
            subcounty: "test_subcounty",
            parish: "test_parish"
        });
        var location2 = new DT.Location({
            district: "test_district",
            subcounty: "test_subcounty",
            parish: "test_parish"
        });

        expect(location1.equals(location2)).toBeTruthy();
    });

    it("should show region layer at national level", function() {
        var location1 = new DT.Location({});
        var uganda_location = new DT.Location({});

        expect(location1.layersToShow([])).toEqual([["region", uganda_location]]);
    });

    it("should show district layer at region level", function() {
        var uganda_location = new DT.Location({});
        var north_location = new DT.Location({ region: "north"});

        expect(north_location.layersToShow([])).toEqual([
            ["region", uganda_location],
            ["district", north_location]
        ]);
    });

    it("should show layer subcounties and water-points for district", function() {
        var location1 = new DT.Location({
            region: "north",
            district: "gulu"
        });

        var gulu_location = new DT.Location({ region: "north", district: "gulu" });
        var north_location = new DT.Location({ region: "north" });
        var uganda_location = new DT.Location({});

        expect(location1.layersToShow([])).toEqual([
            ["region", uganda_location],
            ["district", north_location],
            ["subcounty", gulu_location],
            ["water-point", gulu_location],
            ["health-center", gulu_location],
            ["school", gulu_location]
        ]);
    });

    it("should show filter keys have been toggled off", function() {
        var location1 = new DT.Location({
            region: "north",
            district: "gulu"
        });

        var gulu_location = new DT.Location({ region: "north", district: "gulu" });
        var uganda_location = new DT.Location({});

        expect(location1.layersToShow(["water-point", "district"])).toEqual([
            ["region", uganda_location],
            ["subcounty", gulu_location],
            ["health-center", gulu_location],
            ["school", gulu_location]
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

        expect(location1.layersToShow([])).toEqual([
            ["region", uganda_location],
            ["district", north_location],
            ["subcounty", gulu_location],
            ["water-point", gulu_location],
            ["health-center", gulu_location],
            ["school", gulu_location],
            ["parish", patiko_location]

        ]);
    });

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

        expect(location1.layersToShow([])).toEqual([
            ["region", uganda_location],
            ["district", north_location],
            ["subcounty", gulu_location],
            ["water-point", gulu_location],
            ["health-center", gulu_location],
            ["school", gulu_location],
            ["parish", patiko_location]
        ]);
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

        expect(DT.Location.compareLayerKeys([["district", guluLocation]], [["district", patikoLocation]])).toEqual({
            toAdd: [["district", patikoLocation]],
            toRemove: [["district", guluLocation]],
        });

        expect(DT.Location.compareLayerKeys([["district", guluLocation], ["district", patikoLocation]], [["district", patikoLocation]])).toEqual({
            toAdd: [],
            toRemove: [["district", guluLocation]]
        });

        expect(DT.Location.compareLayerKeys([["district", patikoLocation]], [["district", patikoLocation], ["district", guluLocation]])).toEqual({
            toAdd: [["district", guluLocation]],
            toRemove: []
        });
    });

    it("should indicate if location is at a particular level", function() {
        var parishLocation = new DT.Location({
            region: "north",
            district: "gulu",
            subcounty: "patiko",
            parish: "something"
        });

        expect(parishLocation.level()).toBe("parish");
        
    })

    it("should indicate if location is at national level", function() {
        var nationalLocation = new DT.Location({
        });

        expect(nationalLocation.level()).toBe("national");
    })

    it("should output full name of location", function() {
        var guluLocation = new DT.Location({
            region: "north",
            district: "gulu"
        });

        expect(guluLocation.full_name()).toBe("gulu district");

        var guluLocation = new DT.Location({
            region: "north",
            district: "gulu",
            subcounty: "parisho",
            parish: "a parish"
        });

        expect(guluLocation.full_name()).toBe("a parish parish");
        
    })

});