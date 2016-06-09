'use strict';

(function () {

  class ContactController {

    constructor() {
      this.title = "Contact us!";
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
