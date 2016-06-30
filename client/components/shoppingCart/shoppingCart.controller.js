'use strict';

class ShoppingCartController {

  constructor($scope, ShopService, Auth) {
    var self = this;
    this.ShopService = ShopService;
    this.Auth = Auth;
    $scope.$watch(function () {
      return ShopService.getCurrentCart();
    }, function (currentCart) {
      self.currentCart = currentCart;
      var groupedItems = self.calculatedGroupedItems(currentCart.items);
      self.flatmatesItems = groupedItems.flatmates;
      self.currentUserItems = groupedItems.currentUser;
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
    var value = 0;
    items.forEach(function (item) {
      value += item.quantity;
    });
    return value;
  }

  calculatedGroupedItems(items) {
    var groupedItems = _.groupBy(items, 'user._id');
    var currentUser = this.Auth.getCurrentUser();
    var currentUserItems = [];
    if (currentUser && currentUser._id && groupedItems[currentUser._id]) {
      currentUserItems = groupedItems[currentUser._id];
      delete groupedItems[currentUser._id]
    }
    return {
      "currentUser": currentUserItems,
      "flatmates": groupedItems
    }
  }

  isCurrentUser(userId) {
    return this.Auth.getCurrentUser()._id === userId;
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
