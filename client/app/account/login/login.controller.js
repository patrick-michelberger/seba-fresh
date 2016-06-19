'use strict';

class LoginController {
  constructor(Auth, $state) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
          email: this.user.email,
          password: this.user.password
        })
        .then((user) => {
          // Logged in, redirect to home
          if (user.onboardingRequired) {
            this.$state.go('onboarding');
          } else {
            this.$state.go('products');
          }
        })
        .catch(err => {
          this.errors.other = err.message;
        });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('LoginController', LoginController);
