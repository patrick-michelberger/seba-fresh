'use strict';

(function() {

  function AssortmentService($rootScope, Util, ProductService) {
    var safeCb = Util.safeCb;
    var products = [];

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
          return safeCb(callback)(product);
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
      fetchAll(categoryId, callback)  {
        var query = {};
        if (categoryId) {
          query.categoryId = categoryId;
        }

        return ProductService.query(query, function(data) {
          products = data;
          return safeCb(callback)(null, products);
        }, function() {
          return safeCb(callback)(null, []);
        });
      },
    };

    return Assortment;
  }

  angular.module('sebaFreshApp.assortment')
    .factory('AssortmentService', AssortmentService);

})();
