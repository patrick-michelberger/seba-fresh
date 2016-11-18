'use strict';

class GroupsController {

  constructor($rootScope, $scope, $http, socket, Group, Auth, NgMap, ShopService, FirebaseCart) {
    const self = this;
    this.errors = [];
    this.socket = socket;
    this.NgMap = NgMap;
    this.$http = $http;
    this.$scope = $scope;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$rootScope = $rootScope;
    self.Group = Group;
    this.ShopService = ShopService;
    self.isDisabled = false;
    this.FirebaseCart = FirebaseCart;
    this.$scope.groups = FirebaseCart.getCartList();
  }

  createGroup(form) {
    var self = this;

    if (form.$valid && !this.isSending) {
      this.submitted = true;
      this.isSending = true;

      var query = this.group.street + " " + this.group.street_number + " " + this.group.postcode + " " + this.group.city;

      self.NgMap.getGeoLocation(query).then(function(geolocation) {
        var latitude = geolocation.lat();
        var longitude = geolocation.lng();

        var group = {
          name: self.group.name,
          admin: self.getCurrentUser()._id,
          address: {
            street: self.group.street,
            street_number: self.group.street_number,
            postcode: self.group.postcode,
            city: self.group.city,
            geolocation: {
              latitude: latitude,
              longitude: longitude
            }
          }
        };

        if (self.group.additional_address) {
          group.address.additional_address = self.group.additional_address;
        }


        self.FirebaseCart.create(group.name, group.address).then((cartKey) => {
          console.log("cartKey:", cartKey);

          /* TODO
          var createdGroup = data.group;
          var createdCart = data.cart;
          // TODO
          self.ShopService.setCurrentCart(createdCart);
          */
          self.isSending = false;
          form.$setUntouched();
          form.$setPristine();
          self.group = {};

          // var carts = self.ShopService.getCarts();
          self.$rootScope.$emit('onboarding:next');

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
