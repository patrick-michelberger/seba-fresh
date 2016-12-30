'use strict';

angular.module('sebaFreshApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        params: {
          redirectUrl: null
        }
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'app/account/logout/logout.html',
        controller: 'LogoutController',
        controllerAs: 'vm',
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm',
        params: {
          redirectUrl: null
        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        resolve: {
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            return FirebaseAuth.$requireSignIn();
          }]
        }
      })
      .state('reset', {
        url: '/reset',
        templateUrl: 'app/account/forgotpassword/forgotpassword.html',
        controller: 'ForgotpasswordController',
        controllerAs: 'vm'
      });
  })
  .run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $state.go("login");
      }
    });
  });
