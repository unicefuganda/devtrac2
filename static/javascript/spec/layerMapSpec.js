describe("LayerMap", function() {

    it("should add layer to map", function() {
        var location = new DT.Location({
            district: "Gulu"
        });
        var map = new DT.LayerMap("someid");

        map.addLayer("water_points", location, []);

        expect(map.displayedLayerKeys()).toEqual([
            ["water_points", location]
        ]);
    });

    it("should remove layer from map", function() {
        var map = new DT.LayerMap("someid");
        var location1 = new DT.Location({
            district: "Gulu"
        });
        var location2 = new DT.Location({
            district: "Gulu"
        });

        map.addLayer("water_points", location1, ["some data"]);
        map.addLayer("districts", location2, ["some data"]);

        var removedLayer = map.removeLayer("districts", location2);
        expect(removedLayer).toEqual(["some data"]);

        expect(map.displayedLayerKeys()).toEqual([
            ["water_points", location1]
        ]);
    });
});