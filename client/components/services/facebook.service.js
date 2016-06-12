'use strict';

(function () {

  function FacebookService($q, $document) {
    var Facebook = {
      sendMessage: function (url) {
        var deferred = $q.defer();
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          FB.ui({
            method: 'share',
            href: url,
          }, function (response) {
            if (!response || response.error) {
              deferred.reject('Error occured');
            } else {
              deferred.resolve(response);
            }
          });
        } else {
          FB.ui({
            method: 'send',
            link: url
          });
        }
        return deferred.promise;
      }
    };
    return Facebook;
  }

  angular.module('sebaFreshApp.services')
    .factory('FacebookService', FacebookService);

})();
