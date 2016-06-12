'use strict';

class GroupCellController {

  constructor($scope, FacebookService, $http) {
    this.FacebookService = FacebookService;
    this.$http = $http;
  }

  deleteGroup(group) {
    console.log("delete group");
    this.$http.delete('/api/groups/' + group._id);
  }

  inviteFriends(group) {
    var url = location.protocol + '//' + location.hostname + ':' + location.port + '/join/' + group._id;
    this.FacebookService.sendMessage(url);
  }
}

angular.module('sebaFreshApp')
  .controller('GroupCellController', GroupCellController);
