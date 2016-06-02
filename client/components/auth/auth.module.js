'use strict';

angular.module('sebaFreshApp.auth', [
  'sebaFreshApp.constants',
  'sebaFreshApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
