'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor($state, $stateParams, $location, ShopService, FirebaseAuth) {
    this.$stateParams = $stateParams;
    this.FirebaseAuth = FirebaseAuth;
    this.$state = $state;
    this.$location = $location;
    this.ShopService = ShopService;
    this.redirectUrl = $stateParams.redirectUrl || false;
  }

  register(form) {
    var self = this;
    this.submitted = true;
    console.log("redirectUrl: ", self.redirectUrl);

    if (form.$valid) {
      this.FirebaseAuth.$createUserWithEmailAndPassword(this.user.email, this.user.password).then((user) => {
        return user.updateProfile({
          displayName: self.user.first_name + " " + self.user.last_name
        });
      }).then((user) => {
        // TODO self.ShopService.queryCart();
        if (self.redirectUrl) {
          self.$location.path(self.$stateParams.redirectUrl);
        } else {
          if (!user.friendsInvited) {
            self.$state.go('onboarding');
          } else {
            self.$state.go('products');
          }
        }
      }).catch((error) => {
        self.errors.other = error.message;
      });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('SignupController', SignupController);
