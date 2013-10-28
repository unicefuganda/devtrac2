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

    it("shoud parse Location from name", function() {
        expect(DT.Location.fromName("Uganda")).toEqual(new DT.Location({}));
        expect(DT.Location.fromName("")).toEqual(new DT.Location({}));
        expect(DT.Location.fromName("Uganda, a_region")).toEqual(new DT.Location({region: "a_region"}));
        expect(DT.Location.fromName("Uganda, a_region, a_district")).toEqual(new DT.Location({region: "a_region", district: "a_district"}));
        expect(DT.Location.fromName("a_region, a_district")).toEqual(new DT.Location({region: "a_region", district: "a_district"}));
        expect(DT.Location.fromName("Uganda, a_region, a_district, a_subcounty")).toEqual(new DT.Location({region: "a_region", district: "a_district", subcounty: "a_subcounty"}));
        expect(DT.Location.fromName("Uganda, a_region, a_district, a_subcounty, a_parish")).toEqual(new DT.Location({region: "a_region", district: "a_district", subcounty: "a_subcounty", parish: "a_parish"}));
    })

    it ("should include national level in name", function() {
        expect(new DT.Location({}).getName(true)).toEqual("UGANDA");
        expect(new DT.Location({region: "north"}).getName(true)).toEqual("UGANDA, north");
        expect(new DT.Location({region: "north", district: "gulu"}).getName(true)).toEqual("UGANDA, north, gulu");
    })

    it ("should not include national level in name by default", function() {
        expect(new DT.Location({}).getName()).toEqual("");
        expect(new DT.Location({region: "north"}).getName()).toEqual("north");
        expect(new DT.Location({region: "north", district: "gulu"}).getName()).toEqual("north, gulu");
    })

    it ("should indicate if location contains other location", function () {

        var parentLocation = new DT.Location({ region: "north", district: "gulu" });
        var childLocation = new DT.Location({ region: "north", district: "gulu", subcounty: "patiko" });
        var outsideLocation = new DT.Location({ region: "north", district: "kampala", subcounty: "whatever" });

        expect(parentLocation.contains(childLocation)).toBeTruthy();
        expect(childLocation.contains(parentLocation)).toBeFalsy();
        expect(parentLocation.contains(outsideLocation)).toBeFalsy();
        expect(parentLocation.contains(parentLocation)).toBeTruthy();
    })
});