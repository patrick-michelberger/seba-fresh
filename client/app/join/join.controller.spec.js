'use strict';

describe('Component: JoinComponent', function () {

  // load the controller's module
  beforeEach(module('sebaFreshApp'));

  var JoinComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    JoinComponent = $componentController('JoinComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
