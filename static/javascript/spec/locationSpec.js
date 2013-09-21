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

    it("should not show district layer at national level", function() {
        var location1 = new DT.Location({
            district: null,
            subcounty: null,
            parish: null
        });

        var uganda_location = new DT.Location({});

        expect(location1.layersToShow()).toEqual([["district", uganda_location]]);
    });

    it("should show layer subcounties and water_points for district", function() {
        var location1 = new DT.Location({
            district: "gulu",
            subcounty: null,
            parish: null
        });

        var gulu_location = new DT.Location({ district: "gulu" });
        var uganda_location = new DT.Location({});

        expect(location1.layersToShow()).toEqual([
            ["district", uganda_location],
            ["subcounty", gulu_location],
            ["water_point", gulu_location]
        ]);
    });

    it("should show layer subcounties, water_points and parishes for subcounty", function() {
        var location1 = new DT.Location({
            district: "gulu",
            subcounty: "patiko",
            parish: null
        });
        var uganda_location = new DT.Location({});
        var gulu_location = new DT.Location({ district: "gulu" });
        var patiko_location = new DT.Location({ district: "gulu", subcounty: "patiko" });

        expect(location1.layersToShow()).toEqual([
            ["district", uganda_location],
            ["subcounty", gulu_location],
            ["water_point", gulu_location],
            ["parish", patiko_location]
        ]);
    });

    it("should show layer subcounties, water_points and parishes for parish", function() {
        var location1 = new DT.Location({
            district: "gulu",
            subcounty: "patiko",
            parish: "a_parish"
        });
        var uganda_location = new DT.Location({});
        var gulu_location = new DT.Location({ district: "gulu" });
        var patiko_location = new DT.Location({ district: "gulu", subcounty: "patiko" });

        expect(location1.layersToShow()).toEqual([
            ["district", uganda_location],
            ["subcounty", gulu_location],
            ["water_point", gulu_location],
            ["parish", patiko_location]
        ]);
    });

    it("should compare layers to see which layers are missing", function() {
        var patikoLocation = new DT.Location({
            district: "gulu",
            subcounty: "patiko"
        });

        var guluLocation = new DT.Location({
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

});