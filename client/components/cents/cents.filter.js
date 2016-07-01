'use strict';

angular.module('sebaFreshApp')
  .filter('cents', function () {
    return function (input) {
      if (typeof input === 'undefined' || input === 0 ) {
        return "00";
      } else {
        var decimals = (input % 1).toString().slice(2, 4);
        if (decimals.length < 2) {
          decimals += "0"
        }
        return decimals;
      }
    };
  });
