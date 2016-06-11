'use strict';

describe('Directive: onboarding', function () {

  // load the directive's module and view
  beforeEach(module('sebaFreshApp'));
  beforeEach(module('components/onboarding/onboarding.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<onboarding></onboarding>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the onboarding directive');
  }));
});
