describe("Services", function() {
    var mock, indicatorService;

    beforeEach(function() {
      mock = { districts: jasmine.createSpy() };

      module('dashboard', function($provide) {
        $provide.value('indicatorService', mock);
      });
     
    });

    it('should not alert first two notifications',  inject(function(indicatorService) {
      // notify('one');
      // notify('two');
        indicatorService.districts("test")
      // expect(mock.alert).not.toHaveBeenCalled();
    }));
});

