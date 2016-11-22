'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor($state, $stateParams, $location, ShopService, FirebaseAuth, FirebaseUser) {
    this.$stateParams = $stateParams;
    this.FirebaseAuth = FirebaseAuth;
    this.FirebaseUser = FirebaseUser;
    this.$state = $state;
    this.$location = $location;
    this.ShopService = ShopService;
    this.redirectUrl = $stateParams.redirectUrl || false;
  }

  register(form) {
    var self = this;
    this.submitted = true;

    if (form.$valid) {
      this.FirebaseAuth.$createUserWithEmailAndPassword(this.user.email, this.user.password).then((user) => {
        return user.updateProfile({
          displayName: self.user.first_name + " " + self.user.last_name
        });
      }).then((user) => {
        const currentUser = self.FirebaseAuth.$getAuth();
        return self.FirebaseUser.createUser(currentUser).then((user) => {
          if (self.redirectUrl) {
            self.$location.path(self.$stateParams.redirectUrl);
          } else {
            if (!user.friendsInvited) {
              self.$state.go('onboarding');
            } else {
              self.$state.go('products');
            }
          }
        });
      }).catch((error) => {
        self.errors.other = error.message;
      });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('SignupController', SignupController);
