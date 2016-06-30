'use strict';

class LoginController {
  constructor(Auth, $state, $stateParams, ShopService) {
    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.Auth = Auth;
    this.ShopService = ShopService;
    this.$state = $state;
    this.redirectUrl = $stateParams.redirectUrl || false;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
          email: this.user.email,
          password: this.user.password
        })
        .then((user) => {
          ShopService.queryCart();
          // Logged in, redirect to home
          if (self.redirectUrl) {
            self.$location.path(self.$stateParams.redirectUrl);
          } else {
            if (!user.friendsInvited) {
              this.$state.go('onboarding');
            } else {
              this.$state.go('products');
            }
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
