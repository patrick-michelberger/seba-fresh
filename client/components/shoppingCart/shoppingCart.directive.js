'use strict';

angular.module('sebaFreshApp')
  .directive('shoppingCart', function () {
    return {
      templateUrl: 'components/shoppingCart/shoppingCart.html',
      restrict: 'EA',
      controller: 'ShoppingCartController',
      controllerAs: 'shoppingCartCtrl'
    };
  });
