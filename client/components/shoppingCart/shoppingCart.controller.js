'use strict';

class ShoppingCartController {

  constructor($rootScope, $timeout, $scope, $http, ShopService, Auth, DialogService) {
    var self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.ShopService = ShopService;
    this.$timeout = $timeout;
    this.getCurrentCart = ShopService.getCurrentCart;
    this.Auth = Auth;
    this.$http = $http;
    this.DialogService = DialogService;
    this.currentUserItems = [];
    this.freeShipping = false;
  }

  $onInit() {
    var self = this;
  }

  pay() {
    this.DialogService.showPayModal(this.currentCart);
  }

  _getAddToCartUrl(cart) {
    var items = "";
    var users = cart.users;
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      for (var x = 0; x < user.items.length; x++) {
        var item = user.items[x];
        var quantity = user.items[x].quantity;
        items += item.product.id + "|" + quantity;
        items += ',';
      }
    }
    if (items.length < 1) {
      return false;
    }
    return encodeURI("http://affil.walmart.com/cart/addToCart?items=" + items + "&affp1=|apk|&affilsrc=api&veh=aff&wmlspartner=readonlyapi");
  }

  checkout() {
    var url = this._getAddToCartUrl(this.currentCart);
    if (url) {
      window.open(url, '_blank');
    }
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
    if (items && items.length > 1) {
      items = items ||  [];
      var value = 0;
      items.forEach(function (item) {
        value += item.quantity;
      });
      return value;
    }
  }

  calculatedGroupedItems(users) {
    console.log("calculatedGroupedItems...");
    var currentUserItems = [];
    var currentUser = this.Auth.getCurrentUser();
    var currentUserIndex = _.findIndex(users, {
      "_id": currentUser._id
    });
    currentUserItems = users[currentUserIndex].items;
    // make copy
    users = users.slice();
    users.splice(currentUserIndex, 1);
    return {
      "currentUser": currentUserItems
    };
  }

  isCurrentUser(userId) {
    return this.Auth.getCurrentUser()._id === userId;
  }

  isGroupAdmin() {
    if (!this.currentCart || !this.currentCart.group) {
      return false;
    }
    return this.Auth.getCurrentUser()._id === this.currentCart.group.admin;
  }

  isFreeShippingAvailable() {
    var currentCart = this.getCurrentCart();
    var freeShipping = currentCart.totalAmount && currentCart.totalAmount > 0 && ((currentCart.totalAmount / 50) >= 1) ? true : false;
    return freeShipping;
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
