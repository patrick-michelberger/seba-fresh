'use strict';

angular.module('sebaFreshApp')
  .directive('minimumOrderValueProgress', function (ShopService) {
    return {
      templateUrl: 'components/minimumOrderValueProgress/minimumOrderValueProgress.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        var self = this;
        scope.$watch(function () {
          return ShopService.getCurrentCart();
        }, function (currentCart) {
          if (currentCart) {
            scope.currentCart = currentCart;
            var percent = Math.round((currentCart.totalAmount / 50) * 100);
            scope.freeShipping = currentCart.totalAmount && ((currentCart.totalAmount / 50) < 1) ? false : true;
          }
        });
      }
    };
  });
