'use strict';

angular.module('sebaFreshApp.oauth-buttons')
  .controller('OauthButtonsCtrl', function($window, $state, $location, FirebaseAuth) {
    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
    this.$state = $state;
    this.FirebaseAuth = FirebaseAuth;
  });
