angular.module('starter.controllers', [])
  .controller('appCtrl', function($scope,getDataServ) {
    getDataServ.refreshAllData().then(function(){
      $scope.menulists = [];
      var localMenu = getDataServ.getMenu();
      //customConfig 在 root 上，所以就不用 $rootScope 了 (少一層雙向綁定)
      if(customConfig.menulists === undefined){
        //TODO 異常
      }
      for(key in localMenu){
        var item = localMenu[key];
        if(customConfig.menulists[item] !== undefined)
        {
          $scope.menulists.push({
            "url": item,
            "title": customConfig.menulists[item]
          });
        }
      }
    });
  })
  .controller('sessionCtrl', function($scope, getDataServ) {
    var sessionData = getDataServ.getCtrlData('session');
    $scope.sessionData = sessionData;
  })
  .controller('sessionDetailCtrl', function($scope, $stateParams, getDataServ) {
    var sessionData = getDataServ.getCtrlData('sessionDetail');
    $scope.detail = {};
    if(sessionData["no"+$stateParams.id] !== undefined){
      $scope.detail = sessionData["no"+$stateParams.id];
    }
  })
  .controller('newsCtrl', function($scope, getDataServ) {

  })
  .controller('speakerCtrl', function($scope, getDataServ) {

  })
  .controller('sponsorCtrl', function($scope, getDataServ) {

  })
  .controller('locationCtrl', function($scope, getDataServ) {

  })
  .controller('communityCtrl', function($scope, getDataServ) {

  });
