'use strict';

(function() {

  function AssortmentService($rootScope, Util, ProductService, ShopService, Auth) {
    var safeCb = Util.safeCb;
    var products = [];

    $rootScope.$on('cart:add', function(event, product) {
      Assortment.updateQuantities();
    });

    $rootScope.$on('cart:remove', function(event, product) {
      var cart = ShopService.getCurrentCart();
      for (var i = 0; i < products.length; i++) {
        if (products[i].quantity && products[i].quantity > 0 && products[i]._id === product._id) {
          products[i].quantity -= 1;
        }
      }
    });

    var Assortment = {

      /**
       * Fetch individual product
       *   (synchronous|asynchronous)
       *
       * @param {String} productId - product id
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      fetch(productId, callback) {
        return ProductService.get({
          id: productId
        }, function(product) {

        }, function() {
          return safeCb(callback)(null);
        });
      },

      /**
       * Fetch all products
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      fetchAll(callback)  {
        return ProductService.query({}, function(data) {
          products = data;
          Assortment.updateQuantities();
          return safeCb(callback)(null, products);
        }, function() {
          return safeCb(callback)(null, []);
        });
      },

      updateQuantities() {
        ShopService.getCurrentCart(function(currentCart) {
          var user = _.find(currentCart.users, {
            "_id": Auth.getCurrentUser()._id
          });
          if (user) {
            user.items.forEach(Assortment.updateQuantity);
          }
        });
      },

      updateQuantity(item) {
        var quantity = item.quantity;
        for (var i = 0; i < products.length; i++) {
          if (products[i]._id == item.product._id) {
            products[i].quantity = item.quantity;
          }
        }
      },

    };

    return Assortment;
  }


  angular.module('sebaFreshApp.assortment')
    .factory('AssortmentService', AssortmentService);

})();
