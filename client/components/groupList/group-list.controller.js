'use strict';

class GroupListController {

  constructor() {
    this.isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }
  }
}

angular.module('sebaFreshApp')
  .controller('GroupListController', GroupListController);
