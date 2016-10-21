define(function(require) {

  var APILocation = require('app/apiLocations');
  require('angular-ui-router');
  require('app/modules/person/services/module');
  require('app/modules/person/controllers/module');

  return require('angular')
    .module('app.person', [
      'ui.router',
      'app.person.controllers',
      'app.person.services',
      'gumga.core'
    ])
    .config(function($stateProvider, $httpProvider) {
      $stateProvider
        .state('person.list', {
          url: '/list',
          templateUrl: 'app/modules/person/views/list.html',
          controller: 'PersonListController'
        })
        .state('person.insert', {
          url: '/insert',
          templateUrl: 'app/modules/person/views/form.html',
          controller: 'PersonFormController',
          resolve: {
            entity: ['$stateParams', '$http', function($stateParams, $http) {
              return $http.get(APILocation.apiLocation + '/api/juridica/new');
            }]
          }
        })
        .state('person.edit', {
          url: '/edit/:id',
          templateUrl: 'app/modules/person/views/form.html',
          controller: 'PersonFormController',
          resolve: {
            entity: ['$stateParams', '$http', function($stateParams, $http) {
              return $http.get(APILocation.apiLocation + '/api/juridica/loadwithfather/' + $stateParams.id);
            }]
          }
        });
    })
});