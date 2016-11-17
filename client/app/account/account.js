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
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth, ShopService) {
          var referrer = $state.params.referrer ||
            $state.current.referrer ||
            'main';
          Auth.logout();
          ShopService.clear();
          $state.go(referrer);
        }
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
