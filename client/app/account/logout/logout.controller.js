'use strict';

class LogoutController {
  constructor($rootScope, FirebaseAuth, FirebaseUser) {
    this.FirebaseAuth = FirebaseAuth;
    this.FirebaseUser = FirebaseUser;
    this.$rootScope = $rootScope;
    this.logout = this.logout;
    this.logout();
  }

  logout() {
    const self = this;
    // destroy all firebase refs
    angular.forEach(window.openFirebaseConnections, function(item) {
      item.$destroy();
    });
    self.FirebaseUser.logoutUser();
    self.FirebaseAuth.$signOut();
  }
}

angular.module('sebaFreshApp')
  .controller('LogoutController', LogoutController);
