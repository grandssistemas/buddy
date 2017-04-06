define(function(require) {

  var APILocation = require('apiLocations');
  require('angular-ui-router');
  require('app/modules/company/services/module');
  require('app/modules/company/controllers/module');

  return require('angular')
    .module('app.company', [
      'ui.router',
      'app.company.controllers',
      'app.company.services',
      'gumga.core'
    ])
    .config(function($stateProvider, $httpProvider) {
      $stateProvider
        .state('company.list', {
          url: '/list',
          templateUrl: 'app/modules/company/views/list.html',
          controller: 'CompanyListController'
        })
        .state('company.insert', {
          url: '/insert',
          templateUrl: 'app/modules/company/views/form.html',
          controller: 'CompanyFormController',
          resolve: {
            entity: ['$stateParams', '$http', function($stateParams, $http) {
              return $http.get(APILocation.apiLocation + '/api/juridica/new');
            }]
          }
        })
        .state('company.edit', {
          url: '/edit/:id',
          templateUrl: 'app/modules/company/views/form.html',
          controller: 'CompanyFormController',
          resolve: {
            entity: ['$stateParams', '$http', function($stateParams, $http) {
              return $http.get(APILocation.apiLocation + '/api/juridica/loadwithfather/' + $stateParams.id);
            }]
          }
        });
    })
});