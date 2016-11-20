'use strict';

class NavbarController {
  isCollapsed = true;

  constructor($rootScope, $scope, FirebaseAuth, socket, $timeout, $log, $mdSidenav, DialogService, ShopService, FirebaseCart) {
    var self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$log = $log;
    this.carts = [];
    this.$mdSidenav = $mdSidenav;
    this.DialogService = DialogService;
    this.ShopService = ShopService;
    this.currentCart = FirebaseCart.getCurrentCart();
    this.toggleLeft = this.buildDelayedToggler('left');
    this.FirebaseAuth = FirebaseAuth;
    this.openCart = this.open;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('cart');
    });

    this.FirebaseAuth.$onAuthStateChanged(function(firebaseUser) {
      self.currentUser = firebaseUser;
    });
  }

  $onInit() {
    var self = this;
    this.socket.syncUpdates('cart', this.carts);
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
