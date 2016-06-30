'use strict';
(function () {

  class JoinComponent {
    constructor($scope, $stateParams, $timeout, $state, Group, $mdDialog, $mdMedia, NgMap, Auth) {
      var self = this;
      var groupId = $stateParams.groupId;
      this.$mdDialog = $mdDialog;
      this.$mdMedia = $mdMedia;
      this.$scope = $scope;
      this.Group = Group;
      this.isLoggedIn = Auth.isLoggedIn;
      this.getCurrentUser = Auth.getCurrentUser;
      this.$state = $state;
      this.NgMap = NgMap;
      this.$timeout = $timeout;
      this.refreshMap = true;
      Group.get({
        id: groupId
      }, function (group) {
        self.group = group;
      });
    }
    showJoinGroupDialog(ev) {
      var self = this;
      var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.customFullscreen;

      function DialogController($scope, $state, $mdDialog) {
        $scope.group = self.group;
        $scope.refreshMap = self.refreshMap;
        $scope.decline = function () {
          $mdDialog.hide();
          if (self.isLoggedIn()) {
            self.Group.declineInvitation($scope.group._id);
          } else {
            $state.go('login', {
              'redirectUrl': '/group/' + $scope.group._id + '/decline'
            });
          }
        };
        $scope.accept = function () {
          $mdDialog.cancel();
          if (self.isLoggedIn()) {
            return self.Group.acceptInvitation({
              id: self.group._id
            }, {
              id: self.getCurrentUser()._id
            }, function () {
              console.log("Success");
            }, function (err) {
              console.log("error: ", err);
            }).$promise;
          } else {
            console.log("redirect to signup...");
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
        controller: ['$scope', '$state', '$mdDialog', DialogController],
        onShowing: function () {
          self.refreshMap = false;
          self.$timeout(function () {
            self.refreshMap = true;
            self.NgMap.getMap().then(function (map) {
              google.maps.event.trigger(map, 'resize');
            });
          }, 0);
        },
        bindToController: true,
      });
      self.$scope.$watch(function () {
        return self.$mdMedia('xs') || self.$mdMedia('sm');
      }, function (wantsFullScreen) {
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
