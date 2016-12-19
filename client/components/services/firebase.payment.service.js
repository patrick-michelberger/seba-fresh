'use strict';

(function() {
  function FirebasePaymentService($http, $firebaseObject, FirebaseAuth, FirebaseCart) {
    const paymentsRef = firebase.database().ref().child('payments');

    /**
     * Get payment
     *
     * @param {String} paymentId payment id
     *
     * @return {Promise}
     */
    const get = (paymentId) => {
      const paymentRef = paymentsRef.child(paymentId);
      return $firebaseObject(paymentRef);
    };

    /**
     * Pay via paypal
     *
     * @param {String} paymentId payment id
     *
     * @return {Promise}
     */
    const paypal = (paymentId) => {
      var self = this;
      const currentUser = FirebaseAuth.$getAuth();

      if (!currentUser) {
        return;
      }

      return paymentId.child(paymentId).once('value').then((snapshot) => {
        const payment = snapshot.val();
        if (payment === null) {
          throw new Error('paypal(' + paymentId + '): invalid payment id');
        } else {
          FirebaseCart.payCart(payment.cartId, payment.id);
          return paymentsRefs.child(paymentId).update({
            'status': 'payed',
            'toUserName': currentUser.displayName,
            'toUserId': currentUser.uid,
          });
        }
      });
    };

    /**
     * Invite user to a shopping cart by email
     *
     * @param {String} email  invitee's email
     * @param {String} cartId cart id
     *
     * @return {Promise}
     */
    const inviteUserByEmail = (email, cartId) => {
      const self = this;
      const currentUser = FirebaseAuth.$getAuth();

      const sendInvite = () => {
        const inviteRef = invitationsRef.push();

        const newInvitation = {
          id: inviteRef.key,
          fromUserId: currentUser.uid,
          fromUserName: currentUser.displayName,
          cartId: cartId,
          email: email
        };

        return inviteRef.set(newInvitation).then(() => {
          return $http.post('/api/invitations', {
            from: {
              id: newInvitation.fromUserId,
              name: newInvitation.fromUserName
            },
            to: newInvitation.email,
            invitation: newInvitation.id,
            status: "pending"
          });
        });

        // TODO Handle listen unauth / failure in case we're kicked.
        // inviteRef.on('value', self._onFirechatInviteResponse, function() {}, self);
      }

      if (!currentUser) {
        // TODO self._onAuthRequired
        return;
      }

      return sendInvite();
    };

    /**
     * Invite user to a shopping cart by user id
     *
     * @param {String} userId user id
     * @param {String} cartId cart id
     *
     * @return {Promise}
     */
    const inviteUserByUserId = (userId, cartId) => {
      const self = this;
      const currentUser = FirebaseAuth.$getAuth();

      const sendInvite = () => {
        const inviteRef = usersRef.child(userId).child('invites').push();

        inviteRef.set({
          id: inviteRef.key,
          fromUserId: currentUser.uid,
          fromUserName: currentUser.displayName,
          cartId: cartId,
        });

        // TODO Handle listen unauth / failure in case we're kicked.
        // inviteRef.on('value', self._onFirechatInviteResponse, function() {}, self);
      }

      if (!currentUser) {
        // TODO self._onAuthRequired
        return;
      }

      get(cartId).then((cart) => {
        sendInvite();
      });
    };

    return {
      get,
      paypal
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebasePaymentService', ["$http", "$firebaseObject", "FirebaseAuth", "FirebaseCart", FirebasePaymentService]);
})();
