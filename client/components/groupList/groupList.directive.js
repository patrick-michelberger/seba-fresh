'use strict';

angular.module('sebaFreshApp')
  .directive('groupList', function () {
    return {
      templateUrl: 'components/groupList/groupList.html',
      restrict: 'E',
      scope: {
        "groups": "="
      },
      controller: "GroupListController",
      controllerAs: "groupListCtrl",
      link: function (scope, element, attrs) {}
    };
  });
