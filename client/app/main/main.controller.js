'use strict';

(function() {

  class MainController {}
  
  angular.module('sebaFreshApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController,
      controllerAs: 'vm'
    });

})();
