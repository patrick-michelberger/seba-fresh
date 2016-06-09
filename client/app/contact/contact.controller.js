'use strict';

(function () {

  class ContactController {

    constructor() {
      this.title = "Hallo Welt";
    }

    $onInit() {

    }

  }

  angular.module('sebaFreshApp')
    .component('contact', {
      templateUrl: 'app/contact/contact.html',
      controller: ContactController,
      controllerAs: 'vm'
    });

})();
