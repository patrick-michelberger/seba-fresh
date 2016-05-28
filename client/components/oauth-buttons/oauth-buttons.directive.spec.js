'use strict';

describe('Directive: oauthButtons', function () {

  // load the directive's module and view
  beforeEach(module('sebaFreshApp.oauth-buttons'));
  beforeEach(module('components/oauth-buttons/oauth-buttons/oauth-buttons.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<oauth-buttons></oauth-buttons>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the oauthButtons directive');
  }));
});
