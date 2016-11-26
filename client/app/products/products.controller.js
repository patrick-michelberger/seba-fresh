'use strict';
(function() {

  class ProductsComponent {
    constructor($rootScope, $state, $scope, $stateParams, AssortmentService, DialogService, FirebaseCart) {
      // Dependencies
      var self = this;
      this.$state = $state;
      this.$rootScope = $rootScope;
      this.AssortmentService = AssortmentService;
      this.DialogService = DialogService;
      this.FirebaseCart = FirebaseCart;
      this.isLoading = false;

      // Attributes
      FirebaseCart.getCurrentCart().then((currentCart) => {
        self.currentCart = currentCart;
      });

      // Methods
      this.removeFromCart = this.removeFromCart;
      this.addToCart = this.addToCart;
      this.getQuantity = this.getQuantity;
      this._emitChangeEvent = this._emitChangeEvent;

      // TODO Is this watcher still necessary?
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

      // Init
      this.products = this.AssortmentService.fetchAll();
    }

    /**
     * Add a product to the cart
     *
     * @param {ProductType} product product object to be added
     * @param {String} product.id product id
     *
     * @return {Promise}
     */
    addToCart(product) {
      const self = this;

      if (this.isLoading) {
        return;
      }

      if (!product ||  !this.currentCart) {
        this.$state.go('login');
        return;
      }

      this._emitChangeEvent(product.id, true);
      return this.FirebaseCart.addItem(this.currentCart.id, product).then(() => {
        self._emitChangeEvent(product.id, false);
      });
    }

    /**
     * Remove a product from the cart
     *
     * @param {ProductType} product product object to be added
     * @param {String} product.id product id
     *
     * @return {Promise}
     */
    removeFromCart(product) {
      const self = this;

      if (this.isLoading) {
        return;
      }

      if (!product ||  !this.currentCart) {
        this.$state.go('login');
        return;
      }

      this._emitChangeEvent(product.id, true);
      return this.FirebaseCart.removeItem(this.currentCart.id, product).then(() => {
        self._emitChangeEvent(product.id, false);
      });
    }

    /**
     * Get product's cart quantity
     *
     * @param {String} productId product id
     *
     * @return {Promise}
     */
    getQuantity(productId) {
      return this.FirebaseCart.getQuantity(productId);
    }

    /**
     * Trigger recompile for an individual product item
     *
     * @param {String} productId Description
     * @param {Boolean} isLoading
     *
     */
    _emitChangeEvent(productId, isLoading) {
      if (!productId) {
        return;
      }
      this.$rootScope.$broadcast('cart:add:' + productId);
      this.isLoading = isLoading;
    }
  }

  angular.module('sebaFreshApp')
    .component('products', {
      templateUrl: 'app/products/products.html',
      controller: ProductsComponent,
      controllerAs: 'vm'
    });

})();
