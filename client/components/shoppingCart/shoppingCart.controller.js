'use strict';

class ShoppingCartController {

  constructor($rootScope, $scope, ShopService, Auth, DialogService) {
    var self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.ShopService = ShopService;
    this.getCurrentCart = ShopService.getCurrentCart;
    this.Auth = Auth;
    this.DialogService = DialogService;
    this.currentUserItems = [];
    this.flatmatesItems = [];
    this.freeShipping = false;
  }

  $onInit() {
    var self = this;

    this.$scope.$watch(function () {
      return self.ShopService.getCurrentCart();
    }, function (currentCart) {
      if (currentCart) {
        self.currentCart = currentCart;
        currentCart.$promise.then(function () {
          // TODO More efficient method?
          var groupedItems = self.calculatedGroupedItems(currentCart.users);
          self.flatmates = groupedItems.flatmates;
          self.currentUserItems = groupedItems.currentUser;
          self.freeShipping = currentCart.totalAmount && currentCart.totalAmount > 0 && ((currentCart.totalAmount / 50) >= 1) ? true : false;
        });
      }
    });
  }

  pay() {
    this.DialogService.showPayModal(this.currentCart);
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
    if (items) {
      items = items ||  [];
      var value = 0;
      items.forEach(function (item) {
        value += item.product.price * item.quantity;
      });
      return value.toFixed(2);
    }
  }

  calculateOrderAmount(items) {
    if (items) {
      items = items ||  [];
      var value = 0;
      items.forEach(function (item) {
        value += item.quantity;
      });
      return value;
    }
  }

  calculatedGroupedItems(users) {
    var currentUserItems = [];
    var flatmates = {};
    var currentUser = this.Auth.getCurrentUser();
    var currentUserIndex = _.findIndex(users, {
      "_id": currentUser._id
    });
    if (currentUserIndex > -1) {
      currentUserItems = users[currentUserIndex].items;
      // make copy
      users = users.slice();
      users.splice(currentUserIndex, 1);
    }
    return {
      "currentUser": currentUserItems,
      "flatmates": users
    };
  }

  isCurrentUser(userId) {
    return this.Auth.getCurrentUser()._id === userId;
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
