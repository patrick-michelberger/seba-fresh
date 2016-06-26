'use strict';
(function () {

  class OnboardingComponent {
    constructor() {}
  }

  angular.module('sebaFreshApp')
    .component('onboarding', {
      templateUrl: 'app/onboarding/onboarding.html',
      controller: OnboardingComponent
    });

})();
