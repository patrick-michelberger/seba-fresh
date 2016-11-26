'use strict';

(function() {
  function FirebaseUserService($firebaseObject, FirebaseAuth, $q) {

    const usersRef = firebase.database().ref().child("users");


    /**
     *  Get current user's info
     *
     * @return {Promise}
     */
    const getUser = () => {
      const deferred = $q.defer();
      const authUser = FirebaseAuth.$getAuth();
      if (authUser && authUser.uid) {
        const userRef = usersRef.child(authUser.uid);
        deferred.resolve($firebaseObject(userRef));
      } else {
        FirebaseAuth.$onAuthStateChanged((authUser) => {
          if (authUser && authUser.uid) {
            const userRef = usersRef.child(authUser.uid);
            deferred.resolve($firebaseObject(userRef));
          }
        });
      }
      return deferred.promise;
    }


    /**
     * Create user
     *
     * @param {Number} userId
     * @param {String} displayName
     *
     * @return {Promise}
     */
    const createUser = (userId, displayName) => {
      const newUserRef = usersRef.child(userId);
      const newUser = {
        id: userId,
        displayName: displayName,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };
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

    return {
      getUser,
      createUser,
      loadMetadata,
    };
  }

  angular.module('sebaFreshApp.services')
    .factory('FirebaseUser', ["$firebaseObject", "FirebaseAuth", "$q", FirebaseUserService]);
})();
