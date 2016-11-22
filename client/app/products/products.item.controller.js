'use strict';

class ProductCellController {
  constructor($rootScope, $scope, FirebaseCart, VendorAssortmentService) {
    const self = this;
    FirebaseCart.getCurrentCart().then((currentCart) => {
      self.currentCart = currentCart;
    });
    FirebaseCart.getCurrentCartProducts().then((currentCartProducts) => {
      self.currentCartProducts = currentCartProducts;
    });

    this.checkQuantity = (cart, product) => {
      return $scope.quantity = VendorAssortmentService.checkQuantity(cart, product);
    }
  }
}

angular.module('sebaFreshApp')
  .controller('ProductCellController', ProductCellController);
