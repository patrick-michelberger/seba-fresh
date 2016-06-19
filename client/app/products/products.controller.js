'use strict';
(function () {

  class ProductsComponent {
    constructor($scope, socket, ProductService) {
      this.socket = socket;
      this.ProductService = ProductService;
      this.products = [];
      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('product');
      });
    }

    $onInit() {
      this.products = this.ProductService.query();
    }
  }

  angular.module('sebaFreshApp')
    .component('products', {
      templateUrl: 'app/products/products.html',
      controller: ProductsComponent,
      controllerAs: 'vm'
    });

})();
