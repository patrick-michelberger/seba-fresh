'use strict';
(function() {

  class JoinComponent {
    constructor($scope, $stateParams, $timeout, $state, Group, $mdDialog, $mdMedia, NgMap, Auth, ShopService) {
      var self = this;
      var groupId = $stateParams.groupId;
      this.$mdDialog = $mdDialog;
      this.$mdMedia = $mdMedia;
      this.$scope = $scope;
      this.Group = Group;
      this.ShopService = ShopService;
      this.isLoggedIn = Auth.isLoggedIn;
      this.getCurrentUser = Auth.getCurrentUser;
      this.$state = $state;
      this.NgMap = NgMap;
      this.$timeout = $timeout;
      this.refreshMap = true;
      /*Group.get({
        id: groupId
      }, function (group) {
        self.group = group;
      });*/
    }
    showJoinGroupDialog(ev) {
      var self = this;
      var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.customFullscreen;

      function DialogController($rootScope, $scope, $state, $mdDialog) {
        $scope.group = self.group;
        $scope.refreshMap = self.refreshMap;
        $scope.decline = function() {
          $mdDialog.hide();
          if (self.isLoggedIn()) {
            self.Group.declineInvitation($scope.group._id);
          } else {
            $state.go('login', {
              'redirectUrl': '/group/' + $scope.group._id + '/decline'
            });
          }
        };
        $scope.accept = function() {
          $mdDialog.cancel();
          if (self.isLoggedIn()) {
            return self.Group.acceptInvitation({
              id: self.group._id
            }, {
              id: self.getCurrentUser()._id
            }, function() {
              self.ShopService.queryCart();
              $state.go('products');
            }, function(err) {
              // TODO Error Page
              console.log("error: ", err);
            }).$promise;
          } else {
            $state.go('signup', {
              'redirectUrl': '/group/' + $scope.group._id + '/accept'
            });
          }
        };
      }

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
