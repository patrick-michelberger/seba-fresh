'use strict';
(function () {

  class ProductsComponent {
    constructor($scope, $stateParams, socket, AssortmentService, ShopService, DialogService, Cart) {
      var self = this;
      this.products = [];
      this.socket = socket;
      this.AssortmentService = AssortmentService;
      this.DialogService = DialogService;
      this.ShopService = ShopService;
      this.Cart = Cart;

      this.removeFromCart = this.removeFromCart;
      this.addToCart = this.addToCart;

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('product');
      });
      $scope.$on('$locationChangeSuccess', function (event) {
        checkDetailView();
      });

      function checkDetailView() {
        var productId = $stateParams.productId;
        if (productId) {
          self.AssortmentService.fetch(productId, function (product) {
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

    addToCart(product) {
      this.ShopService.addToCart(product, function () {});
      var quantity = product.quantity || 0;
      product.quantity = quantity + 1;
    }

    removeFromCart(product) {
      this.ShopService.removeFromCart(product, function () {});
      var quantity = product.quantity || 0;
      if (quantity > 0) {
        product.quantity = quantity - 1;
      }
    }
  }

  angular.module('sebaFreshApp')
    .component('products', {
      templateUrl: 'app/products/products.html',
      controller: ProductsComponent,
      controllerAs: 'vm'
    });

})();
