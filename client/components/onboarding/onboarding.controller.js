'use strict';

class OnboardingController {

  constructor($http, $timeout, socket, $scope, $rootScope, Auth) {
    var self = this;
    // dependencies
    this.socket = socket;
    this.$http = $http;
    this.$timeout = $timeout;
    this.Auth = Auth;

    // properties
    this.groups = [];
    this.selectedIndex = 0;
    this.showSuccessMessage = false;

    this.getCurrentUser = Auth.getCurrentUser;

    // event listeners
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('group');
    });

    $rootScope.$on('onboarding:next', function (event, index) {
      if (index) {
        self._setIndex(index);
      } else {
        self.showSuccessMessage = true;
        self.$timeout(function () {
          self.showSuccessMessage = false;
          self._updateIndex();
        }, 1500);
      }
    });

    $rootScope.$on('onboarding:invited', function () {
      self.Auth.changeFriendsInvited(true);
      self.showSuccessMessage = true;
      self.$timeout(function () {
        self.showSuccessMessage = false;
        self._updateIndex();
      }, 1500);
    });
  }

  // methods
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

  disableProducts() {
    var result = !this.groups || !this.groups[0] ||  !this.Auth.getCurrentUser().friendsInvited;
    return result;
  }

  disableCreateGroup() {
    var result = this.groups && this.groups[0];
    return result;
  }

  _setIndex(index) {
    this.selectedIndex = index;
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
