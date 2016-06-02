'use strict';

(function () {

  function ProductResource($resource) {
    return $resource('/api/products/:id/:controller', {
      id: '@_id'
    }, {
      get: {
        method: 'GET'
      }
    });
  }

  angular.module('sebaFreshApp.assortment')
    .factory('ProductService', ProductResource);

})();
