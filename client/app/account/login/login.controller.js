'use strict';

class LoginController {
  constructor($state, $stateParams, FirebaseAuth) {
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.$state = $state;
    this.redirectUrl = $stateParams.redirectUrl || false;
    this.FirebaseAuth = FirebaseAuth;
  }

  login(form) {
    var self = this;
    this.submitted = true;

    if (form.$valid) {
      this.FirebaseAuth.$signInWithEmailAndPassword(this.user.email, this.user.password).then((user) => {
        // Logged in, redirect to home
        if (self.redirectUrl) {
          self.$location.path(self.$stateParams.redirectUrl);
        } else {
          if (!user.friendsInvited) {
            self.$state.go('onboarding');
          } else {
            self.$state.go('products');
          }
        }
      }).catch(function(error) {
        console.log("Error: ", error);
        self.errors.other = error.message;
      });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('LoginController', LoginController);
