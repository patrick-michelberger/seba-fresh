'use strict';

(function () {

  function ShopService(Util, Auth, Cart) {
    var safeCb = Util.safeCb;
    var carts = [];

    if (Auth.isLoggedIn()) {
      carts = Cart.query();
    }

    var Shop = {

      /**
       * Add a product to a cart
       *
       * @param  {Number} productId - product id
       * @param  {String} cartId - card id
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      addToCart(product, cartId, callback) {

        return Cart.add({
            id: cartId
          }, {
            productId: productId,
            userId: Auth.currentUser()._id
          }, function (data) {
            $cookies.put('token', data.token);
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
      }
    };

    return Shop;
  }

  angular.module('sebaFreshApp.shop')
    .factory('ShopService', ShopService);

})();
