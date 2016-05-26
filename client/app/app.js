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
  'validation.match',
  'ngAnimate',
  'ngMaterial'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
