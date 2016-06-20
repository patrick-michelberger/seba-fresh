'use strict';

class OnboardingController {

  constructor($http, $timeout, socket, $scope, $rootScope, Auth) {
    var self = this;
    this.groups = [];
    this.socket = socket;
    this.$http = $http;
    this.$timeout = $timeout;
    this.selectedIndex = 0;
    this.showSuccessMessage = false;
    this.Auth = Auth;
    this.getCurrentUser = Auth.getCurrentUser;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('group');
    });

    $rootScope.$on('onboarding:next', function () {
      self.showSuccessMessage = true;
      self.$timeout(function () {
        self.showSuccessMessage = false;
        self._updateIndex();
      }, 1500);
    });

    $rootScope.$on('onboarding:invited', function () {
      self.Auth.changeFriendsInvited(true);
      self.selectedIndex = 2;
    });
  }

  $onInit() {
    var self = this;
    this.$http.get('/api/groups').then(response => {
      self.groups = response.data;
      self.socket.syncUpdates('group', this.groups);
      self._updateIndex();
    });
  }

  disableInviteFriends() {
    var result = !this.groups || !this.groups[0];
    return result;
  }

  _updateIndex() {
    if (this.groups && this.groups[0] && this.getCurrentUser().friendsInvited) {
      this.selectedIndex = 2;
    } else if (this.groups && this.groups[0]) {
      this.selectedIndex = 1;
    } else {
      this.selectedIndex = 0;
    }
  }

}

angular.module('sebaFreshApp')
  .controller('OnboardingController', OnboardingController);
