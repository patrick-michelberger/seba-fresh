'use strict';

angular.module('sebaFreshApp')
  .config(function($stateProvider) {
    $stateProvider
    /*.state('products', {
      url: '/products',
      template: '<products></products>'
    })
    */
      .state('productsDetail', {
      url: '/products/:productId',
      template: '<products></products>'
    });

  });
