'use strict';

class GroupListController {

  constructor($scope, $rootScope, ShopService) {
    this.isMobile = false;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.ShopService = ShopService;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }
  }

  $onInit() {
    var self = this;
    this.$rootScope.$on('group:deleted', function () {
      console.log("group deleted: ", self.$scope.groups.length);
      if (self.$scope.groups.length < 2) {
        console.log("ShopService clear");
        self.ShopService.clear();
      }
    });
  }
}

angular.module('sebaFreshApp')
  .controller('GroupListController', GroupListController);
