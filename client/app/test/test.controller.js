'use strict';
(function () {

  class TestController {
    constructor($scope) {

  $scope.clearValue = function() {
  $scope.myModel = undefined;
};

$scope.save = function() {
  alert('Form was valid!');
};
    }

    $onInit() {
    }
  }

  angular.module('sebaFreshApp')
    .component('test', {
      templateUrl: 'app/test/test.html',
      controller: TestController,
      controllerAs: "vm"

    });

})();
