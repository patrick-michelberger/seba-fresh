'use strict';

angular.module('sebaFreshApp')
  .directive('onboardingContainer', function () {
    return {
      templateUrl: 'components/onboarding/onboarding.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {},
      controller: 'OnboardingController',
      controllerAs: 'onboarding'
    };
  });
