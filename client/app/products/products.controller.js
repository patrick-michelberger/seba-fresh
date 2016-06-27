'use strict';
(function () {

  class ProductsComponent {
    constructor($scope, socket, ProductService, ShopService) {
      this.socket = socket;
      this.ProductService = ProductService;
      this.products = [];
      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('product');
      });
      this.addToCart = this.addToCart;
      this.removeFromCart = this.removeFromCart;
      this.ShopService = ShopService;
    }

    $onInit() {
      this.products = this.ProductService.query();
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
