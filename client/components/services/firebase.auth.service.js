'use strict';

(function() {
  function FirebaseAuthService($firebaseAuth) {
    return $firebaseAuth();
  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseAuth', ["$firebaseAuth", FirebaseAuthService]);
})();
