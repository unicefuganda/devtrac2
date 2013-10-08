describe("Config", function() {

    it("should format percentage indicators", function() {
        config = [{
            key: "test",
            label: "some label",
            formatter: DT.PercentageFormatter
        }]

        expect(new DT.IndicatorConfig(config).format("test", 0.5)).toEqual(["some label", "50%"]);
    });

    it("should format number indicators", function() {
        config = [{
            key: "test",
            label: "some label",
            formatter: DT.NumberFormatter
        }]

        expect(new DT.IndicatorConfig(config).format("test", 1000)).toEqual(["some label", "1,000"]);
    });

    it("should filter non displayed indicators", function() {
        config = [{
            key: "test",
            label: "some label",
            formatter: DT.NumberFormatter
        }]

        expect(new DT.IndicatorConfig(config).format("test2", 1000)).toBeNull();
    });
});