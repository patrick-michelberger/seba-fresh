'use strict';

class ShoppingCartController {

  constructor($scope, ShopService) {
    var self = this;
    this.ShopService = ShopService;
    $scope.$watch(function () {
      return ShopService.getCurrentCart();
    }, function (currentCart) {
      self.currentCart = currentCart;
      console.log("currentCart: ", currentCart);
    });
  }

  addToCart(product) {
    this.ShopService.addToCart(product, function () {});
    var quantity = product.quantity || 0;
    product.quantity = quantity + 1;
  }

  removeFromCart(product) {
    this.ShopService.removeFromCart(product, function () {});
    var quantity = product.quantity || 0;
    if (quantity > 0) {
      product.quantity = quantity - 1;
    }
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
