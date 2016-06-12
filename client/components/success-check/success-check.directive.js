'use strict';

angular.module('sebaFreshApp')
  .directive('successCheck', function () {
    return {
      templateUrl: 'components/success-check/success-check.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
