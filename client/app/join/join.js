'use strict';

angular.module('sebaFreshApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('join', {
        url: '/invitations/:invitationId',
        template: '<join></join>'
      })
      .state('join-invite', {
        url: '/invitations/:invitationId/invite',
        template: '<join></join>'
      })
      .state('join-accept', {
        url: '/invitations/:invitationId/accept',
        template: '<join></join>'
      })
      .state('join-decline', {
        url: '/invitations/:invitationId/invite',
        template: '<join></join>'
      });
  });
