'use strict';

(function () {

  class AboutController {

    constructor() {
      this.title = "About us";
    }

    $onInit() {

    }

  }

  angular.module('sebaFreshApp')
    .component('about', {
      templateUrl: 'app/about/about.html',
      controller: AboutController,
      controllerAs: 'vm'
    });

})();
