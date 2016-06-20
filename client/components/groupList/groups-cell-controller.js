'use strict';

class GroupCellController {

  constructor($rootScope, $scope, $window, FacebookService, $http, Auth, $mdDialog, $mdMedia) {
    this.baseShareUrl = location.protocol + '//' + location.hostname + ':' + location.port;
    this.FacebookService = FacebookService;
    this.$http = $http;
    this.Auth = Auth;
    this.$window = $window;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  deleteGroup(group) {
    this.$http.delete('/api/groups/' + group._id);
  }

  inviteFriends(group) {
    var url = this.baseShareUrl + '/group/' + group._id + '/invite';
    this.FacebookService.sendMessage(url).catch(function (err) {
      console.log("FacebookService: err:", err);
    }).then(function () {
      console.log("Faceboko dialog closed");
    }).finally(function () {
      console.log("Finally, facebook dialog closed");
    });
  }

  showInviteDialog(group) {
    var ev = this.$event;
    var self = this;
    var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs')) && this.customFullscreen;

    function DialogController($scope, $state, $mdDialog, $window) {
      $scope.group = self.group;
      $scope.refreshMap = self.refreshMap;
      $scope.decline = function () {
        $mdDialog.cancel();
      };
      $scope.next = function () {
        $mdDialog.hide("next");
      };
      $scope.share = function (service) {
        var url = "";
        var shareUrl = this.baseShareUrl + '/group/' + group._id + '/invite';
        var refUrl = "";

        switch (service) {
        case "facebook":
          url = "http://m.facebook.com/sharer.php?u=" + shareUrl + "&redirect_uri=https://sebafresh.herokuapp.com/onboarding/inviteSent";
          break;
        case "whatsapp":
          url = "whatsapp://send?text=" + shareUrl;
          break;
        default:
          url = "mailto:?subject=LOVE this from ABOUT YOU!&amp;body=Hallo! Guck mal hier: auf " + shareUrl + " gefällt Dir bestimmt. Viel Spaß damit!";
        }
        $window.open(url, '_blank');
      }
    }

    this.$mdDialog.show({
      templateUrl: 'assets/templates/invite-dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: useFullScreen,
      controller: ['$scope', '$state', '$mdDialog', '$window', DialogController],
      bindToController: true,
    }).then(function (answer) {
        self.$rootScope.$emit('onboarding:invited');
      },
      function () {
        console.log('You cancelled the dialog.');
      });

    self.$scope.$watch(function () {
      return self.$mdMedia('xs') || self.$mdMedia('sm');
    }, function (wantsFullScreen) {
      self.customFullscreen = (wantsFullScreen === true);
    });
  }
}

angular.module('sebaFreshApp')
  .controller('GroupCellController', GroupCellController);
