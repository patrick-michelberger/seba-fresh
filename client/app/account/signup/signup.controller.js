'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $state, $stateParams, $location) {
    console.log("$stateParams: ", $stateParams);
    this.$stateParams = $stateParams;
    this.Auth = Auth;
    this.$state = $state;
    this.$location = $location;
  }

  register(form) {
    var self = this;
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          console.log("redirectUrl: ", self.$stateParams);
          // Account created, redirect to next page
          if (self.$stateParams.redirectUrl) {
            console.log("redirect to ", self.$stateParams.redirectUrl);
            self.$location.path(self.$stateParams.redirectUrl);
          } else {
            self.$state.go('products');
          }
        })
        .catch(err => {
          err = err.data;
          self.errors = {};
          console.log("err: ", err.data);

          // Update validity of form fields that match the mongoose errors
          /*angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            self.errors[field] = error.message;
          });*/
        });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('SignupController', SignupController);
