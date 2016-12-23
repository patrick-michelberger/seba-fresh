'use strict';

class ShoppingCartController {

  constructor($rootScope, $scope, $state, $window, $timeout, FirebaseAuth, FirebaseUser, FirebaseCart, FirebaseInvitationService, $mdDialog, $mdMedia, DialogService) {
    var self = this;

    // Dependencies
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$state = $state;
    this.$mdMedia = $mdMedia;
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;

    this.DialogService = DialogService;
    this.FirebaseAuth = FirebaseAuth;
    this.FirebaseCart = FirebaseCart;

    // Dynamic attributes
    this.freeShipping = false;
    this.hidePaymentView = false;
    this.carts = FirebaseCart.getCarts();
    this.currentUserItems = [];
    this.flatmatesItems = [];

    this.users = FirebaseCart.getUsers();
    this.products = FirebaseCart.getProducts();
    this.currentUser = FirebaseUser.getCurrentUser();

    this.FirebaseInvitationService = FirebaseInvitationService;

    // Methods
    this.calculateOrderValue = this.calculateOrderValue;
    this.calculateOrderAmount = this.calculateOrderAmount;
    this._emitChangeEvent = this._emitChangeEvent;
    this.getNumberOfMembers = this.getNumberOfMembers;
    this.sendPaymentRequest = this.sendPaymentRequest;
    this.pay = this.pay;
    this.onHidePaymentView = this.onHidePaymentView;
    this.showInviteDialog = this.showInviteDialog;
  }

  sendPaymentRequest(uid) {
    this.DialogService.showPaymentRequestModal(this.carts.current, uid);
  }

  onHidePaymentView() {
    this.hidePaymentView = !this.hidePaymentView;
  }

  pay() {
    const userId = this.currentUser.auth.uid;
    this.DialogService.showPayModal(this.carts.current, userId);
  }

  _getAddToCartUrl(cart) {
    var items = "";
    var users = this.users.current;
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var userItems = this.products.current[user.uid];

      angular.forEach(userItems, (item, itemId) => {
        var quantity = item.quantity;
        items += item.item.id + "|" + quantity;
        items += ',';
      });
    }
    if (items.length < 1) {
      return false;
    }
    return encodeURI("http://affil.walmart.com/cart/addToCart?items=" + items + "&affp1=|apk|&affilsrc=api&veh=aff&wmlspartner=readonlyapi");
  }

  checkout() {
    var url = this._getAddToCartUrl(this.carts.current);
    if (url) {
      window.open(url, '_blank');
    }
  }

  addToCart(product) {
    const self = this;

    if (!product ||  !this.carts.current) {
      this.$state.go('login');
      return;
    }

    this._emitChangeEvent(product.id, true);
    return this.FirebaseCart.addItem(this.carts.current.id, product).then(() => {
      self._emitChangeEvent(product.id, false);
    });
  }

  removeFromCart(product) {
    const self = this;

    if (!product ||  !this.carts.current) {
      this.$state.go('login');
      return;
    }

    this._emitChangeEvent(product.id, true);
    return this.FirebaseCart.removeItem(this.carts.current.id, product).then(() => {
      self._emitChangeEvent(product.id, false);
    });
  }

  calculateOrderValue(uid) {
    return this.FirebaseCart.getOrderValue(uid);
  }

  calculateOrderAmount(uid) {
    return this.FirebaseCart.getOrderQuantity(uid);
  }

  calculatedGroupedItems(users) {
    var currentUserItems = [];
    var flatmates = {};
    var currentUser = FirebaseAuth.$getAuth();
    var currentUserIndex = _.findIndex(users, {
      "_id": currentUser._id
    });
    if (currentUserIndex > -1) {
      currentUserItems = users[currentUserIndex].items;
      // make copy
      users = users.slice();
      users.splice(currentUserIndex, 1);
    }
    return {
      "currentUser": currentUserItems,
      "flatmates": users
    };
  }

  isCurrentUser(userId) {
    return this.currentUser.auth.uid === userId;
  }

  isGroupAdmin() {
    if (!this.carts || !this.carts.current || !this.currentUser.auth) {
      return false;
    }
    return this.currentUser.auth.uid === this.carts.current.createdByUserId;
  }

  /**
   * Trigger recompile for an individual product item
   *
   * @param {String} productId Description
   * @param {Boolean} isLoading
   *
   */
  _emitChangeEvent(productId, isLoading) {
    if (!productId) {
      return;
    }
    this.$rootScope.$broadcast('cart:add:' + productId);
    this.isLoading = isLoading;
  }

  /**
   * Show Flatmate invitation dialog
   * @params group
   */
  showInviteDialog(group) {
    var ev = this.$event;
    var self = this;
    var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.customFullscreen;

    function DialogController($scope, $state, $mdDialog, $window, FirebaseCart) {
      $scope.group = group;
      $scope.invitee = {};
      $scope.refreshMap = self.refreshMap;
      $scope.isSending = false;


      $scope.sendInvite = () => {
        $scope.isSending = true;
        const email = $scope.invitee.email;
        const cartId = $scope.group.id;

        self.FirebaseInvitationService.inviteUserByEmail(email, cartId).then(() => {
          self.$timeout(function() {
            $scope.isSending = false;
            var title = "We've sent an invitation link to " + email + "!";
            var content = "As soon as, the email has been confirmed. Your flatmate is added to your shopping cart.";
            var popupLabel = "Next";
            self.DialogService.showAlert(title, content, popupLabel);
          }, 300);
        }).catch((error) => {
          console.log("Error: ", error);
        });
      };

      $scope.sendEmail = function() {
        $scope.isSending = true;
        var email = $scope.invitee.email;
      };

      $scope.decline = function() {
        $mdDialog.cancel();
      };
      $scope.next = function() {
        $mdDialog.hide("next");
      };
      $scope.share = function(service) {
        var url = "";
        var shareUrl = this.baseShareUrl + '/group/' + group._id + '/invite';
        var refUrl = "";

        switch (service) {
          case "facebook":
            url = "http://m.facebook.com/sharer.php?u=" + shareUrl + "&redirect_uri=https://sebafresh.herokuapp.com/onboarding/inviteSent";
            break;
          case "whatsapp":
            url = "whatsapp://send?text=" + shareUrl;
            break;
          default:
            url = "mailto:?subject=LOVE this from ABOUT YOU!&amp;body=Hallo! Guck mal hier: auf " + shareUrl + " gefällt Dir bestimmt. Viel Spaß damit!";
        }
        $window.open(url, '_blank');
      }
    }
    this.$mdDialog.show({
      templateUrl: 'assets/templates/invite-dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: useFullScreen,
      controller: ['$scope', '$state', '$mdDialog', '$window', 'FirebaseCart', DialogController],
      bindToController: true,
    }).then(function(answer) {
      //self.$rootScope.$emit('onboarding:invited');
    });
    self.$scope.$watch(function() {
      return self.$mdMedia('xs') || self.$mdMedia('sm');
    }, function(wantsFullScreen) {
      self.customFullscreen = (wantsFullScreen === true);
    });
  }
};

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
