'use strict';

class GroupsController {

  constructor($rootScope, $scope, $http, $q, $log, socket, Group, Auth, NgMap, ShopService) {
    var self = this;
    this.errors = [];
    this.groups = [];
    this.socket = socket;
    this.NgMap = NgMap;
    this.$http = $http;
    this.$scope = $scope;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$rootScope = $rootScope;
    self.Group = Group;
    this.ShopService = ShopService;
    self.simulateQuery = true;
    self.isDisabled = false;
    self.$log = $log;
    self.$q = $q;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('group');
    });
  }

  $onInit() {
    this.$http.get('/api/groups').then(response => {
      this.groups = response.data;
      this.socket.syncUpdates('group', this.groups);
    });
  }

  createGroup(form) {
    var self = this;

    if (form.$valid && !this.isSending) {
      this.submitted = true;
      this.isSending = true;

      var query = this.group.street + " " + this.group.street_number + " " + this.group.postcode + " " + this.group.city;

      self.NgMap.getGeoLocation(query).then(function (geolocation) {
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

        self.Group.save(group,
          function (data) {
            var createdGroup = data.group;
            var createdCart = data.cart;
            // TODO
            self.ShopService.queryCart();
            self.isSending = false;
            form.$setUntouched();
            form.$setPristine();
            self.group = {};
            self.$rootScope.$emit('onboarding:next');
          },
          function (err) {
            self.isSending = false;
            err = err.data;
            self.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, (error, field) => {
              form[field].$setValidity('mongoose', false);
              self.errors[field] = error.message;
            });
          });
      });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('GroupsController', GroupsController);
