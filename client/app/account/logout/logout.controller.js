'use strict';

class LogoutController {
  constructor($rootScope, FirebaseAuth) {
    this.FirebaseAuth = FirebaseAuth;
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
    self.FirebaseAuth.$signOut();
  }
}

angular.module('sebaFreshApp')
  .controller('LogoutController', LogoutController);
