describe("Location", function() {

    it("should have district, subcounty and parish", function() {
        var location = new DT.Location({ district: "test_district", subcounty: "test_subcounty", parish: "test_parish"});
        expect(location.district).toBe("test_district");
        expect(location.subcounty).toBe("test_subcounty");
        expect(location.parish).toBe("test_parish");
    });

    it("should equal to other location with same properties", function() {
        var location1 = new DT.Location({ district: "test_district", subcounty: "test_subcounty", parish: "test_parish"});
        var location2 = new DT.Location({ district: "test_district", subcounty: "test_subcounty", parish: "test_parish"});

        expect(location1.equals(location2)).toBeTruthy();
    });

    it("should not show layers at national level", function(){
        var location1 = new DT.Location({ district: null, subcounty: null, parish: null});

        expect(location1.layersToShow()).toEqual([]);
    });

    it("should show layer subcounties and water_points for district", function(){
        var location1 = new DT.Location({ district: "gulu", subcounty: null, parish: null});

        expect(location1.layersToShow()).toEqual([["subcounty", "gulu"], ["water_point", "gulu"]]);
    });

    it("should show layer subcounties, water_points and parishes for subcounty", function(){
        var location1 = new DT.Location({ district: "gulu", subcounty: "patiko", parish: null});

        expect(location1.layersToShow()).toEqual([["subcounty", "gulu"], ["water_point", "gulu"], ["parish", "patiko"]]);
    });

    it("should show layer subcounties, water_points and parishes for parish", function(){
        var location1 = new DT.Location({ district: "gulu", subcounty: "patiko", parish: "a_parish"});

        expect(location1.layersToShow()).toEqual([["subcounty", "gulu"], ["water_point", "gulu"], ["parish", "patiko"]]);
    });

});