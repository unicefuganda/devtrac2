describe("LayerMap", function() {

    it("should add layer to map", function() {
        var location = new DT.Location({
            district: "Gulu"
        });
        var map = new DT.LayerMap("someid");

        map.addLayer("water-points", location, []);

        expect(map.displayedLayerKeys()).toEqual([
            ["water-points", location]
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

        map.addLayer("water-points", location1, ["some data"]);
        map.addLayer("districts", location2, ["some data"]);

        var removedLayer = map.removeLayer("districts", location2);
        expect(removedLayer).toEqual(["some data"]);

        expect(map.displayedLayerKeys()).toEqual([
            ["water-points", location1]
        ]);
    });

    it("should find layer from map", function() {
        var map = new DT.LayerMap("someid");
        var location1 = new DT.Location({
            district: "Gulu"
        });
        var location2 = new DT.Location({
            district: "Kampala"
        });

        map.addLayer("water-points", location1, "some data1");
        map.addLayer("districts", location2, "some data2");

        expect(map.findLayer("districts", location2)).toEqual("some data2");

        expect(map.findLayer("districts", location1)).toBeNull();
    });

    it("should find child layer from its location", function() {
        var map = new DT.LayerMap("someid");
        var guluLocation = new DT.Location({
            district: "Gulu"
        });
        var patikoLocation = new DT.Location({
            district: "Gulu",
            subcounty: "Patiko"
        });

        map.addLayer("other_layer", patikoLocation, "some data");
        map.addChildLayer("water-points", guluLocation, patikoLocation, "some data1");

        expect(map.findChildLayer(patikoLocation)).toEqual("some data1")
    })

    it("should find child layers from its parents location", function() {
        var map = new DT.LayerMap("someid");
        var guluLocation = new DT.Location({
            district: "Gulu"
        });
        var patikoLocation = new DT.Location({
            district: "Gulu",
            subcounty: "Patiko"
        });

        var awachLocation = new DT.Location({
            district: "Gulu",
            subcounty: "Awach"
        });


        map.addChildLayer("water-points", guluLocation, patikoLocation, "some data1");
        map.addChildLayer("water-points", guluLocation, awachLocation, "some data2");
        expect(map.findChildLayers("water-points", guluLocation)).toEqual(["some data1", "some data2"])
    })

    it("should list all child layers", function() {
        var map = new DT.LayerMap("someid");
        var guluLocation = new DT.Location({
            district: "Gulu"
        });
        var patikoLocation = new DT.Location({
            district: "Gulu",
            subcounty: "Patiko"
        });

        var awachLocation = new DT.Location({
            district: "Gulu",
            subcounty: "Awach"
        });

        var kampalaLocation = new DT.Location({
            district: "Kampala"
        });

        var makindyeLocation = new DT.Location({
            district: "Gulu",
            subcounty: "Makindye Divison"
        });

        map.addLayer("other_layer", guluLocation, "some data4");
        map.addChildLayer("water-points", guluLocation, patikoLocation, "some data1");
        map.addChildLayer("water-points", guluLocation, awachLocation, "some data2");
        map.addChildLayer("water-points", kampalaLocation, makindyeLocation, "some data3");

        expect(map.allChildLayers()).toEqual(["some data1", "some data2", "some data3"]);

    })
});