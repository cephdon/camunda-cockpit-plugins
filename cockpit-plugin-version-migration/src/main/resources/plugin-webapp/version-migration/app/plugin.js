define(['angular'], function(angular) {
  
  var ngModule = angular.module('cockpit.plugin.version-migration', []);
  
  var loadProcessDefinition = function(processInstance, $scope, $http, Uri) {
    $http.get(Uri.appUri("engine://engine/:engine/process-definition/" + processInstance.definitionId))
    .success(function(processDefinition) {
      console.log(processDefinition);
      $scope.processDefinition = processDefinition;
    });
  };
  
  var VersionMigrationController = function($scope, $http, Uri) {

    console.log('Process instance id', $scope.processInstance.id);
    console.log('process definition id', $scope.processInstance.definitionId);
    
    loadProcessDefinition($scope.processInstance, $scope, $http, Uri);

    $scope.migrateVersion = function() {
      console.log('migrate the version to ' + $scope.newVersion.version + ' now.');
      $http.post(Uri.appUri("plugin://version-migration/:engine/process-instance-migration/" + 
          $scope.processInstance.id), $scope.newVersion)
        .then(function() {
          // refresh all views?
          // $scope.processData.set('filter', angular.extend({}, $scope.filter));
          window.location.reload();
          console.log('version updated');
        });
    }
  };

  VersionMigrationController.$inject = ["$scope", "$http", "Uri"];

  var Configuration = function Configuration(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.processInstance.runtime.tab', {
      id: 'version-migration',
      label: 'Version Migration',
      url: 'plugin://version-migration/static/app/dashboard.html',
      controller: VersionMigrationController,
      priority: 1
    });
  };

  Configuration.$inject = ['ViewsProvider'];

  
  ngModule.config(Configuration);
  ngModule.controller('VersionMigrationController', [ '$scope' ]);

  return ngModule;
});