'use strict';

/* Services */

var GeoAppServices = angular.module('GeoApp.services', ['ngResource']);

GeoAppServices.factory('meService', ['$resource',
    function($resource){
        console.log('DHIS API:'+dhisAPI);
        return $resource(dhisAPI+'/api/test.json', {}, {
            getPage: {method:'GET', isArray:false}
        });
    }]);

GeoAppServices.factory('userSettingsService', ['$resource',
    function($resource){
        console.log('DHIS API:'+dhisAPI);
        return $resource(dhisAPI+'/api/userSettings/exampleapp.usersetting', {}, {
            saveSetting: {method:'POST', isArray:false, headers: {'Content-Type': 'text/plain'}}
        });
    }]);