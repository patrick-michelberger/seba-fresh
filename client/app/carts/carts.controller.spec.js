'use strict';

describe('Component: CartsComponent', function () {

  // load the controller's module
  beforeEach(module('sebaFreshApp'));

  var CartsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    CartsComponent = $componentController('CartsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
