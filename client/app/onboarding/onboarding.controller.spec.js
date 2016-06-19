'use strict';

describe('Component: OnboardingComponent', function () {

  // load the controller's module
  beforeEach(module('sebaFreshApp'));

  var OnboardingComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    OnboardingComponent = $componentController('OnboardingComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
