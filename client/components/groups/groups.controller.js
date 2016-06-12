'use strict';

class GroupsController {

  constructor($rootScope, $scope, $http, $timeout, $q, $log, socket, Group) {
    var self = this;
    this.errors = [];
    this.groups = [];
    this.socket = socket;
    this.$http = $http;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    self.Group = Group;
    self.simulateQuery = true;
    self.isDisabled = false;
    self.showSuccessMessage = false;
    self.$log = $log;
    self.$q = $q;
    self.$timeout = $timeout;

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

      var group = {
        name: this.group.name,
        address: {
          street: this.group.street,
          street_number: this.group.street_number,
          postcode: this.group.postcode,
          city: this.group.city
        }
      };

      if (this.group.additional_address) {
        group.address.additional_address = this.group.additional_address;
      }

      this.Group.save(group,
        function () {
          self.isSending = false;
          self.showSuccessMessage = true;
          form.$setUntouched();
          form.$setPristine();
          self.group = {};
          self.$timeout(function () {
            console.log("emit event");
            self.$rootScope.$emit('onboarding:next');
          }, 1500);
        },
        function (err) {
          this.isSending = false;
          err = err.data;
          self.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            self.errors[field] = error.message;
          });
        });
    }
  }
}

angular.module('sebaFreshApp')
  .controller('GroupsController', GroupsController);
