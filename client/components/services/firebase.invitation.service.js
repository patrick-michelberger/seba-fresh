'use strict';

(function() {
  function FirebaseInvitationService($http, $firebaseObject, FirebaseAuth, FirebaseCart) {
    const invitationsRef = firebase.database().ref().child('invitations');

    const get = (invitationId) => {
      const invitationRef = invitationsRef.child(invitationId);
      return $firebaseObject(invitationRef);
    };

    const accept = (inviteId) => {
      var self = this;
      const currentUser = FirebaseAuth.$getAuth();

      if (!currentUser) {
        return;
      }

      return invitationsRef.child(inviteId).once('value').then((snapshot) => {
        const invite = snapshot.val();
        if (invite === null) {
          throw new Error('acceptInvite(' + inviteId + '): invalid invite id');
        } else {
          FirebaseCart.joinCart(invite.cartId);
          return invitationsRef.child(inviteId).update({
            'status': 'accepted',
            'toUserName': currentUser.displayName,
            'toUserId': currentUser.uid,
          });
        }
      });
    };

    const decline = (inviteId) => {
      const self = this;
      const currentUser = FirebaseAuth.$getAuth();

      if (!currentUser) {
        return;
      }

      const updates = {
        'status': 'declined',
        'toUserName': currentUser.displayName,
        'toUserId': currentUser.uid,
      };

      return invitationsRef.child(inviteId).update(updates);
    };

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

      return FirebaseCart.get(cartId).then((response) => {
        const {
          cart,
          cartRef
        } = response;
        return sendInvite();
      });
    };

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
      accept,
      decline,
      inviteUserByEmail,
      inviteUserByUserId
    };

  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseInvitationService', ["$http", "$firebaseObject", "FirebaseAuth", "FirebaseCart", FirebaseInvitationService]);
})();
