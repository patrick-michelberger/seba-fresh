'use strict';

(function() {
  function FirebaseCartService($firebaseObject, FirebaseAuth) {

    const cartsMetadataRef = firebase.database().ref().child("carts-metadata");
    const usersCartRef = firebase.database().ref().child('cart-users');
    const usersRef = firebase.database().ref().child('users');

    const get = () => {

    };

    const joinCart = (cartId) => {
      const self = this;

      get(cartId).then((cart) => {
        const cartName = cart.name;
        const currentUser = FirebaseAuth.$getAuth();

        if (!cartId ||  !cartName) return;

        // Skip if we're already joined the cart
        // TODO if (self._carts[cartId])
        // self._rooms[roomId] = true;


        if (currentUser) {
          const userRef = usersCartRef.child(currentUser.uid);
          userRef.child('carts').child(cartId).set({
            id: cartId,
            name: cartName,
            active: true
          });
        }

        // Set presence bit for the cart and queue it for removal on disconnect.
        /*
        var presenceRef = self._firechatRef.child('room-users').child(roomId).child(self._userId).child(self._sessionId);
        self._queuePresenceOperation(presenceRef, {
          id: self._userId,
          name: self._userName
        }, null);
        */

        // Invoke our callbacks before we start listening for new messages.
        // Setup message listeners

      });
    };

    const leaveCart = (cartId) => {
      const self = this,
        userCartRef = usersCartRef.child(cartId);

      const currentUser = FirebaseAuth.$getAuth();

      if (currentUser) {
        var presenceRef = userCartRef.child(currentUser.uid).child(self._sessionId);

        // Remove presence bit for the room and cancel on-disconnect removal.
        self._removePresenceOperation(presenceRef, null);

        // Remove session bit for the room.
        self._userRef.child('rooms').child(roomId).remove();
      }

      delete self._rooms[roomId];

      // Invoke event callbacks for the room-exit event.
      self._onLeaveRoom(roomId);
    };

    const create = (cartName, cartAddress) => {
      var self = this,
        newCartRef = cartsMetadataRef.push();

      // TODO Change to server side timestamp: firebase.database.ServerValue.TIMESTAMP
      var newCart = {
        id: newCartRef.key,
        name: cartName,
        address: cartAddress,
        admin: FirebaseAuth.$getAuth().uid,
        // TODO admin: this._userId,
        createdAt: new Date()
      };

      return newCartRef.set(newCart).then(() => {
        return newCartRef.key;
      });
    }

    return {
      create,
      get,
      joinCart,
      leaveCart
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseCart', ["$firebaseObject", 'FirebaseAuth', FirebaseCartService]);
})();
