'use strict';

(function() {
  function VendorAssortmentService() {

    const checkQuantity = (cart, product) => {
      if (cart && cart[product.id]) {
        return cart[product.id].quantity;
      } else {
        return 0;
      }
    }

    return {
      checkQuantity
    };
  };

  angular.module('sebaFreshApp.services')
    .factory('VendorAssortmentService', VendorAssortmentService);
})();
