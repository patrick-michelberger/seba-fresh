'use strict';

angular.module('sebaFreshApp')
  .directive('minimumOrderValueProgress', function (ShopService) {
    return {
      templateUrl: 'components/minimumOrderValueProgress/minimumOrderValueProgress.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        var self = this;
        scope.progressStyle = {
          'width': '0%'
        };
        scope.$watch(function () {
          return ShopService.getCurrentCart();
        }, function (currentCart) {
          if (currentCart) {
            scope.currentCart = currentCart;
            var percent = Math.round((currentCart.totalAmount / 50) * 100);
            scope.progressStyle = {
              'width': percent + '%'
            };
            scope.freeShipping = currentCart.totalAmount && currentCart.totalAmount > 0 && ((currentCart.totalAmount / 50) >= 1) ? true : false;
          }
        });
      }
    };
  });
