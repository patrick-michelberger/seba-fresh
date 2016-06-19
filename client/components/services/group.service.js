'use strict';

(function () {

  function GroupResource($resource) {
    return $resource('/api/groups/:id/:controller', {
      id: '@_id'
    }, {
      acceptInvitation: {
        method: 'POST',
        params: {
          controller: 'accept'
        }
      }
    });
  }

  angular.module('sebaFreshApp.services')
    .factory('Group', GroupResource);
})();
