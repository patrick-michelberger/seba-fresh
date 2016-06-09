'use strict';

(function () {

  class MainController {

    constructor($http, $scope, socket, Auth) {
      this.$http = $http;
      this.socket = socket;
      this.isLoggedIn = Auth.isLoggedIn;
    }
  }

  angular.module('sebaFreshApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController,
      controllerAs: 'vm'
    });

})();
