'use strict';

(function() {
  function FirebaseCartService($rootScope, $http, $q, $firebaseObject, $firebaseArray, FirebaseAuth, FirebaseUser) {

    var carts = {};
    carts.current = null;

    var users = {};
    users.current = null;

    var products = {};
    products.current = {};

    const self = this;

    const cartsMetadataRef = firebase.database().ref().child("carts-metadata");
    const cartsUsersRef = firebase.database().ref().child('carts-users');
    const cartsProducts = firebase.database().ref().child('carts-products');
    const invitationsRef = firebase.database().ref().child('invitations');
    const usersRef = firebase.database().ref().child('users');

    const currentUser = FirebaseUser.getCurrentUser();

    // Watch user's current cart value
    $rootScope.$on('cart:changed', (event, newCartId) => {
      refreshCart(newCartId);
    });

    // Auth listener
    FirebaseAuth.$onAuthStateChanged(() => {
      if (currentUser && currentUser.data) {
        currentUser.data.$loaded().then((user) => {
          if (user && user.currentCartId) {
            refreshCart(user.currentCartId);
          }
        });
      }
    });

    const refreshCart = (cartId) => {
      // Load current cart
      const cartRef = cartsMetadataRef.child(cartId);
      carts.current = $firebaseObject(cartRef);

      // Load current cart's products
      const cartsProductsRef = cartsProducts.child(cartId);

      const cartUsersRef = cartsUsersRef.child(cartId);
      users.current = $firebaseArray(cartUsersRef);

      users.current.$loaded().then((users) => {
        users.forEach((user) => {
          const cartsUserProductsRef = cartsProductsRef.child(user.uid);
          products.current[user.uid] = $firebaseObject(cartsUserProductsRef);
        });
      }).then(() => {
        // Update products quantity values
        products.current[currentUser.auth.uid].$loaded().then((cartsProducts) => {
          angular.forEach(cartsProducts, (value, productId) => {
            $rootScope.$broadcast('cart:add:' + productId);
          });
        });
      });

    };

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
     * Get user's current carts
     *
     * @return {FirebaseObject}
     */
    const getCarts = () => {
      return carts;
    }

    /**
     * Get user's current carts' products
     *
     * @return {FirebaseObject}
     */
    const getProducts = () => {
      return products;
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

      var newCart = {
        id: newCartRef.key,
        name: cartName,
        address: cartAddress,
        createdByUserId: FirebaseAuth.$getAuth().uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP
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
      const cartUsersRef = cartsUsersRef.child(cartId);

      return cartUsersRef.once('value').then((snapshot) => {
        const members = Object.keys(snapshot.val());
        // check carts-users entry
        if (members.length < 2) {
          return cartUsersRef.remove();
        }
      }).then(() => {
        // check carts-metadata entry
        const cartMetadataRef = cartsMetadataRef.child(cartId);
        return cartMetadataRef.remove();
      }).then(() => {
        const userRef = usersRef.child(currentUser.uid);
        const userCartsRef = userRef.child('carts')

        return userRef.once('value').then((snapshot) => {
          // Check users[id].currentCartId entry
          const currentUser = snapshot.val();
          if (currentUser.currentCartId === cartId) {
            return userRef.child("currentCartId").remove();
          }
        }).then(() => {
          // Check users[id].carts[cartId] entry
          return userCartsRef.child(cartId).remove();
        });
      });
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
          const newCartRef = userRef.child('carts').child(cartId);

          // update users node
          newCartRef.set({
            id: cartId,
            name: cartName,
            createdByUserId: cartCreatedByUserId
          });

          // set current cart id
          const updates = {};
          updates["currentCartId"] = cartId;

          userRef.update(updates);

          // update carts-users node
          cartsUsersRef.child(cartId).child(currentUser.uid).set({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          });

          refreshCart(cartId);
        }
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

      if (currentUser && currentUser.uid) {
        const userCartRef = cartsUsersRef.child(cartId).child(currentUser.uid);
        return userCartRef.remove().then(() => {
          const userRef = usersRef.child(currentUser.uid).child(cartId);
          return userRef.remove();
        });
      }
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

      const newProductRef = cartsProducts.child(cartId).child(currentUser.uid).child(product.id);

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
          const productRef = cartsProducts.child(cartId).child(currentUser.auth.uid).child(product.id);
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
     * @param {String} userId user id
     * @param {String} productId product id
     *
     * @return {Number} Quantity of product
     */
    const getQuantity = (userId, productId) => {
      if (products.current[userId] && products.current[userId][productId]) {
        return products.current[userId][productId].quantity;
      }
      return 0;
    };

    const getOrderQuantity = (userId) => {
      let total = 0;
      if (products.current[userId]) {
        angular.forEach(products.current[userId], (product, productId) => {
          total += product.quantity;
        });
      }
      return total;
    }

    const getOrderValue = (userId) => {
      let total = 0;
      if (products.current[userId]) {
        angular.forEach(products.current[userId], (product, productId) => {
          total += product.quantity * product.item.price;
        });
      }
      return total.toFixed(2);;
    };

    /**
     * Get cart's users
     *
     * @return {Promise }
     */
    const getUsers = () => {
      return users;
    };

    const deleteFirebase = () => {
      const ref1 = firebase.database().ref().child('carts-metadata');
      ref1.remove(() => {
        console.log("removedd...");
      });
      const ref2 = firebase.database().ref().child('carts-products');
      ref2.remove(() => {
        console.log("removedd...");
      });
      const ref3 = firebase.database().ref().child('carts-users');
      ref3.remove(() => {
        console.log("removedd...");
      });
      const ref4 = firebase.database().ref().child('users');
      ref4.remove(() => {
        console.log("removedd...");
      });
      const ref5 = firebase.database().ref().child('cart-users');
      ref5.remove(() => {
        console.log("removedd...");
      });
    };

    const setProvider = (provider) => {
      if (carts.current.id) {
        const cartRef = cartsMetadataRef.child(cartId);
        cartRef.set({
          provider: provider
        });
      }
    };

    /**
     * Pay shopping cart
     *
     * @param {String} cartId cart id
     * @param {String} paymentId payment id
     *
     * @return {Promise}
     */
    const payCart = (cartId, paymentId) => {
      const self = this;
      const currentUser = FirebaseAuth.$getAuth();
      return cartsUsersRef.child(cartId).child(currentUser.uid).update({
        payment: paymentId,
        status: "paid"
      });
    };

    /**
     * Set payment request
     *
     * @param {String} cartId cart id
     * @param {String} userId user id
     * @param {String} paymentId payment id
     *
     * @return {Promise}
     */
    const setPayment = (cartId, userId, paymentId) => {
      const self = this;
      return cartsUsersRef.child(cartId).child(userId).update({
        payment: paymentId,
        status: "pending"
      });
    };

    return {
      get,
      createCart,
      deleteCart,
      joinCart,
      leaveCart,
      addItem,
      removeItem,
      getCartList,
      getCarts,
      getProducts,
      getQuantity,
      getUsers,
      deleteFirebase,
      getOrderQuantity,
      getOrderValue,
      setProvider,
      payCart
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseCart', ["$rootScope", "$http", "$q", "$firebaseObject", "$firebaseArray", "FirebaseAuth", "FirebaseUser", FirebaseCartService]);
})();
