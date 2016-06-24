'use strict';

class NavbarController {
  isCollapsed = true;

  constructor(Auth, $timeout, $log, $mdSidenav, DialogService) {
    this.$timeout = $timeout;
    this.$log = $log;
    this.$mdSidenav = $mdSidenav;
    this.DialogService = DialogService;

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.toggleLeft = this.buildDelayedToggler('left');
    this.openCart = this.open;
  }

  /**
   * Close sidebar
   */
  close() {
    var self = this;
    this.$mdSidenav('left').close()
      .then(function () {});
  }

  open() {
    var self = this;
    this.$mdSidenav('right').open()
      .then(function () {});
  }


  openCart() {
    this.DialogService.showAlert("hallo", "welt", "test");
  }

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var self = this,
        args = Array.prototype.slice.call(arguments);
      self.$timeout.cancel(timer);
      timer = self.$timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  /**
   * Build handler to open/close a SideNav
   */
  buildDelayedToggler(navID) {
    var self = this;
    return self.debounce(function () {
      self.$mdSidenav(navID)
        .toggle()
        .then(function () {});
    }, 200);
  }
}

angular.module('sebaFreshApp')
  .controller('NavbarController', NavbarController);
