'use strict';

describe('Directive: shoppingCart', function () {

  // load the directive's module and view
  beforeEach(module('sebaFreshApp'));
  beforeEach(module('components/shoppingCart/shoppingCart.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<shopping-cart></shopping-cart>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the shoppingCart directive');
  }));
});
