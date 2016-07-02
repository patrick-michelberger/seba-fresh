'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('carts', {
        url: '/carts',
        template: '<carts></carts>'
      });
  });
