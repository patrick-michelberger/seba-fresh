w 'use strict';

(function() {
  function FirebaseCartService($rootScope, $http, $q, $firebaseObject, $firebaseArray, FirebaseAuth, FirebaseUser) {

    const self = this;

    const cartsMetadataRef = firebase.database().ref().child("carts-metadata");
    const usersCartRef = firebase.database().ref().child('cart-users');
    const cartProducts = firebase.database().ref().child('cart-products');
    const invitationsRef = firebase.database().ref().child('invitations');
    const usersRef = firebase.database().ref().child('users');

    self.currentCartProducts = {};

    /**
     * Get a single shopping cart by id
     *
     * @param {String} cartId cart id
     *
     * @return {Promise}
     */
    const get = (cartId) => {
      const cartRef = cartsMetadataRef.child(cartId);
      return cartRef.once('value').then((snapshot) => {
        return {
          cart: snapshot.val(),
          cartRef
        };
      });
    };

    /**
     * Get current user's carts
     *
     * @return {Promise}
     */
    const getCartList = () => {
      const userCartsRef = usersRef.child(FirebaseAuth.$getAuth().uid).child("carts");
      return $firebaseArray(userCartsRef);
    };

    /**
     * Get user's current cart
     *
     * @return {Promise}
     */
    const getCurrentCart = () => {
      const deferred = $q.defer();
      FirebaseUser.getUser().then((user) => {
        user.$loaded().then((user) => {
          if (user && user.currentCartId) {
            const cartRef = cartsMetadataRef.child(user.currentCartId);
            deferred.resolve($firebaseObject(cartRef));
          } else {
            deferred.reject();
          }
        });
      });
      return deferred.promise;
    }

    /**
     * Get user's current cart's products
     *
     * @return {Promise}
     */
    const getCurrentCartProducts = () => {
      return getCurrentCart().then((cartRef) => {
        return cartRef.$loaded().then((cart) => {
          const cartProductsRef = cartProducts.child(cart.id);
          return $firebaseObject(cartProductsRef);
        });
      });
    }

    /**
     * Create a shopping cart
     *
     * @param {String} cartName    cart name
     * @param {Object} cartAddress shipping address
     * @param {String} cartAddress.street street
     * @param {number} cartAddress.street_number street number
     * @param {Number} cartAddress.postcode postcode
     * @param {String} cartAddress.city city
     * @param {Object} cartAddress.geolocation geolocation Object
     * @param {Number} cartAddress.geolocation.latitude latitude value
     * @param {Number} cartAddress.geolocation.longitude longitude value
     *
     * @return {Promise}
     */
    const createCart = (cartName, cartAddress) => {
      var self = this,
        newCartRef = cartsMetadataRef.push();

      // TODO Change to server side timestamp: firebase.database.ServerValue.TIMESTAMP
      var newCart = {
        id: newCartRef.key,
        name: cartName,
        address: cartAddress,
        createdByUserId: FirebaseAuth.$getAuth().uid,
        // TODO admin: this._userId,
        createdAt: new Date()
      };

      return newCartRef.set(newCart).then(() => {
        joinCart(newCartRef.key);
        return newCartRef.key;
      }).catch((error) => {
        console.log("Error: ", error);
      });
    }

    /**
     * Delete shopping cart
     *
     * @param {String} cartId cart id
     *
     * @return {Promise}
     */
    const deleteCart = (cartId) => {
      const self = this;
      const currentUser = FirebaseAuth.$getAuth();
      const userCartRef = usersRef.child(currentUser.uid).child('carts').child(cartId);
      const cartRef = cartsMetadataRef.child(cartId);

      return userCartRef.remove().then(cartRef.remove);
    }

    /**
     * Join shopping cart (current user)
     *
     * @param {String} cartId cart id
     *
     * @return {Promise}
     */
    const joinCart = (cartId) => {
      const self = this;

      return get(cartId).then((response) => {
        const {
          cart,
          cartRef
        } = response;
        const cartName = cart.name;
        const cartCreatedByUserId = cart.createdByUserId;
        const currentUser = FirebaseAuth.$getAuth();

        if (!cartId ||  !cartName ||  !cartCreatedByUserId) return;

        if (currentUser) {
          const userRef = usersRef.child(currentUser.uid);
          userRef.child('carts').child(cartId).set({
            id: cartId,
            name: cartName,
            createdByUserId: cartCreatedByUserId
          });

          usersCartRef.child(cartId).child(currentUser.uid).set({
            uid: currentUser.id,
            displayName: currentUser.displayName
          });
        }

        // TODO Setup products listeners
      });
    };

    /**
     * Leave shopping cart
     *
     * @param {String} cartId cart id
     *
     * @return {Promise}
     */
    const leaveCart = (cartId) => {
      const self = this,
        userCartRef = usersRef.child(cartId);

      const currentUser = FirebaseAuth.$getAuth();



      // usersCartRef.

      /* TODO
      if (currentUser) {
        var presenceRef = userCartRef.child(currentUser.uid).child(self._sessionId);

        // Remove presence bit for the room and cancel on-disconnect removal.
        self._removePresenceOperation(presenceRef, null);

        // Remove session bit for the room.
        self._userRef.child('rooms').child(roomId).remove();
      }

      delete self._rooms[roomId];

      Invoke event callbacks for the room-exit event.
      self._onLeaveRoom(roomId);
      */
    };

    /**
     * Add item to shopping cart
     *
     * @param {String} cartId   cart id
     * @param {Object} product  product
     * @param {Number} product.id  product id
     * @param {String} product.name  product name
     * @param {Boolean} product.stock  is product available in stock
     * @param {String} product.brand  product brand name
     * @param {String} product.categoryPath product category path string
     * @param {String} product.addToCartUrl product add to cart url (affiliate)
     * @param {String} product.productUrl  product url
     * @param {String} product.largeImage  product image large
     * @param {String} product.mediumImage product image medium
     * @param {String} product.thumbnailImage  product image thumbnail
     * @param {Number} quantity quantity
     *
     * @return {Promise}
     */
    const addItem = (cartId, product, quantity) => {
      const self = this;
      const currentUser = FirebaseAuth.$getAuth();
      quantity = quantity || 1;

      if (!currentUser) {
        return new Error('Not authenticated or user not set!');
      }

      const newProductRef = cartProducts.child(cartId).child(product.id);

      // get current cart-products node
      return newProductRef.once('value').then((snapshot) => {

        let oldItem = snapshot.val();

        if (snapshot) {
          oldItem = snapshot.val();
        }

        let newItem = {
          addedByUserId: currentUser.uid,
          addedByUserName: currentUser.displayName,
          addedAt: firebase.database.ServerValue.TIMESTAMP,
          item: {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            brand: product.brand,
            categoryPath: product.categoryPath,
            addToCartUrl: product.addToCartUrl,
            productUrl: product.productUrl,
            largeImage: product.largeImage,
            mediumImage: product.mediumImage,
            thumbnailImage: product.thumbnailImage,
          },
          quantity: quantity
        };

        if (oldItem && oldItem.quantity) {
          newItem.quantity = oldItem.quantity + newItem.quantity;
        }

        // update cart-products node
        return newProductRef.update(newItem).then(() => {

          // get current carts-metadata node
          return get(cartId).then((response) => {
            const {
              cart,
              cartRef
            } = response;
            const totalAmount = cart.totalAmount || 0;
            const totalQuantity = cart.totalQuantity || 0;

            // update carts-metadata node
            return cartRef.update({
              totalAmount: totalAmount + (product.price * quantity),
              totalQuantity: totalQuantity + quantity,
            });
          });
        });
      });
    };

    /**
     * Remove item from shopping cart
     *
     * @param {String} cartId   cart id
     * @param {Object} product  product
     * @param {String} product.id  product id
     * @param {Number} product.price  product price
     * @param {Number} quantity quantity
     *
     * @return {Promise}
     */
    const removeItem = (cartId, product, quantity) => {
      quantity = quantity ||  1;
      const self = this;

      // get current carts-metadata node
      return get(cartId).then((response) => {
        const {
          cart,
          cartRef
        } = response;
        const totalAmount = cart.totalAmount || 0;
        const totalQuantity = cart.totalQuantity || 0;

        // update carts-metadata node
        return cartRef.update({
          totalAmount: totalAmount - (product.price * quantity),
          totalQuantity: totalQuantity - quantity,
        }).then(() => {
          const productRef = cartProducts.child(cartId).child(product.id);
          // get current cart-products node
          return productRef.once('value').then((snapshot) => {
            const oldItem = snapshot.val();

            // update cart-products node
            if (oldItem && oldItem.quantity > 1) {
              return productRef.update({
                quantity: oldItem.quantity - quantity
              })
            } else {
              return productRef.remove();
            }
          });
        });
      });
    };

    /**
     * Get quantity of a product in current shopping cart
     *
     * @param {String} productId product id
     *
     * @return {Number} Quantity of product
     */
    const getQuantity = (productId) => {
      if (!self.currentCartProducts[productId]) {
        return 0;
      }
      return self.currentCartProducts[productId].quantity;
    };

    /**
     * Get cart's users
     *
     * @param {String} cartId cart id
     *
     * @return {Promise }
     */
    const getUsersByCart = (cartId) => {
      cosnt cartRef = usersCartRef.child(cartId);
      return $firebaseObject(cartRef);
    };

    // Load current cart products
    getCurrentCartProducts().then((currentCartProducts) => {
      currentCartProducts.$loaded().then((products) => {
        self.currentCartProducts = products;
        for (let productId in products) {
          if (!isNaN(productId)) {
            $rootScope.$broadcast('cart:add:' + productId);
          }
        }
      });
    });

    return {
      get,
      createCart,
      deleteCart,
      joinCart,
      leaveCart,
      addItem,
      removeItem,
      getCartList,
      getCurrentCart,
      getCurrentCartProducts,
      getQuantity,
      getUsersByCart,
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseCart', ["$rootScope", "$http", "$q", "$firebaseObject", "$firebaseArray", "FirebaseAuth", "FirebaseUser", FirebaseCartService]);
})();
