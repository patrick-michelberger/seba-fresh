'use strict';

class ProductCellController {
  constructor($scope, FirebaseCart, VendorAssortmentService) {
    this.currentCart = FirebaseCart.getCurrentCart();
    this.currentCartProducts = FirebaseCart.getCurrentCartProducts();
    this.checkQuantity = (cart, product) => {
      return $scope.quantity = VendorAssortmentService.checkQuantity(cart, product);
    }
  }
}

angular.module('sebaFreshApp')
  .controller('ProductCellController', ProductCellController);
