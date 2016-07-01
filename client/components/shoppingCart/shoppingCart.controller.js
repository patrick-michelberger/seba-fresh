'use strict';

class ShoppingCartController {

  constructor($rootScope, $scope, ShopService, Auth) {
    var self = this;
    this.$rootScope = $rootScope;
    this.ShopService = ShopService;
    this.Auth = Auth;
    this.currentUserItems = [];
    this.flatmatesItems = [];
  }

  $onInit() {
    var self = this;
    this.ShopService.getCurrentCart(function (currentCart) {
      self.currentCart = currentCart;
      var groupedItems = self.calculatedGroupedItems(currentCart.items);
      self.flatmatesItems = groupedItems.flatmates;
      self.currentUserItems = groupedItems.currentUser;
      self.$rootScope.$on('cart:add', function (event, product) {
        self._addToCurrentUserItems(product);
        self.currentCart = self.ShopService.getCurrentCart();
      });
      self.$rootScope.$on('cart:remove', function (event, product) {
        self._removeFromCurrentUserItems(product);
        self.currentCart = self.ShopService.getCurrentCart();
      });
      self.$rootScope.$on('cart:create', function (event, cart) {
        cart.then(function (currentCart) {
          self.currentCart = currentCart;
          var groupedItems = self.calculatedGroupedItems(currentCart.items);
          self.flatmatesItems = groupedItems.flatmates;
          self.currentUserItems = groupedItems.currentUser;
        });
      });
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
    items = items ||  [];
    var value = 0;
    items.forEach(function (item) {
      value += item.product.price * item.quantity;
    });
    return value.toFixed(2);
  }

  calculateOrderAmount(items) {
    items = items ||  [];
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

  _addToCurrentUserItems(product) {
    var user = this.Auth.getCurrentUser();
    var items = this.currentUserItems;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.product._id == product._id && item.user._id == user._id) {
        item.quantity += 1;
        return
      }
    }
    var newItem = {
      product: product,
      quantity: 1,
      user: {
        "_id": user._id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "picture": user.picture
      }
    };
    items.push(newItem);
  }

  _removeFromCurrentUserItems(product) {
    var user = this.Auth.getCurrentUser();
    var items = this.currentUserItems;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.product._id == product._id && item.user._id == user._id) {
        if (item.quantity <= 1) {
          items.splice(i, 1);
        } else {
          item.quantity -= 1;
        }
      }
    }
  }
}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
