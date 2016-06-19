'use strict';

angular.module('sebaFreshApp')
  .directive('groups', function () {
    return {
      templateUrl: 'components/groups/groups.html',
      restrict: 'E',
      link: function (scope, element, attrs) {},
      controller: 'GroupsController',
      controllerAs: 'groupsCtrl'
    };
  });
