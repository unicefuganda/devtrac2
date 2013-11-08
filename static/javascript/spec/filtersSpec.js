describe('Angular Filters', function() {
  beforeEach(module('dashboard'));

  describe('percent', function() {

    it('format fraction to percent', inject(function(percentFilter) {
      expect(percentFilter(0.5)).toEqual("50%");
    }));
  });
});