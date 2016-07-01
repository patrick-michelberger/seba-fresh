'use strict';

angular.module('sebaFreshApp')
  .directive('categoryMenu', () => ({
    templateUrl: 'components/categoryMenu/categoryMenu.html',
    restrict: 'E',
    controller: 'CatergoryMenuController',
    controllerAs: 'categoryCtrl'
  }));

  // .directive('categoryMenu', function () {
  //   return {
  //     templateUrl: 'components/categoryMenu/categoryMenu.html',
  //     restrict: 'EA',
  //     link: function (scope, element, attrs) {
  //     }
  //   };
  // });
