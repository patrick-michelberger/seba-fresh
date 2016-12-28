'use strict';

class GroupCellController {

  constructor($rootScope, $scope, $window, FirebaseAuth, FirebaseCart, FirebaseInvitationService, $mdDialog, $mdMedia, $timeout, DialogService) {
    this.baseShareUrl = location.protocol + '//' + location.hostname + ':' + location.port;
    this.DialogService = DialogService;
    this.FirebaseAuth = FirebaseAuth;
    this.$window = $window;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.FirebaseCart = FirebaseCart;
    this.FirebaseInvitationService = FirebaseInvitationService;
    this.isAdmin = FirebaseCart.userIsAdmin;

    this.currentUser = FirebaseAuth.$getAuth();
  }

  deleteCart(cart) {
    this.FirebaseCart.deleteCart(cart.id);
  }

  buyGroceries() {
    this.$rootScope.$emit('onboarding:next', 2);
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
      },
      function() {
        console.log('You cancelled the dialog.');
      });
    self.$scope.$watch(function() {
      return self.$mdMedia('xs') || self.$mdMedia('sm');
    }, function(wantsFullScreen) {
      self.customFullscreen = (wantsFullScreen === true);
    });
  }
}

angular.module('sebaFreshApp')
  .controller('GroupCellController', GroupCellController);
