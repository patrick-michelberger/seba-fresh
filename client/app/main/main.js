'use strict';

angular.module('sebaFreshApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        abstract: true,
        template: '<main></main>'
      })
      .state('main.home', {
        url: '',
        views: {
          'products': {
            template: '<products/>',
          }
        }
      })
      .state('categories', {
        url: '/categories',
        abstract: true,
        template: '<main></main>'
      })
      .state('categories.single', {
        url: '/{categoryId}/{categoryName}/',
        views: {
          'products': {
            template: '<products/>',
          }
        }
      });
  });
