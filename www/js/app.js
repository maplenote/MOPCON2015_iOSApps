// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


//angular.module.config 無法撈取 $rootScope，只好寫在這裡
var customConfig = {};
//與後端 json 對應的版本控制
customConfig.version = 2;
//選單列表(白名單)，實際顯示的選單由 json 控制
customConfig.menulists = {
  "news":"即時訊息",
  "session":"議程",
  "sponsor":"贊助",
  "speaker":"講者",
  "location":"交通指南",
  "community":"社群"
};

angular.module('starter', ['ionic', 'starter.controllers','starter.services'])
  .run(function($ionicPlatform,$rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    $rootScope.version = customConfig.version;
    $rootScope.menulists = customConfig.menulists;
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'appCtrl'
      })
      .state('app.sessionDetail', {
        url: "/session/:id",
        views: {
          'menuContent': {
            templateUrl: "templates/sessionDetail.html",
            controller: 'sessionDetailCtrl'
          }
        }
      });
    for(key in customConfig.menulists)
    {
      if(key == 'app') { //以防萬一
        continue;
      }
      $stateProvider.state('app.'+key, {
        cache: false,
        url: "/"+key,
        views: {
          'menuContent': {
            templateUrl: "templates/"+key+".html",
            controller: key+'Ctrl'
          }
        }
      });

    }
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/news');
  });
