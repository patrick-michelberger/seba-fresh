'use strict';

(function () {

  class MainController {

    constructor($http, $state, $scope, socket, Auth) {
      this.$http = $http;
      this.socket = socket;
      this.isLoggedIn = Auth.isLoggedIn;
      this.getCurrentUser = Auth.getCurrentUser;


      // Check for user status
      var user = this.getCurrentUser();
      if (user.onboardingRequired) {
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
