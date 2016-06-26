'use strict';

class ShoppingCartController {

  constructor($scope, ShopService) {
    var self = this;
    $scope.$watch(function () {
      return ShopService.getCurrentCart();
    }, function (currentCart) {
      self.currentCart = currentCart;
    });
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
