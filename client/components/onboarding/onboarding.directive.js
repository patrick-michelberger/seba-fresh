'use strict';

angular.module('sebaFreshApp')
  .directive('onboarding', function () {
    return {
      templateUrl: 'components/onboarding/onboarding.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
