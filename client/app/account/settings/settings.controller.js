'use strict';

class SettingsController {
  constructor(FirebaseUser, $scope, $timeout) {
    this.error = false;
    this.submitted = false;
    this.currentUser = FirebaseUser.getCurrentUser();
    this.message = "";

    this.user = {};
    this.changePassword = this.changePassword;
    this.$scope = $scope;
    this.$timeout = $timeout;
  }

  changePassword() {
    const self = this;
    this.submitted = true;
    this.errors = false;
    self.message = "Updating password ...";

    this.currentUser.auth.updatePassword(this.user.password).then(function() {
      // Update successful.
      self.$scope.$apply(() => {
        self.submitted = false;
        self.user.password = "";
        self.message = 'Password successfully changed.';
        self.$timeout(() => {
          self.message = '';
        }, 2000);
      });
    }, function(error) {
      // An error happened.
      self.errors = error;
      self.submitted = false;
      self.user.password = "";
      self.message = 'Invalid password.';
      self.$timeout(() => {
        self.message = '';
      }, 2000);
    });
  }
}

angular.module('sebaFreshApp')
  .controller('SettingsController', SettingsController);
