'use strict';

(function () {

  function AssortmentService($rootScope, Util, ProductService, ShopService) {
    var safeCb = Util.safeCb;
    var products = [];

    $rootScope.$on('cart:add', function (product) {
      console.log("cart:add: ", product);
      Assortment.updateQuantities();
    });

    $rootScope.$on('cart:remove', function (product) {
      console.log("cart:remove: ", product);
      var cart = ShopService.getCurrentCart();
      console.log("cart: ", cart);
      if (cart && cart.items && cart.items.length > 0) {
        Assortment.updateQuantities();
      } else {
        Assortment.clearQuantities();
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
        }, function (product) {
          product = Assortment.checkQuantity(product);
          return safeCb(callback)(product);
        }, function () {
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
        return ProductService.query({}, function (data) {
          products = data;
          Assortment.updateQuantities();
          return safeCb(callback)(null, products);
        }, function () {
          return safeCb(callback)(null, []);
        });
      },

      updateQuantities() {
        var currentCart = ShopService.getCurrentCart();
        var currentItems = currentCart.items;
        currentItems.forEach(Assortment.updateQuantity);
      },

      clearQuantities() {
        for (var i = 0; i < products.length; i++) {
          products[i].quantity = 0;
        }
      },

      updateQuantity(item) {
        var quantity = item.quantity;
        for (var i = 0; i < products.length; i++) {
          if (products[i]._id == item.product._id) {
            products[i].quantity = item.quantity;
          }
        }
      },

      checkQuantity(product) {
        var currentCart = ShopService.getCurrentCart();
        var items = currentCart.items;
        for (var i = 0; i < items.length; i++) {
          if (items[i].product._id == product._id) {
            product.quantity = items[i].quantity;
            return product;
          }
        }
        return product;
      }
    };

    return Assortment;
  }


  angular.module('sebaFreshApp.assortment')
    .factory('AssortmentService', AssortmentService);

})();
