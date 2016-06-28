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
      },
      remove: {
        method: 'PUT',
        params: {
          controller: 'remove'
        }
      }
    });
  }

  angular.module('sebaFreshApp.shop')
    .factory('Cart', CartResource);

})();
