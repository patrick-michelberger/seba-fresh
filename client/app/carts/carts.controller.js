'use strict';
(function(){

class CartsComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('sebaFreshApp')
  .component('carts', {
    templateUrl: 'app/carts/carts.html',
    controller: CartsComponent
  });

})();
