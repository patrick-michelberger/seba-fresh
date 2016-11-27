'use strict';

(function() {

  class MainController {

    constructor($state, FirebaseAuth) {
      const currentUser = FirebaseAuth.$getAuth();
      // TODO Do we still need a further check !user.friendsInvited?
      if (currentUser) {
        $state.go('onboarding');
      }
    }
  }

  angular.module('sebaFreshApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController,
      controllerAs: 'vm'
    });

})();
