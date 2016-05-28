'use strict';

angular.module('sebaFreshApp.oauth-buttons')
  .controller('OauthButtonsCtrl', function($window, $state, $location) {
    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
    this.$state = $state;
  });
