'use strict';

angular.module('sebaFreshApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('test', {
        url: '/test',
        template: '<test></test>'
      });
  });
