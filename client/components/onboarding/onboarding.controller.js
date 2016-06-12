'use strict';

class OnboardingController {

  constructor($http, socket, $scope, $rootScope) {
    var self = this;
    this.groups = [];
    this.socket = socket;
    this.$http = $http;
    this.selectedIndex = 0;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('group');
    });

    $rootScope.$on('onboarding:next', function () {
      console.log("next slide...");
      self._updateIndex();
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
    return !this.groups || !this.groups[0];
  }

  _updateIndex() {
    if (this.groups && this.groups[0]) {
      this.selectedIndex = 1;
    }
  }

}

angular.module('sebaFreshApp')
  .controller('OnboardingController', OnboardingController);
