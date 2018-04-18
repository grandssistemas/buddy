require('./services/module');
require('./controllers/module');

module.exports = angular
  .module('app.gumgacustomfield', [
    'ui.router',
    'app.gumgacustomfield.controllers',
    'app.gumgacustomfield.services',
    'gumga.core'
  ])
  .config(($stateProvider, $httpProvider) => {
    $stateProvider
      .state('app.gumgacustomfield.list', {
        url: '/list',
        templateUrl: 'app/modules/gumgacustomfield/views/list.html',
        controller: 'GumgaCustomFieldListController'
      })
      .state('app.gumgacustomfield.insert', {
        url: '/insert',
        templateUrl: 'app/modules/gumgacustomfield/views/form.html',
        controller: 'GumgaCustomFieldFormController',
        resolve: {
          entity: ['$http', function($http) {
            return $http.get(APILocation.apiLocation + '/api/gumgacustomfield/new');
          }]
        }
      })
      .state('app.gumgacustomfield.edit', {
        url: '/edit/:id',
        templateUrl: 'app/modules/gumgacustomfield/views/form.html',
        controller: 'GumgaCustomFieldFormController',
        resolve: {
          entity: ['$transition$', '$http', function($transition$, $http) {
            return $http.get(APILocation.apiLocation + '/api/gumgacustomfield/' + $transition$.params().id);
          }]
        }
      });
  })
