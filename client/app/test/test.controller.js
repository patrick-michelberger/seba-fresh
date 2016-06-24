'use strict';
(function () {

  class TestController {
    constructor($scope, socket, CategoryService) {
      this.defaultCategory = 'food';
      this.socket = socket;
      this.CategoryService = CategoryService;
      this.categories = [];
      this.selectedCategory = "";
      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('category');
      });

      this.query1 = {
        "name": this.defaultCategory
      };

      //   $scope.clearValue = function() {
      //   $scope.myModel = undefined;
      // };

      // $scope.save = function() {
      //   alert('Form was valid!');
      // };
    }

    $onInit() {
      this.categories = this.CategoryService.query(this.query1, function (data) {
        console.log(data);
      });
    }
  }

  angular.module('sebaFreshApp')
    .component('test', {
      templateUrl: 'app/test/test.html',
      controller: TestController,
      controllerAs: "vm"

    });

})();
