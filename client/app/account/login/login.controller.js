'use strict';

class LoginController {
  constructor($rootScope, $state, $stateParams, FirebaseAuth, FirebaseUser) {
    this.$rootScope = $rootScope;
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.$state = $state;
    this.redirectUrl = $stateParams.redirectUrl || false;
    this.FirebaseAuth = FirebaseAuth;
    this.currentUser = FirebaseUser.getCurrentUser();
  }

  login(form) {
    var self = this;
    this.submitted = true;

    if (form.$valid) {
      this.FirebaseAuth.$signInWithEmailAndPassword(this.user.email, this.user.password).then(() => {
        // Logged in, redirect to home
        if (self.redirectUrl) {
          self.$location.path(self.$stateParams.redirectUrl);
        } else {
          self.$state.go('onboarding');
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
