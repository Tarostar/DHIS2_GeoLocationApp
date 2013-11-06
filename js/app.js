'use strict';

// Declare app level module which depends on filters, and services
geoloc.module('GeoApp', [
  'ngRoute',
  'GeoApp.filters',
  'GeoApp.services',
  'GeoApp.directives',
  'GeoApp.controllers',
  'ngResource'
]).
config(['$routeProvider', function($routeProvider , RestangularProvider) {
  $routeProvider.when('/form', {templateUrl: 'pages/form.html', controller: 'MyCtrl1'});
  $routeProvider.when('/settings', {templateUrl: 'pages/settings.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
