'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        template: '<onboarding></onboarding>',
        authenticate: true
      });
  });
