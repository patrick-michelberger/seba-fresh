'use strict';

class OauthButtonsCtrl {

  constructor($state, $stateParams, $location, FirebaseAuth, FirebaseUser) {
    this.$stateParams = $stateParams;
    this.FirebaseAuth = FirebaseAuth;
    this.FirebaseUser = FirebaseUser;
    this.$state = $state;
    this.$location = $location;
    this.redirectUrl = $stateParams.redirectUrl || false;

  }

  register(provider) {
    this.FirebaseAuth.$signInWithRedirect(provider);
  }
}

angular.module('sebaFreshApp.oauth-buttons')
  .controller('OauthButtonsCtrl', OauthButtonsCtrl);
