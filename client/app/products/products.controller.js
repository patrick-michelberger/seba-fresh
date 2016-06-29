'use strict';
(function () {

  class ProductsComponent {
    constructor($scope, $stateParams, socket, AssortmentService, ShopService, DialogService) {
      var self = this;
      this.socket = socket;
      this.AssortmentService = AssortmentService;
      this.products = [];
      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('product');
      });
      this.addToCart = this.addToCart;
      this.removeFromCart = this.removeFromCart;
      this.ShopService = ShopService;
      this.DialogService = DialogService;

      $scope.$on('$locationChangeSuccess', function (event) {
        checkDetailView();
      });

      function checkDetailView() {
        var productId = $stateParams.productId;
        if (productId) {
          self.AssortmentService.fetch(productId, function (product) {
            console.log("fetched product: ", product);
            self.selectedProduct = product;
            self.DialogService.showProductModal(product);
          });
        }
      };

      checkDetailView();
    }

    $onInit() {
      this.products = this.AssortmentService.fetchAll();

      console.log("this.products: ", this.products);
      this.currentCart = this.ShopService.getCurrentCart();
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
