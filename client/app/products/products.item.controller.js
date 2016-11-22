'use strict';

class ProductCellController {
  constructor($rootScope, $scope, FirebaseCart, VendorAssortmentService) {
    const self = this;
    this.currentCart = FirebaseCart.getCurrentCart();
    this.currentCartProducts = FirebaseCart.getCurrentCartProducts();

    this.checkQuantity = (cart, product) => {
      return $scope.quantity = VendorAssortmentService.checkQuantity(cart, product);
    }
  }
}

angular.module('sebaFreshApp')
  .controller('ProductCellController', ProductCellController);
