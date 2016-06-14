'use strict';

describe('Directive: categoryMenu', function () {

  // load the directive's module and view
  beforeEach(module('sebaFreshApp'));
  beforeEach(module('components/categoryMenu/categoryMenu.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<category-menu></category-menu>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the categoryMenu directive');
  }));
});
