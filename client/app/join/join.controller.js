'use strict';
(function() {

  class JoinComponent {
    constructor($scope, $stateParams, $timeout, $state, $mdDialog, $mdMedia, NgMap, FirebaseInvitationService, FirebaseAuth) {
      var self = this;
      var invitationId = $stateParams.invitationId;
      this.$mdDialog = $mdDialog;
      this.$mdMedia = $mdMedia;
      this.$scope = $scope;
      this.FirebaseInvitationService = FirebaseInvitationService;
      this.FirebaseAuth = FirebaseAuth;
      this.$state = $state;
      this.NgMap = NgMap;
      this.$timeout = $timeout;
      this.refreshMap = true;
      this.invitation = FirebaseInvitationService.get(invitationId);
    }

    /**
     * Show confirmation dialog
     */
    showJoinGroupDialog(ev) {
      var self = this;
      var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.customFullscreen;



      /**
       * Dialog Controller
       */
      function DialogController($rootScope, $scope, $state, $mdDialog) {
        $scope.invitation = self.invitation;
        $scope.refreshMap = self.refreshMap;

        /**
         * Decline invitation
         *
         * @return {Promise}
         */
        $scope.decline = function() {
          const currentUser = self.FirebaseAuth.$getAuth();
          $mdDialog.hide();
          if (currentUser) {
            return self.FirebaseInvitationService.decline(self.invitation.id).catch((err) => {
              console.log("error: ", err);
            });
          } else {
            $state.go('login', {
              'redirectUrl': '/invitations/' + $scope.invitation.id + '/decline'
            });
          }
        };

        /**
         * Accept invitation
         *
         * @return {Promise}
         */
        $scope.accept = function() {
          const currentUser = self.FirebaseAuth.$getAuth();
          $mdDialog.cancel();
          if (currentUser) {
            return self.FirebaseInvitationService.accept(self.invitation.id).then(() => {
              $state.go('products');
            }).catch((err) => {
              console.log("error: ", err);
            });
          } else {
            $state.go('signup', {
              'redirectUrl': '/invitations/' + $scope.invitation.id + '/accept'
            });
          }
        };
      }

      // open confirmation dialog
      this.$mdDialog.show({
        templateUrl: 'assets/templates/join-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: useFullScreen,
        controller: ['$rootScope', '$scope', '$state', '$mdDialog', DialogController],
        onShowing: function() {
          self.refreshMap = false;
          self.$timeout(function() {
            self.refreshMap = true;
            self.NgMap.getMap().then(function(map) {
              google.maps.event.trigger(map, 'resize');
            });
          }, 0);
        },
        bindToController: true,
      });
      self.$scope.$watch(function() {
        return self.$mdMedia('xs') || self.$mdMedia('sm');
      }, function(wantsFullScreen) {
        self.customFullscreen = (wantsFullScreen === true);
      });
    }
  }

  angular.module('sebaFreshApp')
    .component('join', {
      templateUrl: 'app/join/join.html',
      controller: JoinComponent,
      controllerAs: 'vm'
    });

})();
