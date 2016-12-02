'use strict';

class GroupsController {

  constructor($rootScope, $scope, NgMap, FirebaseCart, FirebaseUser) {
    const self = this;
    this.$rootScope = $rootScope;
    this.NgMap = NgMap;
    this.FirebaseCart = FirebaseCart;

    this.carts = FirebaseCart.getCartList();
    this.currentUser = FirebaseUser.getCurrentUser();
  }

  createGroup(form) {
    var self = this;

    if (form.$valid && !this.isSending) {
      this.submitted = true;
      this.isSending = true;

      var query = this.cart.street + " " + this.cart.street_number + " " + this.cart.postcode + " " + this.cart.city;

      self.NgMap.getGeoLocation(query).then(function(geolocation) {
        var latitude = geolocation.lat();
        var longitude = geolocation.lng();

        var group = {
          name: self.cart.name,
          admin: self.currentUser.auth.uid,
          address: {
            street: self.cart.street,
            street_number: self.cart.street_number,
            postcode: self.cart.postcode,
            city: self.cart.city,
            geolocation: {
              latitude: latitude,
              longitude: longitude
            }
          }
        };

        if (self.cart.additional_address) {
          group.address.additional_address = self.cart.additional_address;
        }

        self.FirebaseCart.createCart(group.name, group.address).then((cartKey) => {
          self.currentUser.data.currentCartId = cartKey;
          self.currentUser.data.$save().then(() => {
            console.log("current user saved: ");
            self.isSending = false;
            form.$setUntouched();
            form.$setPristine();
            self.cart = {};
            self.$rootScope.$emit('onboarding:next');
          }, (error) => {
            console.log("error: ", error);
          });

        }).catch((err) => {
          self.isSending = false;
          err = err.data;
          self.errors = {};

          // TODO Update validity of form fields that match errors
        });
      });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('GroupsController', GroupsController);
