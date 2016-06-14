'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('join', {
        url: '/join/:groupId/:userId',
        template: '<join></join>'
      });
  });
