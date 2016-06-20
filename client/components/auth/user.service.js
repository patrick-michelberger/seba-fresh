'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      changeFriendsInvited: {
        method: 'PUT',
        params: {
          controller: 'friendsInvited'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      getFriends: {
        method: 'GET',
        params: {
          id: 'me',
          controller: 'friends'
        }
      }
    });
  }

  angular.module('sebaFreshApp.auth')
    .factory('User', UserResource);

})();
