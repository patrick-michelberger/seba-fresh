'use strict';

(function () {

  function CartResource($resource) {
    return $resource('/api/carts/:id/:controller', {
      id: '@_id'
    }, {
      add: {
        method: 'PUT',
        params: {
          controller: 'add'
        }
      }
    });
  }

  angular.module('sebaFreshApp.shop')
    .factory('Cart', CartResource);

})();
