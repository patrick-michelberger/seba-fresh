'use strict';
(function() {

  class ProductsComponent {
    constructor($scope, $stateParams, socket, AssortmentService, FirebaseCart, DialogService, Cart, VendorAssortmentService) {
      var self = this;
      this.products = [];
      this.socket = socket;
      this.AssortmentService = AssortmentService;
      this.DialogService = DialogService;
      this.FirebaseCart = FirebaseCart;
      this.Cart = Cart;
      this.currentCart = FirebaseCart.getCurrentCart();
      this.currentCartProducts = FirebaseCart.getCurrentCartProducts();
      this.removeFromCart = this.removeFromCart;
      this.addToCart = this.addToCart;

      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('product');
      });
      $scope.$on('$locationChangeSuccess', function(event) {
        checkDetailView();
      });

      function checkDetailView() {
        var productId = $stateParams.productId;
        if (productId) {
          self.AssortmentService.fetch(productId, function(product) {
            self.selectedProduct = product;
            self.DialogService.showProductModal(product);
          });
        }
      };
      checkDetailView();
    }

    $onInit() {
      this.products = this.AssortmentService.fetchAll();
    }

    addToCart(product, quantity) {
      const cartId = this.currentCart.id;
      this.FirebaseCart.addItem(cartId, product);
    }

    removeFromCart(product) {
      if (!product && !this.currentCart) {
        return;
      }
      const cartId = this.currentCart.id;
      this.FirebaseCart.removeItem(cartId, product);
    }
  }

  angular.module('sebaFreshApp')
    .component('products', {
      templateUrl: 'app/products/products.html',
      controller: ProductsComponent,
      controllerAs: 'vm'
    });

})();
