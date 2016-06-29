'use strict';

angular.module('sebaFreshApp')
  .filter('price', function () {
    return function (input) {
      var number = input.toString().split(".")[0];
      var decimals = (input % 1).toString().slice(2, 4);
      if (decimals.length < 2) {
        decimals += "0"
      }
      return number + '.' + decimals;
    };
  });
