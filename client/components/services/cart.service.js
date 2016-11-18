'use strict';

(function() {
  function FirebaseCartService($firebaseObject, $firebaseArray, FirebaseAuth) {

    const cartsMetadataRef = firebase.database().ref().child("carts-metadata");
    const usersCartRef = firebase.database().ref().child('cart-users');
    const usersRef = firebase.database().ref().child('users');

    const get = (cartId) => {
      return cartsMetadataRef.child(cartId).once('value').then((snapshot) => {
        return snapshot.val();
      });
    };

    const create = (cartName, cartAddress) => {
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

      return get(cartId).then((cart) => {
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

    const userIsAdmin = (cartId) => {

    }

    const userIsAdmin = (cartId) => {
      const cartRef = cartsMetadataRef.child(cartId);
      const currentUser = FirebaseAuth.$getAuth();
      return cartRef.createdByUserId === currentUser.uid;
    };

    // TODO
    const addItem = (cartId, itemId) => {};
    const removeItem = (cartId, itemId) => {};

    const inviteUser = (userId, cartId) => {};
    const acceptInvite = (inviteId) => {};
    const declineInvite = (inviteId) => {};

    const getUsersByCart = () => {};
    const getCart = () => {};

    return {
      get,
      create,
      deleteCart,
      joinCart,
      leaveCart,
      addItem,
      removeItem,

      inviteUser,
      acceptInvite,
      declineInvite,

      getCartList,
      getUsersByCart,
      getCart,
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseCart', ["$firebaseObject", "$firebaseArray", "FirebaseAuth", FirebaseCartService]);
})();
