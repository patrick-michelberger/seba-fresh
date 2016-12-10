'use strict';

angular.module('sebaFreshApp')
  .directive('groceryProvider', function($rootScope, $mdDialog, DialogService) {
    return {
      templateUrl: 'components/grocery-provider/grocery-provider.html',
      restrict: 'E',
      scope: {
        user: "="
      },
      link: function(scope, element) {
        element.addClass('grocery-provider');

        scope.rootScope = $rootScope;

        scope.changeProvider = () => {
          DialogService.showProviderModal();
        };
      }
    };
  });
