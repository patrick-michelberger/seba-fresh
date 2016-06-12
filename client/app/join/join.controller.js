'use strict';
(function(){

class JoinComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('sebaFreshApp')
  .component('join', {
    templateUrl: 'app/join/join.html',
    controller: JoinComponent
  });

})();
