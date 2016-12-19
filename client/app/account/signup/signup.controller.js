'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor($state, $stateParams, $location, FirebaseAuth, FirebaseUser) {
    this.$stateParams = $stateParams;
    this.FirebaseAuth = FirebaseAuth;
    this.FirebaseUser = FirebaseUser;
    this.$state = $state;
    this.$location = $location;
    this.redirectUrl = $stateParams.redirectUrl || false;
  }

  resetPicture() {
    delete this.user.picture;
  }

  uploadProfilePicture(dataURI) {
    const currentUser = this.FirebaseAuth.$getAuth();
    if (!currentUser || !dataURI) {
      return;
    }
    const blobFile = this._dataURItoBlob(dataURI);

    const picRef = firebase.storage().ref(`${currentUser.uid}/picture/profile.png`);
    return picRef.put(blobFile).then(function(snapshot) {
      var url = snapshot.metadata.downloadURLs[0];
      return url;
    }).catch((err) => {
      console.log("err: ", err);
    });
  }

  register(form) {
    var self = this;
    this.submitted = true;

    if (form.$valid) {
      this.FirebaseAuth.$createUserWithEmailAndPassword(this.user.email, this.user.password).then((createdUser) => {
        return self.uploadProfilePicture(self.user.croppedDataUrl).then((photoURL) => {
          return createdUser.updateProfile({
            displayName: self.user.first_name + " " + self.user.last_name,
            photoURL: photoURL
          }).then(() => {
            return {
              uid: createdUser.uid,
              displayName: self.user.first_name + " " + self.user.last_name,
              photoURL: photoURL
            }
          });
        });
      }).then((currentUser) => {
        return self.FirebaseUser.createUser(currentUser.uid, currentUser.displayName, currentUser.photoURL, self.user.email).then(() => {
          if (self.redirectUrl) {
            self.$location.path(self.$stateParams.redirectUrl);
          } else {
            self.$state.go('onboarding');
          }
        });
      }).catch((error) => {
        self.errors.other = error.message;
      });
    }
  }

  /**
   * Converts data uri to Blob. Necessary for uploading.
   * @see
   *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
   * @param  {String} dataURI
   * @return {Blob}
   */
  _dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }
}

angular.module('sebaFreshApp')
  .controller('SignupController', SignupController);
