'use strict';

angular.module('sebaFreshApp')
  .directive('groups', function () {
    return {
      templateUrl: 'components/groups/groups.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
