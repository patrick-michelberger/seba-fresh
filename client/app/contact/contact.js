'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('contact', {
        url: '/contact',
        template: '<contact></contact>'
      });
  });
