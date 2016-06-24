'use strict';

class ShoppingCartController {

  constructor(ShopService) {
    this.ShopService = ShopService;
  }

  $onInit() {
    this.carts = this.ShopService.getCarts();
  }

}

angular.module('sebaFreshApp')
  .controller('ShoppingCartController', ShoppingCartController);
