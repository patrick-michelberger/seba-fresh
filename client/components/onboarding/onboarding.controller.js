'use strict';

class OnboardingController {

  constructor($http, $timeout, socket, $scope, $rootScope) {
    var self = this;
    this.groups = [];
    this.socket = socket;
    this.$http = $http;
    this.$timeout = $timeout;
    this.selectedIndex = 0;
    this.showSuccessMessage = false;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('group');
    });

    $rootScope.$on('onboarding:next', function () {
      self.showSuccessMessage = true;
      self.$timeout(function () {
        self.showSuccessMessage = false;
        //self._updateIndex();
      }, 1500);
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
    console.log("update index");
    if (this.groups && this.groups[0]) {
      this.selectedIndex = 1;
    }
  }

}

angular.module('sebaFreshApp')
  .controller('OnboardingController', OnboardingController);
