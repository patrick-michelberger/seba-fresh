'use strict';

class NavbarController {
  isCollapsed = true;

  constructor($rootScope, $state, $scope, FirebaseAuth, socket, $timeout, $log, $mdSidenav, DialogService, ShopService, FirebaseUser, FirebaseCart) {
    var self = this;
    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$log = $log;
    this.carts = [];
    this.$mdSidenav = $mdSidenav;
    this.DialogService = DialogService;
    this.ShopService = ShopService;
    this.toggleLeft = this.buildDelayedToggler('left');
    this.FirebaseAuth = FirebaseAuth;
    this.openCart = this.open;
    this.socket = socket;
    this.logout = this.logout;

    FirebaseAuth.$onAuthStateChanged((authUser) => {
      self.authUser = authUser;
    });

    FirebaseUser.getUser().then((user) => {
      self.currentUser = user;
    });

    FirebaseCart.getCurrentCart().then((currentCart) => {
      self.currentCart = currentCart;
    });
  }

  $onInit() {
    var self = this;
    this.socket.syncUpdates('cart', this.carts);
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
