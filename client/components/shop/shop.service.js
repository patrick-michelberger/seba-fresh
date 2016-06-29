'use strict';

(function () {

  function ShopService($rootScope, Util, Auth, Cart, $q) {
    var safeCb = Util.safeCb;
    var carts = [];
    var currentCart = false;

    if (Auth.isLoggedIn()) {
      Cart.query(function (carts) {
        if (carts && carts[0]) {
          currentCart = carts[0];
        }
      });
    }

    var Shop = {

      /**
       * Add a product to a cart
       *
       * @param  {Object} product - product
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      addToCart(product, callback) {
        var cartId = currentCart._id;
        return Cart.add({
            id: cartId
          }, {
            product: product,
            userId: Auth.getCurrentUser()._id
          }, function (data) {
            currentCart = data;
            $rootScope.$emit("cart:add", product);
            // TODO update carts data structure
            return safeCb(callback)(null);
          },
          function (err) {
            return safeCb(callback)(err);
          }).$promise;
      },

      /**
       * Remove a product from a cart
       *
       * @param  {Object} product - product
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      removeFromCart(product, callback) {
        var cartId = currentCart._id;
        return Cart.remove({
            id: cartId
          }, {
            product: product,
            userId: Auth.getCurrentUser()._id,
            quantity: 1
          }, function (data) {
            currentCart = data;
            $rootScope.$emit("cart:remove", product);
            // TODO update carts data structure
            return safeCb(callback)(null, carts[cartId]);
          },
          function (err) {
            return safeCb(callback)(err);
          }).$promise;
      },

      /**
       * Gets all user's current carts
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      getCarts(callback) {
        if (arguments.length === 0) {
          return carts;
        }

        var value = (carts.hasOwnProperty('$promise')) ?
          carts.$promise : carts;
        return $q.when(value)
          .then(carts => {
            safeCb(callback)(carts);
            return carts;
          }, () => {
            safeCb(callback)({});
            return {};
          });
      },

      getCurrentCart() {
        return currentCart;
      },

      setCurrentCart(cart) {
        currentCart = cart;
      },

      clear() {
        currentCart = false;
        carts = [];
      }

    };

    return Shop;
  }

  angular.module('sebaFreshApp')
    .factory('ShopService', ShopService);

})();
