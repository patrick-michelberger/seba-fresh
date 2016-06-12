'use strict';

angular.module('sebaFreshApp.categoryFilter')
  .filter('categoryFilter', function () {
    return function (input) {
      return 'categoryFilter filter: ' + input;
    };
  });
