'use strict';

class GroupListController {

  constructor($scope) {
    this.groups = $scope.groups;
  }
}

angular.module('sebaFreshApp')
  .controller('GroupListController', GroupListController);
