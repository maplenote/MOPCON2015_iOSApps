


angular.module('starter.services', [])
.factory('agendaService', function($http) {
  var urlBase = './js/testJson/agenda.json';
  var Service = {
    getData: function() {
        return $http.get(urlBase);
    }
};
  return Service;
});