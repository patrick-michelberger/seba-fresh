'use strict';

angular.module('sebaFreshApp')
  .directive('categoryMenu', function () {
    return {
      templateUrl: 'compontents/categoryMenu/categoryMenu.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
