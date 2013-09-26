describe("Filter", function() { 

    it("should give keys with of toggle off data", function() {
        var filter = new DT.Filter();
        expect(filter.dataToggledOff()).toEqual([]);

        filter.health_center = true;
        filter.water_point = false;
        filter.school = false;

        expect(filter.dataToggledOff()).toEqual(["water-point", "school"]);
    });
});