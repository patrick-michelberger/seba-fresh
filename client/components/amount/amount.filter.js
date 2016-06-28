'use strict';

angular.module('sebaFreshApp')
  .filter('amount', function () {
    return function (input) {
      if (typeof input === 'undefined') {
        return "0";
      } else {
        return input;
      }
    };
  });
