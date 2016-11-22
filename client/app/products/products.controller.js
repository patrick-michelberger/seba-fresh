'use strict';
(function() {

  class ProductsComponent {
    constructor($rootScope, $state, $scope, $stateParams, AssortmentService, DialogService, FirebaseCart, VendorAssortmentService) {
      // Dependencies
      var self = this;
      this.$state = $state;
      this.AssortmentService = AssortmentService;
      this.DialogService = DialogService;
      this.FirebaseCart = FirebaseCart;

      // Attributes
      FirebaseCart.getCurrentCart().then((currentCart) => {
        self.currentCart = currentCart;
      });

      FirebaseCart.getCurrentCartProducts();

      // Methods
      this.removeFromCart = this.removeFromCart;
      this.addToCart = this.addToCart;

      $scope.$on('$locationChangeSuccess', function(event) {
        checkDetailView();
      });

      function checkDetailView() {
        var productId = $stateParams.productId;
        if (productId) {
          AssortmentService.fetch(productId, function(product) {
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
      console.log("add: ", this.currentCart);
      if (!product ||  !this.currentCart) {
        this.$state.go('login');
        return;
      }
      this.FirebaseCart.addItem(this.currentCart.id, product);
    }

    removeFromCart(product) {
      if (!product ||  !this.currentCart) {
        this.$state.go('login');
        return;
      }
      this.FirebaseCart.removeItem(this.currentCart.id, product);
    }
  }

  angular.module('sebaFreshApp')
    .component('products', {
      templateUrl: 'app/products/products.html',
      controller: ProductsComponent,
      controllerAs: 'vm'
    });

})();
