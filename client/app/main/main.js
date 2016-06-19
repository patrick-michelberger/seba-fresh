'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>',
        data: {
          transparentNavbar: true
        }
      });
  });
