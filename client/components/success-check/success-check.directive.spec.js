'use strict';

describe('Directive: successCheck', function () {

  // load the directive's module and view
  beforeEach(module('sebaFreshApp'));
  beforeEach(module('components/success-check/success-check.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<success-check></success-check>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the successCheck directive');
  }));
});
