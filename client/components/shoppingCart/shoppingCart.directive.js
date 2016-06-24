'use strict';

angular.module('sebaFreshApp')
  .directive('shoppingCart', function () {
    return {
      templateUrl: 'components/shoppingCart/shoppingCart.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {},
      controller: 'ShoppingCartController',
      controllerAs: 'shoppingCartCtrl'
    };
  });
