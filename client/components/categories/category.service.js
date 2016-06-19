'use strict';

(function () {

  function CategoryResource($resource) {
    return $resource('/api/categories/:id/:controller', {
      id: '@_id'
    }, {
      get: {
        method: 'GET'
      }
    });
  }

  angular.module('sebaFreshApp.assortment')
    .factory('CategoryService', CategoryResource);

})();
