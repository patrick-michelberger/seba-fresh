'use strict';

(function() {

  function GroupResource($resource) {
    return {};
  }

  angular.module('sebaFreshApp.services')
    .factory('Group', GroupResource);
})();
