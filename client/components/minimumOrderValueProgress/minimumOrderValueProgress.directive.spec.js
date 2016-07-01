'use strict';

describe('Directive: minimumOrderValueProgress', function () {

  // load the directive's module and view
  beforeEach(module('sebaFreshApp'));
  beforeEach(module('components/minimumOrderValueProgress/minimumOrderValueProgress.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<minimum-order-value-progress></minimum-order-value-progress>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the minimumOrderValueProgress directive');
  }));
});
