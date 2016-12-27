'use strict';

(function() {
  function FirebaseUserService($rootScope, $firebaseObject, FirebaseAuth, $q) {

    const usersRef = firebase.database().ref().child("users");

    var user = {};
    user.auth = null;
    user.data = null;

    // Auth listener
    FirebaseAuth.$onAuthStateChanged((authUser) => {

      if (authUser) {
        user.auth = authUser;
        const userRef = usersRef.child(authUser.uid);
        user.data = $firebaseObject(userRef);
      }

    });

    /**
     *  Get current user's info
     *
     * @return {Promise}
     */
    const getCurrentUser = () => {
      return user;
    }

    const logoutUser = () => {
      alert("logout user");
      user.auth = null;
      user.data = null;
    }

    /**
     * Create user
     *
     * @param {Number} userId
     * @param {String} displayName
     *
     * @return {Promise}
     */
    const createUser = (userId, displayName, photoURL, email) => {
      const newUserRef = usersRef.child(userId);
      const newUser = {
        id: userId,
        displayName: displayName,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };
      if (photoURL)  {
        newUser.photoURL = photoURL;
      }
      if (email) {
        newUser.email = email;
      }
      return newUserRef.set(newUser);
    }

    /**
     * Load user info by id
     *
     * @param {String} userId      user id
     * @param {Function} callback
     *
     */
    const loadMetadata = (userId, callback) => {
      const userRef = usersRef.child(userId);
      callback($firebaseObject(userRef));
    }

    const setCurrentCart = (cartId) => {
      user.data.currentCartId = cartId;
      return user.data.$save();
    };

    const setCurrentProvider = (provider) => {
      if (user.data) {
        user.data.currentProvider = provider;
        return user.data.$save();
      } else {
        $rootScope.currentProvider = provider;
      }
    };

    return {
      getCurrentUser,
      createUser,
      loadMetadata,
      logoutUser,
      setCurrentCart,
      setCurrentProvider
    };
  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseUser', ["$rootScope", "$firebaseObject", "FirebaseAuth", "$q", FirebaseUserService]);
})();
