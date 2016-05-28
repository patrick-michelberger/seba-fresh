'use strict';

angular.module('sebaFreshApp.oauth-buttons', [])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
