'use strict';

class NavbarController {

  constructor($rootScope, $scope, $state, $timeout, $mdSidenav, DialogService, FirebaseAuth, FirebaseUser, FirebaseCart) {
    var self = this;

    // Dependencies bindings
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$mdSidenav = $mdSidenav;

    this.DialogService = DialogService;
    this.FirebaseAuth = FirebaseAuth;

    // Attributes
    this.carts = [];

    // Method bindings
    this.toggleLeft = this.buildDelayedToggler('left');
    this.openCart = this.open;
    this.logout = this.logout;

    // Listeners
    FirebaseAuth.$onAuthStateChanged((authUser) => {
      self.authUser = authUser;
    });

    FirebaseUser.getUser().then((user) => {
      self.currentUser = user;
      FirebaseCart.getCurrentCart().then((currentCart) => {
        self.currentCart = currentCart;
      });
    });
  }

  logout() {
    this.$state.go('logout');
  }

  /**
   * Open right sidebar
   */
  open() {
    var self = this;
    this.$mdSidenav('right').open()
      .then(function() {});
  }

  /**
   * Close left sidebar
   */
  close() {
    var self = this;
    this.$mdSidenav('left').close()
      .then(function() {});
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
      timer = self.$timeout(function() {
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
    return self.debounce(function() {
      self.$mdSidenav(navID)
        .toggle()
        .then(function() {});
    }, 200);
  }
}

angular.module('sebaFreshApp')
  .controller('NavbarController', NavbarController);
