require('./services/module');
require('./controllers/module');

module.exports = angular
  .module('app.gumgatagdefinition', [
    'ui.router',
    'app.gumgatagdefinition.controllers',
    'app.gumgatagdefinition.services',
    'gumga.core'
  ])
  .config(($stateProvider, $httpProvider) => {
    $stateProvider
      .state('app.gumgatagdefinition.list', {
        url: '/list',
        templateUrl: 'app/modules/gumgatagdefinition/views/list.html',
        controller: 'GumgaTagDefinitionListController'
      })
      .state('app.gumgatagdefinition.insert', {
        url: '/insert',
        templateUrl: 'app/modules/gumgatagdefinition/views/form.html',
        controller: 'GumgaTagDefinitionFormController',
        resolve: {
          entity: ['$http', function($http) {
            return $http.get(APILocation.apiLocation + '/api/gumgatagdefinition/new');
          }]
        }
      })
      .state('app.gumgatagdefinition.edit', {
        url: '/edit/:id',
        templateUrl: 'app/modules/gumgatagdefinition/views/form.html',
        controller: 'GumgaTagDefinitionFormController',
        resolve: {
          entity: ['$transition$', '$http', function($transition$, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgatagdefinition/' + $transition$.params().id);
          }]
        }
      });
  })
