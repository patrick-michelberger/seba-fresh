'use strict';

(function () {

  function ShopService(Util, Auth, Cart, $q) {
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
            // TODO update carts data structure
            return safeCb(callback)(null, carts[cartId]);
          },
          function (err) {
            Auth.logout();
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
      }
    };

    return Shop;
  }

  angular.module('sebaFreshApp.shop')
    .factory('ShopService', ShopService);

})();
