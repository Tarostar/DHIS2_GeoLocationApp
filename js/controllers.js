'use strict';

/* Controllers */

angular.module('GeoApp.controllers', []).
  controller('MyCtrl1',['$scope', 'meService',function($scope, meService) {

        $scope.dhisAPI = dhisAPI;

        var me = meService.get(function() {
            $scope.name = me.name;
            $scope.organisationUnit = me.organisationUnits[0].name;
            $scope.organisationUnits = me.organisationUnits;
        });
        console.log(meService.get());
  }])
  .controller('MyCtrl2', ['$scope', 'userSettingsService',function($scope, userSettingsService) {
        var userSetting = userSettingsService.get(function() {
            $scope.earlierSetting = userSetting.value;
        });

        $scope.saveSetting = function() {
            console.log('Saving setting:'+$scope.setting);
            userSettingsService.saveSetting({},{value:$scope.setting});
        }

        $scope.refreshSetting = function() {
            userSetting = userSettingsService.get(function() {
                $scope.earlierSetting = userSetting.value;
            });
        }

    }]);