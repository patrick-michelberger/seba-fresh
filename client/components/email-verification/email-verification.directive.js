'use strict';

angular.module('sebaFreshApp')
  .directive('emailVerification', function($timeout, $window, FirebaseAuth, FirebaseUser) {
    return {
      templateUrl: 'components/email-verification/email-verification.html',
      restrict: 'E',
      link: function(scope, element) {
        scope.currentUser = FirebaseUser.getCurrentUser();

        scope.reload = () => {
          $window.location.reload();
        };

        scope.sendEmailVerification = () => {
          scope.isSending = true;
          if (scope.currentUser.auth && !scope.currentUser.auth.emailVerified) {
            scope.currentUser.auth.sendEmailVerification();
          }
          $timeout(() => {
            scope.isSending = false;
          }, 1500);
        };
      }
    };
  });
