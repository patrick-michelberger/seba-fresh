'use strict';

angular.module('sebaFreshApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('onboarding', {
        url: '/onboarding',
        template: '<onboarding></onboarding>',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return FirebaseAuth.$requireSignIn();
          }]
        }
      });
  });
