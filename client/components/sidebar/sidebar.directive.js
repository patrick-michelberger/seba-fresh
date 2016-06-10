'use strict';

angular.module('sebaFreshApp')
  .directive('sidebar', () => ({
    templateUrl: 'components/sidebar/sidebar.html',
    restrict: 'E',
    controller: 'SidebarController',
    controllerAs: 'vm'
  }));
