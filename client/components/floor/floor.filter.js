'use strict';

angular.module('sebaFreshApp')
  .filter('floor', function () {
    return function (input) {
      if (typeof input === 'undefined') {
        return "0"
      } else {
        return Math.floor(input);
      }
    };
  });
