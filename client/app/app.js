'use strict';

angular.module('sebaFreshApp', [
  'sebaFreshApp.auth',
  'sebaFreshApp.admin',
  'sebaFreshApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
