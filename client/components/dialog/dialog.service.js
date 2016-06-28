'use strict';

(function () {

  /**
   * The Dialog service
   */
  function DialogService($rootScope, $state, $mdDialog, $mdMedia) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) ||  $rootScope.customFullscreen;

    var Dialog = {
      showAlert(title, content, actionLabel) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#sf-popup-container')))
          .clickOutsideToClose(true)
          .title(title)
          .textContent(content)
          .ariaLabel(title)
          .ok(actionLabel)
        );
      },
      showProductModal(product, useFullScreen) {
        // controller
        function ProductDialogController($scope, $state, $mdDialog) {
          $scope.product = product;
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
        }

        // open dialog
        $mdDialog.show({
            controller: ['$scope', '$state', '$mdDialog', ProductDialogController],
            templateUrl: 'assets/templates/product-dialog.tmpl.html',
            parent: angular.element(document.body),
            //targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          })
          .then(function (answer) {}, function () {
            $state.go('products', {}, {
              reload: false,
              notify: false
            });
          });

        $rootScope.$watch(function () {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
          $rootScope.customFullscreen = (wantsFullScreen === true);
        });
      }
    };
    return Dialog;
  }

  angular.module('sebaFreshApp')
    .factory('DialogService', DialogService);

})();
