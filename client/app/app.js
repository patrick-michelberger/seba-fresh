'use strict';

angular.module('sebaFreshApp', [
  'sebaFreshApp.auth',
  'sebaFreshApp.shop',
  'sebaFreshApp.services',
  'sebaFreshApp.admin',
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
  'ngMap'
])
  .config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

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
       '200', '300', '400', 'A100'],
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
       '200', '300', '400', 'A100'],
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
       '200', '300', '400', 'A100'],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('sebaPrimaryPalette')
      .accentPalette('sebaAccentPalette')
      .warnPalette('sebaWarnPalette');

    $mdIconProvider.defaultIconSet('assets/mdi.svg')
  }).run(['$rootScope', '$window', 'Auth',
    function ($rootScope, $window, Auth) {

      // Global variables and methods
      $rootScope.user = {};
      $rootScope.isLoggedIn = Auth.isLoggedIn;

      $window.fbAsyncInit = function () {
        // Executed when the SDK is loaded
        FB.init({

          /*
           The app id of the web app;
           To register a new app visit Facebook App Dashboard
           ( https://developers.facebook.com/apps/ )
          */

          appId: '1197347246942091',

          redirect_uri: location.protocol + '//' + location.hostname + ':' + location.port,

          /*
           Adding a Channel File improves the performance
           of the javascript SDK, by addressing issues
           with cross-domain communication in certain browsers.
          */

          channelUrl: 'app/channel.html',

          /*
           Set if you want to check the authentication status
           at the start up of the app
          */

          status: true,

          /*
           Enable cookies to allow the server to access
           the session
          */

          cookie: true,

          /* Parse XFBML */

          xfbml: true
        });
        //sAuth.watchAuthenticationStatusChange();
      };
      (function (d) {
        // load the Facebook javascript SDK

        var js,
          id = 'facebook-jssdk',
          ref = d.getElementsByTagName('script')[0];

        if (d.getElementById(id)) {
          return;
        }

        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";

        ref.parentNode.insertBefore(js, ref);

      }(document));
      }]);
