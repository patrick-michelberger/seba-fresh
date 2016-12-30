'use strict';

class ForgotpasswordController {
  constructor($timeout, FirebaseAuth) {
    this.user = {};
    this.submitted = false;
    this.FirebaseAuth = FirebaseAuth;
    this.$timeout = $timeout;
  }

  reset(form) {
    var self = this;
    this.submitted = true;
    self.message = "Sending ...";

    this.FirebaseAuth.$sendPasswordResetEmail(this.user.email).then(() => {
      self.submitted = false;
      self.message = 'Reset email successfully sent.';
      self.$timeout(() => {
        self.message = '';
      }, 2000);
    }, () => {
      self.submitted = false;
      self.message = 'Invalid email';
      self.$timeout(() => {
        self.message = '';
      }, 2000);
    });
  }
}

angular.module('sebaFreshApp')
  .controller('ForgotpasswordController', ForgotpasswordController);
