'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('join', {
        url: '/join',
        template: '<join></join>'
      });
  });
