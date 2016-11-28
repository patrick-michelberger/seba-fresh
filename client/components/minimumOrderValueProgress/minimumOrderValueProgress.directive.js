'use strict';

angular.module('sebaFreshApp')
  .directive('minimumOrderValueProgress', function(FirebaseCart) {
    return {
      templateUrl: 'components/minimumOrderValueProgress/minimumOrderValueProgress.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var self = this;

        // Attributes
        scope.progressStyle = {
          'width': '0%'
        };
        scope.carts = FirebaseCart.getCarts();

        // Methods
        scope.updateProgressStyle = function(currentCart) {
          if (currentCart) {
            var percent = Math.round((currentCart.totalAmount / 50) * 100);
            percent = percent < 0 ? 0 : percent;
            scope.freeShipping = currentCart.totalAmount && currentCart.totalAmount > 0 && ((currentCart.totalAmount / 50) >= 1) ? true : false;
            return {
              'width': percent + '%'
            };
          }
        };
      }
    };
  });
