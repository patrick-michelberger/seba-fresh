'use strict';

(function() {

  function FacebookService($q, $document) {
    var Facebook = {
      sendMessage: function(url) {
        var deferred = $q.defer();

        var options = {
          method: 'share',
          mobile_iframe: true,
          href: url,
          display: 'dialog',
          redirect_uri: location.protocol + '//' + location.hostname + ':' + location.port
        };

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          FB.ui(options, function(response) {
            console.log("share response: ", response);
            if (!response || response.error) {
              deferred.reject('Error occured');
            } else {
              deferred.resolve(response);
            }
          });
        } else {
          FB.ui({
            name: 'SEBA fresh - Shopping Cart Invitation',
            method: 'send',
            link: url
          }, function(response) {
            console.log("send response: ", response);
            if (!response || response.error) {
              deferred.reject('Error occured');
            } else {
              deferred.resolve(response);
            }
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
