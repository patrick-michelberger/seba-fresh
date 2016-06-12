'use strict';

class GroupCellController {

  constructor($scope, uiGmapGoogleMapApi) {
    var self = this;

    $scope.map = {
      center: {},
      zoom: 8,
      markers: []
    };

    uiGmapGoogleMapApi.then(function (maps) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        "address": $scope.group.address.street + " " + $scope.group.address.street_number + " " + $scope.group.address.postcode + " " + $scope.group.address.city
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location;
          var latitude = location.lat();
          var longitude = location.lng();
          $scope.map = {
            center: {
              latitude: latitude,
              longitude: longitude
            },
            zoom: 15,
            markers: []
          };
          var marker = {
            id: Date.now(),
            coords: {
              latitude: latitude,
              longitude: longitude
            }
          };
          $scope.map.markers.push(marker);
          $scope.$apply();
        }
      });
    });
  }
}

angular.module('sebaFreshApp')
  .controller('GroupCellController', GroupCellController);
