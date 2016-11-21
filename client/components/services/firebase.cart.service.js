'use strict';

(function() {
  function FirebaseCartService($http, $firebaseObject, $firebaseArray, FirebaseAuth) {

    var currentCartId = "-KWsMtWLpQH7hLc234nf";

    const cartsMetadataRef = firebase.database().ref().child("carts-metadata");
    const usersCartRef = firebase.database().ref().child('cart-users');
    const cartProducts = firebase.database().ref().child('cart-products');
    const usersRef = firebase.database().ref().child('users');
    const invitationsRef = firebase.database().ref().child('invitations');

    const get = (cartId) => {
      const cartRef = cartsMetadataRef.child(cartId);
      return cartRef.once('value').then((snapshot) => {
        return {
          cart: snapshot.val(),
          cartRef
        };
      });
    };

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

    const deleteCart = (cartId) => {
      const self = this;
      const currentUser = FirebaseAuth.$getAuth();
      const userCartRef = usersCartRef.child(currentUser.uid).child('carts').child(cartId);
      const cartRef = cartsMetadataRef.child(cartId);

      userCartRef.remove();
      cartRef.remove();
    }

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
          const userRef = usersCartRef.child(currentUser.uid);
          userRef.child('carts').child(cartId).set({
            id: cartId,
            name: cartName,
            createdByUserId: cartCreatedByUserId
          });
        }

        // TODO Setup products listeners
      });
    };

    const leaveCart = (cartId) => {
      const self = this,
        userCartRef = usersCartRef.child(cartId);

      const currentUser = FirebaseAuth.$getAuth();

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

    const getCartList = () => {
      const userCartsRef = usersCartRef.child(FirebaseAuth.$getAuth().uid).child("carts");
      return $firebaseArray(userCartsRef);
    };

    const getCart = (cartId) => {
      const cartRef = cartsMetadataRef.child(cartId);
      return $firebaseObject(cartRef);
    };

    const setCurrentCart = (cartId) => {
      if (!cartId) {
        return
      }
      currentCartId = cartId;
    }

    const getCurrentCart = () => {
      const currentUser = FirebaseAuth.$getAuth();
      if (!currentUser) {
        return;
      }
      const cartRef = cartsMetadataRef.child(currentCartId);
      return $firebaseObject(cartRef);
    }

    const getCurrentCartProducts = () => {
      const currentUser = FirebaseAuth.$getAuth();
      if (!currentUser) {
        return;
      }
      const cartProductsRef = cartProducts.child(currentCartId);
      return $firebaseObject(cartProductsRef);
    }

    const userIsAdmin = (cartId) => {
      const cartRef = cartsMetadataRef.child(cartId);
      const currentUser = FirebaseAuth.$getAuth();
      return cartRef.createdByUserId === currentUser.uid;
    };

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
            if (oldItem.quantity > 1) {
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

    const getUsersByCart = () => {};

    return {
      get,
      createCart,
      deleteCart,
      joinCart,
      leaveCart,
      addItem,
      removeItem,
      getCartList,
      getUsersByCart,
      getCart,
      setCurrentCart,
      getCurrentCart,
      getCurrentCartProducts,
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseCart', ["$http", "$firebaseObject", "$firebaseArray", "FirebaseAuth", FirebaseCartService]);
})();
