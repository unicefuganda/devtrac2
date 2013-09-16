describe("Utilities", function() {

    it("should encode location name", function() {
        var stringWithSlash = "tim/rocks";
        expect(DT.encode(stringWithSlash)).toBe("tim_rocks");
    });

    it("should decode location name", function() {
        var stringWithSlash = "tim_rocks";
        expect(DT.decode(stringWithSlash)).toBe("tim/rocks");
    });

    it("should filter list for the first element matching condition function", function() {
        var arr = ["robert", "tim", "bob"];
        expect(DT.first(arr, function(str) {
            return str.length == 3;
        })).toBe("tim");
    });

    it("should give null if list does not match condition", function() {
        var arr = ["robert", "tim", "bob"];
        expect(DT.first(arr, function(str) {
            return str == "kevin bacon";
        })).toBeNull();
    });

    it("should pad left of string", function() {
        expect(DT.lpad("kevin", "_", 7)).toBe("__kevin");
        expect(DT.lpad("kevin", "_", 4)).toBe("kevin");
    });

    it("should capatilize first character", function() {
        expect(DT.capitalize("kevin bacon")).toBe("Kevin Bacon");
    });

});