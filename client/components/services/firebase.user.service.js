'use strict';

(function() {
  function FirebaseUserService($firebaseObject, FirebaseAuth, $q) {

    const usersRef = firebase.database().ref().child("users");

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

    const createUser = (authData) => {
      const newUserRef = usersRef.child(authData.uid);
      const newUser = {
        id: authData.uid,
        displayName: authData.displayName,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };
      return newUserRef.set(newUser);
    }

    const loadMetadata = (uid, callback) => {
      const userRef = usersRef.child(uid);
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
