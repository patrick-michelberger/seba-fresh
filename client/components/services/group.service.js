'use strict';

(function () {

  function GroupResource($resource) {
    return $resource('/api/groups/:id/:controller', {
      id: '@_id'
    }, {});
  }

  angular.module('sebaFreshApp.services')
    .factory('Group', GroupResource);
})();
