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
      this.ShopService = ShopService;
    }

    $onInit() {
      this.products = this.ProductService.query();
    }

    addToCart(product) {
      this.ShopService.addToCart(product, function () {});
    }
  }

  angular.module('sebaFreshApp')
    .component('products', {
      templateUrl: 'app/products/products.html',
      controller: ProductsComponent,
      controllerAs: 'vm'
    });

})();
