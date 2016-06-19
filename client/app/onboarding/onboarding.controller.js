'use strict';
(function(){

class OnboardingComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('sebaFreshApp')
  .component('onboarding', {
    templateUrl: 'app/onboarding/onboarding.html',
    controller: OnboardingComponent
  });

})();
