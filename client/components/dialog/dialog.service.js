'use strict';

(function() {

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

      showPayModal(cart, useFullScreen) {
        // controller
        function PayDialogController($scope, $state, $mdDialog, $http) {
          $scope.cart = cart;
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.usePaypal = function() {


            /*
            console.log("use paypal");
            $http.post('/api/payments/send', {
              payer: cart.users[0]._id, // ObjectId("5776686397019a3c23834304")
              cart: cart._id //ObjectId("5776687a97019a3c23834306")
            });
            */
          }
        };

        // open dialog
        $mdDialog.show({
            controller: ['$scope', '$state', '$mdDialog', '$http', PayDialogController],
            templateUrl: 'assets/templates/pay-dialog.tmpl.html',
            parent: angular.element(document.body),
            //targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          })
          .then(function(answer) {}, function() {});

        $rootScope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $rootScope.customFullscreen = (wantsFullScreen === true);
        });
      },

      showProductModal(product, useFullScreen) {
        // controller
        function ProductDialogController($rootScope, $scope, $state, $mdDialog, FirebaseCart) {
          FirebaseCart.getCurrentCart().then((cart) => {
            $scope.currentCart = cart;
          });
          $scope.product = product;
          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.addToCart = function(product) {
            if (!product ||  !$scope.currentCart) {
              $state.go('login');
              $scope.cancel();
              return;
            }
            FirebaseCart.addItem($scope.currentCart.id, product).then(() => {
              $scope.cancel();
            });
          };
        }

        // open dialog
        $mdDialog.show({
            controller: ['$rootScope', '$scope', '$state', '$mdDialog', 'FirebaseCart', ProductDialogController],
            templateUrl: 'assets/templates/product-dialog.tmpl.html',
            parent: angular.element(document.body),
            //targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          })
          .then(function(answer) {}, function() {
            $state.go('products', {}, {
              reload: false,
              notify: false
            });
          });

        $rootScope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $rootScope.customFullscreen = (wantsFullScreen === true);
        });
      }
    };
    return Dialog;
  }

  angular.module('sebaFreshApp')
    .factory('DialogService', DialogService);

})();
