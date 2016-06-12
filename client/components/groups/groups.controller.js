'use strict';

class GroupsController {

  constructor($rootScope, $scope, $http, $timeout, $q, $log, socket, Group, FacebookService) {
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
    self.FacebookService = FacebookService;
    self.$timeout = $timeout;
    self.repos = this.loadAll();
    self.querySearch = this.querySearch;
    self.selectedItemChange = this.selectedItemChange;
    self.searchTextChange = this.searchTextChange;

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

  sendMessage() {
    var url = location.protocol + '//' + location.hostname + ':' + location.port + '/join';
    this.FacebookService.sendMessage(url);
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

  deleteGroup(group) {
    this.$http.delete('/api/groups/' + group._id);
  }

  /**
   * Search for repos... use $timeout to simulate
   * remote dataservice call.
   */
  querySearch(query) {
    var results = query ? this.repos.filter(this.createFilterFor(query)) : this.repos,
      deferred;
    if (this.simulateQuery) {
      deferred = this.$q.defer();
      this.$timeout(function () {
        deferred.resolve(results);
      }, Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }

  searchTextChange(text) {
    this.$log.info('Text changed to ' + text);
  }

  selectedItemChange(item) {
      this.$log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `components` list of key/value pairs
     */
  loadAll() {
      var repos = [
        {
          'name': 'Angular 1',
          'url': 'https://github.com/angular/angular.js',
          'watchers': '3,623',
          'forks': '16,175',
        },
        {
          'name': 'Angular 2',
          'url': 'https://github.com/angular/angular',
          'watchers': '469',
          'forks': '760',
        },
        {
          'name': 'Angular Material',
          'url': 'https://github.com/angular/material',
          'watchers': '727',
          'forks': '1,241',
        },
        {
          'name': 'Bower Material',
          'url': 'https://github.com/angular/bower-material',
          'watchers': '42',
          'forks': '84',
        },
        {
          'name': 'Material Start',
          'url': 'https://github.com/angular/material-start',
          'watchers': '81',
          'forks': '303',
        }
      ];
      return repos.map(function (repo) {
        repo.value = repo.name.toLowerCase();
        return repo;
      });
    }
    /**
     * Create filter function for a query string
     */
  createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(item) {
      return (item.value.indexOf(lowercaseQuery) === 0);
    };
  }

}

angular.module('sebaFreshApp')
  .controller('GroupsController', GroupsController);
