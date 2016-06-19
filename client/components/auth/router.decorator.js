'use strict';

(function () {

  angular.module('sebaFreshApp.auth')
    .run(function ($rootScope, $state, Auth) {

      $rootScope.navbar = {};
      $rootScope.footer = {};

      // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
      $rootScope.$on('$stateChangeStart', function (event, next) {

        // no content top padding for transparent navbar
        if (next.data && next.data.transparentNavbar) {
          $rootScope.navbar.transparent = true;
        } else {
          $rootScope.navbar.transparent = false;
        }

        if (!next.authenticate) {
          return;
        }

        if (typeof next.authenticate === 'string') {
          Auth.hasRole(next.authenticate, _.noop).then(has => {
            if (has) {
              return;
            }

            event.preventDefault();
            return Auth.isLoggedIn(_.noop).then(is => {
              $state.go(is ? 'products' : 'login');
            });
          });
        } else {
          Auth.isLoggedIn(_.noop).then(is => {
            if (is) {
              return;
            }

            event.preventDefault();
            $state.go('products');
          });
        }
      });
    });

})();
