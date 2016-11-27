'use strict';

class SidebarController {
  constructor(FirebaseAuth, $mdSidenav) {
    this.$mdSidenav = $mdSidenav;
    this.currentUser = FirebaseAuth.$getAuth();
  }

  /**
   * Close sidebar
   */
  close() {
    var self = this;
    this.$mdSidenav('left').close()
      .then(function() {});
  }
}

angular.module('sebaFreshApp')
  .controller('SidebarController', NavbarController);
