'use strict';

class OnboardingController {

  constructor($timeout, $scope, $rootScope, FirebaseCart) {
    var self = this;

    // dependencies
    this.$timeout = $timeout;
    this.FirebaseCart = FirebaseCart;

    // properties
    this.selectedIndex = 0;
    this.showSuccessMessage = false;
    this.groups = FirebaseCart.getCartList();

    $rootScope.$on('onboarding:next', function(event, index) {
      if (index) {
        self._setIndex(index);
      } else {
        self.showSuccessMessage = true;
        self.$timeout(function() {
          self.showSuccessMessage = false;
          self._updateIndex();
        }, 1500);
      }
    });

    $rootScope.$on('onboarding:invited', function() {
      self.showSuccessMessage = true;
      self.$timeout(function() {
        self.showSuccessMessage = false;
        self._updateIndex();
      }, 1500);
    });
  }

  // methods
  $onInit() {
    var self = this;
  }

  disableInviteFriends() {

    var result = !this.groups || !this.groups[0];
    return result;
  }

  disableProducts() {
    var result = !this.groups || !this.groups[0];
    return result;
  }

  disableCreateGroup() {
    var result = this.groups && this.groups[0] && true;
    return result;
  }

  _setIndex(index) {
    this.selectedIndex = index;
  }

  _updateIndex() {
    if (this.groups && this.groups[0]) {
      this.selectedIndex = 2;
    } else if (this.groups && this.groups[0]) {
      this.selectedIndex = 1;
    } else {
      this.selectedIndex = 0;
    }
  }

}

angular.module('sebaFreshApp')
  .controller('OnboardingController', OnboardingController);
