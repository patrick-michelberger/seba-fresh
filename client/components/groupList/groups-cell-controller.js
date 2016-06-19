'use strict';

class GroupCellController {

  constructor($scope, $window, FacebookService, $http, Auth) {
    this.baseShareUrl = location.protocol + '//' + location.hostname + ':' + location.port;
    this.FacebookService = FacebookService;
    this.$http = $http;
    this.Auth = Auth;
    this.$window = $window;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  deleteGroup(group) {
    console.log("delete group");
    this.$http.delete('/api/groups/' + group._id);
  }

  inviteFriends(group) {
    var url = this.baseShareUrl + '/group/' + group._id + '/invite';
    console.log("url: ", url);
    //this.FacebookService.sendMessage(url);
  }

  share(service, group) {
    console.log("share..");
    var url = "";
    var shareUrl = this.baseShareUrl + '/group/' + group._id + '/invite';
    var refUrl = "";

    switch (service) {
    case "facebook":
      url = "http://m.facebook.com/sharer.php?u=" + shareUrl;
      break;
    case "whatsapp":
      url = "whatsapp://send?text=" + shareUrl;
      break;
    default:
      url = "mailto:?subject=LOVE this from ABOUT YOU!&amp;body=Hallo! Guck mal hier: auf " + shareUrl + " gefällt Dir bestimmt. Viel Spaß damit!";
    }
    this.$window.open(url, '_blank');
  };


}

angular.module('sebaFreshApp')
  .controller('GroupCellController', GroupCellController);
