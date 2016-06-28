'use strict';

class NavbarController {
  isCollapsed = true;

  constructor($scope, Auth, socket, $timeout, $log, $mdSidenav, DialogService, ShopService) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$log = $log;
    this.carts = [];
    this.$mdSidenav = $mdSidenav;
    this.DialogService = DialogService;
    this.ShopService = ShopService;
    this.currentCart = {};
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.toggleLeft = this.buildDelayedToggler('left');

    this.openCart = this.open;
    this.socket = socket;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('cart');
    });
  }

  $onInit() {
    var self = this;
    this.$scope.$watch(function () {
      return self.ShopService.getCurrentCart();
    }, function (currentCart) {
      console.log("currentCart: ", currentCart);
      self.currentCart = currentCart;
    });

    this.socket.syncUpdates('cart', this.carts);
  }

  /**
   * Close sidebar
   */
  close() {
    var self = this;
    this.$mdSidenav('left').close()
      .then(function () {});
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
