describe("Utilities", function() {

  it("should encode location name", function() {
    var stringWithSlash = "tim/rocks";
    expect(DT.encode(stringWithSlash)).toBe("tim_rocks");
  });

  it("should decode location name", function() {
    var stringWithSlash = "tim_rocks";
    expect(DT.decode(stringWithSlash)).toBe("tim/rocks");
  });
});