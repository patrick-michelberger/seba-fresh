'use strict';

class GroupListController {

  constructor($scope, $rootScope) {
    this.isMobile = false;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }
  }
}

angular.module('sebaFreshApp')
  .controller('GroupListController', GroupListController);
