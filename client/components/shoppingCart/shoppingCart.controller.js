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
    this.currentUserItems = FirebaseCart.getProducts();
    this.flatmatesItems = [];

    this.currentUser = FirebaseUser.getCurrentUser();

    // Methods
    this.calculateOrderValue = this.calculateOrderValue;
    this.calculateOrderAmount = this.calculateOrderAmount;
    this._emitChangeEvent = this._emitChangeEvent;
  }

  $onInit() {
    var self = this;

    /* TODO
    this.$scope.$watch(function() {
      return self.ShopService.getCurrentCart();
    }, function(currentCart) {
      if (currentCart) {
        self.currentCart = currentCart;
        currentCart.$promise.then(function() {
          // TODO More efficient method?
          var groupedItems = self.calculatedGroupedItems(currentCart.users);
          self.flatmates = groupedItems.flatmates;
          self.currentUserItems = groupedItems.currentUser;
          self.freeShipping = currentCart.totalAmount && currentCart.totalAmount > 0 && ((currentCart.totalAmount / 50) >= 1) ? true : false;
        });
      }
    });
    */
  }

  pay() {
    this.DialogService.showPayModal(this.carts.current);
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

  calculateOrderValue(items) {
    if (items) {
      items = items || [];
      var value = 0;
      items.forEach(function(item) {
        value += item.item.price * item.quantity;
      });
      return value.toFixed(2);
    }
  }

  calculateOrderAmount(items) {
    if (items) {
      items = items ||  [];
      var value = 0;
      items.forEach(function(item) {
        value += item.quantity;
      });
      return value;
    }
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
