'use strict';

class SidebarController {
  constructor(Auth, $mdSidenav) {
    this.$mdSidenav = $mdSidenav;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  /**
   * Close sidebar
   */
  close() {
    var self = this;
    this.$mdSidenav('left').close()
      .then(function () {});
  }
}

angular.module('sebaFreshApp')
  .controller('SidebarController', NavbarController);
