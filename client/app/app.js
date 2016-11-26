'use strict';

window.openFirebaseConnections = [];

angular.module('sebaFreshApp', [
    'sebaFreshApp.auth',
    'sebaFreshApp.services',
    'sebaFreshApp.assortment',
    'sebaFreshApp.oauth-buttons',
    'sebaFreshApp.constants',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.router',
    'validation.match',
    'ngAnimate',
    'ngMaterial',
    'ngMap',
    'firebase',
  ])
  .config(function($urlRouterProvider, $locationProvider, $mdThemingProvider, $provide) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

    // Whenever $firebaseArray's and $firebaseObjects are created,
    // they'll now be tracked by window.openFirebaseConnections
    $provide.decorator("$firebaseArray", firebaseDecorator);
    $provide.decorator("$firebaseObject", firebaseDecorator);

    function firebaseDecorator($delegate) {
      return function(ref) {
        var list = $delegate(ref);
        window.openFirebaseConnections.push(list);
        return list;
      };
    };

    // SEBA fresh CSS theme configuration
    $mdThemingProvider.definePalette('sebaPrimaryPalette', {
      '50': '007DC6',
      '100': '007DC6',
      '200': '007DC6',
      '300': '007DC6',
      '400': '007DC6',
      '500': '007DC6',
      '600': '007DC6',
      '700': '007DC6',
      '800': '007DC6',
      '900': '007DC6',
      'A100': '007DC6',
      'A200': '007DC6',
      'A400': '007DC6',
      'A700': '007DC6',
      'contrastDefaultColor': 'light', // whether, by default, text (contrast)
      // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.definePalette('sebaAccentPalette', {
      '50': 'FFC120',
      '100': 'FFC120',
      '200': 'FFC120',
      '300': 'FFC120',
      '400': 'FFC120',
      '500': 'FFC120',
      '600': 'FFC120',
      '700': 'FFC120',
      '800': 'FFC120',
      '900': 'FFC120',
      'A100': 'FFC120',
      'A200': 'FFC120',
      'A400': 'FFC120',
      'A700': 'FFC120',
      'contrastDefaultColor': 'light', // whether, by default, text (contrast)
      // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.definePalette('sebaWarnPalette', {
      '50': 'D94848',
      '100': 'D94848',
      '200': 'D94848',
      '300': 'D94848',
      '400': 'D94848',
      '500': 'D94848',
      '600': 'D94848',
      '700': 'D94848',
      '800': 'D94848',
      '900': 'D94848',
      'A100': 'D94848',
      'A200': 'D94848',
      'A400': 'D94848',
      'A700': 'D94848',
      'contrastDefaultColor': 'light', // whether, by default, text (contrast)
      // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('sebaPrimaryPalette')
      .accentPalette('sebaAccentPalette')
      .warnPalette('sebaWarnPalette');
  });
