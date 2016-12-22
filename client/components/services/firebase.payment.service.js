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
     * Create payment request
     *
     * @param {Object} payer payer
     * @param {String} payer.email payer email
     * @param {String} payer.uid payer uid
     * @param {String} payer.displayName payer display name
     * @param {Object} receiver receiver
     * @param {String} receiver.email receiver email
     * @param {String} receiver.uid receiver uid
     * @param {String} receiver.displayName receiver display name
     * @param {Number} amount amount
     * @param {String} cartId cart id
     * @return {Promise}
     */
    const create = (payer, receiver, amount, cartId) => {
      var self = this,
        newPaymentRef = paymentsRef.push();

      if (!payer.uid || !payer.displayName || !payer.email || !sender.uid || !sender.displayName || !sender.email || !amount ||  !cartId) {
        return;
      }

      const newPayment = {
        id: newPaymentRef.key,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        paypalId: String,
        payerId: payer.uid,
        payerDisplayName: payer.displayName,
        payerEmail: payer.email,
        senderId: sender.uid,
        senderDisplayName: sender.displayName,
        senderEmail: sender.email,
        cartId: cartId,
      };

      return newPaymentRef.set(newPayment).then(() => {
        FirebaseCart.setPayment(cartId, payer.uid, newPaymentRef.key);
        return newPaymentRef.key;
      }).catch((error) => {
        console.log("Error: ", error);
      });
    }

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

    const checkPaypalLink = (username) => {
      $http({
        //url: 'https://www.paypal.com/paypalme/api/slug/available/' + username,
        url: 'https://www.paypal.me/' + username,
        method: 'GET',
        data: {}
      }).then((response) => {
        console.log("response: ", response);
      }, (data, status) => {
        console.log("error: ", data);
      });
    };

    return {
      get,
      paypal,
      checkPaypalLink
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebasePaymentService', ["$http", "$firebaseObject", "FirebaseAuth", "FirebaseCart", FirebasePaymentService]);
})();
