'use strict';

class ShoppingCartController {

  constructor($rootScope, $scope, $state, DialogService, FirebaseAuth, FirebaseCart, FirebaseUser) {
    var self = this;

    // Dependencies
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;

    this.DialogService = DialogService;
    this.FirebaseAuth = FirebaseAuth;
    this.FirebaseCart = FirebaseCart;

    // Dynamic attributes
    this.freeShipping = false;
    this.carts = FirebaseCart.getCarts();
    this.currentUserItems = [];
    this.flatmatesItems = [];

    this.users = FirebaseCart.getUsers();
    this.products = FirebaseCart.getProducts();
    this.currentUser = FirebaseUser.getCurrentUser();

    // Methods
    this.calculateOrderValue = this.calculateOrderValue;
    this.calculateOrderAmount = this.calculateOrderAmount;
    this._emitChangeEvent = this._emitChangeEvent;
    this.getNumberOfMembers = this.getNumberOfMembers;
    this.sendPaymentRequest = this.sendPaymentRequest;
    this.pay = this.pay;
  }

  getNumberOfMembers(users) {
    if (users) {
      return Object.keys(users).length;
    }
  }

  sendPaymentRequest() {
    this.DialogService.showPayModal(this.carts.current);
  }

  pay() {
    this.DialogService.showPayModal(this.carts.current);
  }

  _getAddToCartUrl(cart) {
    var items = "";
    var users = this.users.current;
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var userItems = this.products.current[user.uid];

      angular.forEach(userItems, (item, itemId) => {
        var quantity = item.quantity;
        items += item.item.id + "|" + quantity;
        items += ',';
      });
    }
    if (items.length < 1) {
      return false;
    }
    return encodeURI("http://affil.walmart.com/cart/addToCart?items=" + items + "&affp1=|apk|&affilsrc=api&veh=aff&wmlspartner=readonlyapi");
  }

  checkout() {
    var url = this._getAddToCartUrl(this.carts.current);
    if (url) {
      window.open(url, '_blank');
    }
  }

  addToCart(product) {
    const self = this;

    if (!product ||  !this.carts.current) {
      this.$state.go('login');
      return;
    }

    this._emitChangeEvent(product.id, true);
    return this.FirebaseCart.addItem(this.carts.current.id, product).then(() => {
      self._emitChangeEvent(product.id, false);
    });
  }

  removeFromCart(product) {
    const self = this;

    if (!product ||  !this.carts.current) {
      this.$state.go('login');
      return;
    }

    this._emitChangeEvent(product.id, true);
    return this.FirebaseCart.removeItem(this.carts.current.id, product).then(() => {
      self._emitChangeEvent(product.id, false);
    });
  }

  calculateOrderValue(uid) {
    return this.FirebaseCart.getOrderValue(uid);
  }

  calculateOrderAmount(uid) {
    return this.FirebaseCart.getOrderQuantity(uid);
  }

  calculatedGroupedItems(users) {
    var currentUserItems = [];
    var flatmates = {};
    var currentUser = FirebaseAuth.$getAuth();
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
    return this.currentUser.auth.uid === userId;
  }

  isGroupAdmin() {
    if (!this.carts || !this.carts.current || !this.currentUser.auth) {
      return false;
    }
    return this.currentUser.auth.uid === this.carts.current.createdByUserId;
  }

  /**
   * Trigger recompile for an individual product item
   *
   * @param {String} productId Description
   * @param {Boolean} isLoading
   *
   */
  _emitChangeEvent(productId, isLoading) {
    if (!productId) {
      return;
    }
    this.$rootScope.$broadcast('cart:add:' + productId);
    this.isLoading = isLoading;
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
