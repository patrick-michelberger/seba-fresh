'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('join', {
        url: '/group/:groupId',
        template: '<join></join>'
      })
      .state('join-invite', {
        url: '/group/:groupId/invite',
        template: '<join></join>'
      })
      .state('join-accept', {
        url: '/group/:groupId/accept',
        template: '<join></join>'
      })
      .state('join-decline', {
        url: '/group/:groupId/invite',
        template: '<join></join>'
      });
  });
