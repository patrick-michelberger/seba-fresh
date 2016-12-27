'use strict';

(function() {

  /**
   * The Dialog service
   */
  function DialogService($rootScope, $state, $mdDialog, $mdMedia, $q) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) ||  $rootScope.customFullscreen;

    var Dialog = {

      /**
       * Alert Modal (generic)
       */
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

      /**
       * Payment Request Modal (for cart owner)
       */
      showPaymentRequestModal(cart, userId, useFullScreen) {
        // controller
        function PaymentRequestDialogController($timeout, $scope, $state, $mdDialog, $http, FirebaseCart, FirebaseUser, FirebasePaymentService, DialogService) {
          const self = this;

          $scope.cart = cart;
          $scope.paypal = {};
          $scope.isLoading = false;
          $scope.currentUser = FirebaseUser.getCurrentUser();
          $scope.users = FirebaseCart.getUsers();
          $scope.submitted = $scope.currentUser.data.paypal.username ||  false;

          $scope.cancel = () => {
            $mdDialog.cancel();
          };

          $scope.reset = () => {
            $scope.currentUser.data.paypal.username = "";
            $scope.submitted = false;
            $scope.currentUser.data.$save();
          }

          $scope.updateProfile = () => {
            FirebasePaymentService.checkPaypalLink($scope.currentUser.data.paypal.username);
            $scope.isLoading = true;
            $scope.currentUser.data.$save().then(() => {
              $scope.isLoading = false;
              $scope.submitted = true;
            });
          };

          $scope.changeUsernname = () => {
            $scope.submitted = false;

            //if ($scope.currentUser.data.paypal.username < 1) {}
          }

          $scope.sendPaymentRequest = () => {
            $scope.isLoading = true;
            sendRequest(userId)
              .then(() => {
                $timeout(function() {
                  $scope.isLoading = false;
                  var title = "We've sent a payment request!";
                  var content = "As soon as the payment request has been fulfilled, you get notified.";
                  var popupLabel = "Next";
                  DialogService.showAlert(title, content, popupLabel);
                }, 300);
              }, (error) => {
                console.log("Error: ", error);
              });
          };

          $scope.sendPaymentRequestToAllUsers = function() {
            $scope.isLoading = true;

            // Send Payment Request to all cart users
            var paymentCalls = [];
            angular.forEach($scope.users.current, (user) => {
              if (user.uid !== $scope.cart.createdByUserId) {
                paymentCalls.push(sendRequest(user.uid));
              }
            });

            $q.all(paymentCalls)
              .then(() => {
                $timeout(function() {
                  $scope.isLoading = false;
                  var title = "We've sent a payment request!";
                  var content = "As soon as the payment request has been fulfilled, you get notified.";
                  var popupLabel = "Next";
                  DialogService.showAlert(title, content, popupLabel);
                }, 300);
              }, (error) => {
                console.log("Error: ", error);
              });
          };

          const sendRequest = (userId) => {
            const amount = FirebaseCart.getOrderValue(userId);
            return $http.post('/api/payments/send', {
              payerId: userId,
              cartId: cart.id,
              receiverId: cart.createdByUserId,
              amount: amount
            }).then(() => {
              var updateIndex = false;
              angular.forEach($scope.users.current, (user, index) => {
                if (user.uid === userId) {
                  $scope.users.current[index].paymentStatus = "REQUEST_SENT";
                  updateIndex = index;
                  return;
                }
              });
              if (updateIndex) {
                return $scope.users.current.$save(updateIndex);
              }
            });
          };
        };

        // open dialog
        $mdDialog.show({
            controller: ['$timeout', '$scope', '$state', '$mdDialog', '$http', 'FirebaseCart', 'FirebaseUser', 'FirebasePaymentService', 'DialogService', PaymentRequestDialogController],
            templateUrl: 'assets/templates/payment-request-dialog.tmpl.html',
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

      /**
       * Pay Modal (for cart member)
       */
      showPayModal(cart, userId, useFullScreen) {
        // controller
        function PayDialogController($scope, $state, $mdDialog, $http, FirebaseCart, FirebasePaymentService) {
          $scope.cart = cart;
          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.usePaypal = function() {
            const amount = FirebaseCart.getOrderValue(userId);
            $http.post('/api/payments/send', {
              payerId: userId,
              cartId: cart.id,
              receiverId: cart.createdByUserId,
              amount: amount
            });
          };
        };

        // open dialog
        $mdDialog.show({
            controller: ['$scope', '$state', '$mdDialog', '$http', 'FirebaseCart', 'FirebasePaymentService', PayDialogController],
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

      /**
       * Product Modal (for ADS)
       */
      showProductModal(product) {
        // controller
        function ProductDialogController($sce, $rootScope, $scope, $state, $mdDialog, FirebaseCart) {
          var carts = FirebaseCart.getCarts();
          $scope.product = product;
          $scope.productDescription = $sce.trustAsHtml(product.description);

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.addToCart = function(product) {
            if (!product ||  !carts ||  !carts.current) {
              $state.go('login');
              $scope.cancel();
              return;
            }
            FirebaseCart.addItem(carts.current.id, product).then(() => {
              $scope.cancel();
            });
          };
        }

        console.log("$mdMedia('sm'): ", $mdMedia('xs'));
        console.log("useFullScreen: ", useFullScreen);

        // open dialog
        $mdDialog.show({
            controller: ['$sce', '$rootScope', '$scope', '$state', '$mdDialog', 'FirebaseCart', ProductDialogController],
            templateUrl: 'assets/templates/product-dialog.tmpl.html',
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

      /**
       *  User Carts Modal (for shopping cart selection)
       */
      showUserCartsModal(useFullScreen) {
        // controller
        function UserCartsDialogController($rootScope, $scope, $state, $mdDialog, FirebaseCart, FirebaseUser) {
          $scope.carts = FirebaseCart.getCartList();

          $scope.currentUser = FirebaseUser.getCurrentUser();

          $scope.selectedCarts = {};

          $scope.selected = {};

          $scope.selected.cart = $scope.currentUser.data.currentCartId;

          $scope.deleteCarts = function() {
            if ($scope.selected.cart) {
              FirebaseCart.deleteCart($scope.selected.cart).then(() => {
                if ($scope.carts.length > 0) {
                  FirebaseUser.setCurrentCart($scope.carts[0].id);
                  $scope.selected.cart = $scope.carts[0].id;
                }
              });
            }
          };

          $scope.leaveCarts = function() {
            FirebaseCart.deleteFirebase();
          };

          $scope.selectCart = function() {
            if ($scope.selected.cart) {
              FirebaseUser.setCurrentCart($scope.selected.cart);
              $rootScope.$emit("cart:changed", $scope.selected.cart);
            }
          }

          $scope.cancel = function() {
            $mdDialog.cancel();
          };
        }

        // open dialog
        $mdDialog.show({
            controller: ['$rootScope', '$scope', '$state', '$mdDialog', 'FirebaseCart', 'FirebaseUser', UserCartsDialogController],
            templateUrl: 'assets/templates/user-carts-dialog.tmpl.html',
            parent: angular.element(document.body),
            //targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          })
          .then(function(answer) {}, function() {
            /*$state.go('products', {}, {
              reload: false,
              notify: false
            });
            */
          });

        $rootScope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $rootScope.customFullscreen = (wantsFullScreen === true);
        });
      },

      /**
       * Provider Modal (for grocery chain selection)
       */
      showProviderModal() {
        // controller
        function ProviderDialogController($rootScope, $scope, $state, $mdDialog, FirebaseCart, FirebaseUser) {

          $scope.currentUser = FirebaseUser.getCurrentUser();

          $scope.selected = {};

          var provider = "walmart";

          if ($scope.currentUser.data && $scope.currentUser.data.currentProvider) {
            provider = $scope.currentUser.data.currentProvider;
          } else if ($rootScope.currentProvider) {
            provider = $rootScope.currentProvider;
          }

          $scope.selected.provider = provider;

          $scope.selectProvider = function() {
            if ($scope.selected.provider) {
              //FirebaseCart.setProvider($scope.selected.provider);
              FirebaseUser.setCurrentProvider($scope.selected.provider);
              $scope.cancel();
              // $rootScope.$emit("cart:changed", $scope.selected.cart);
            }
          }

          $scope.cancel = function() {
            $mdDialog.cancel();
          };
        }

        // open dialog
        $mdDialog.show({
            controller: ['$rootScope', '$scope', '$state', '$mdDialog', 'FirebaseCart', 'FirebaseUser', ProviderDialogController],
            templateUrl: 'assets/templates/provider-dialog.tmpl.html',
            parent: angular.element(document.body),
            //targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          })
          .then(function(answer) {}, function() {
            /*$state.go('products', {}, {
              reload: false,
              notify: false
            });
            */
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
