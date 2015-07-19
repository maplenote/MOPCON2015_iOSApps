angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
})
.controller('agendaCtrl', function($scope,$http,agendaService) {
  $scope.agendaData = '';
  agendaService.getData().success(function(data){
    $scope.agendaData = data;
  });
})
.controller('agendaDdetailCtrl' ,function($scope, $stateParams,agendaService) {
  $scope.Detail = '';
  agendaService.getData().success(function(data) {
    for (var i = 0; i < data.Day1.length; i++) {
      for(var j=0; j<data.Day1[i].Section.length;j++){
        if (data.Day1[i].Section[j].id == $stateParams.id) {
          $scope.Detail = data.Day1[i].Section[j];
        }
      }
    }
      // $scope.Detail = data.Day1.Section.get($stateParams.id);
  });
});
