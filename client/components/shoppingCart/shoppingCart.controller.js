'use strict';

class ShoppingCartController {

  constructor($scope, ShopService) {
    var self = this;
    this.ShopService = ShopService;
    $scope.$watch(function () {
      return ShopService.getCurrentCart();
    }, function (currentCart) {
      self.currentCart = currentCart;
      self.groupedItems = _.groupBy(self.currentCart.items, 'user._id');
      console.log("groupedItems: ", self.groupedItems);
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

  calculateOrderValue(items) {
    var value = 0;
    items.forEach(function (item) {
      value += item.product.price * item.quantity;
    });
    return value.toFixed(2);
  }

  calculateOrderAmount(items) {
    console.log("items: ", items);
    var value = 0;
    items.forEach(function (item) {
      console.log("item.quantity: ", item.quantity);
      value += item.quantity;
    });
    return value;
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
